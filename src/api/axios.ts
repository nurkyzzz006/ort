import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

// Все запросы идут в BFF Next.js (тот же домен), а не напрямую на бэкенд.
// Токены хранятся в HttpOnly cookie, поэтому заголовок Authorization здесь
// не нужен: его подставляет /api/proxy на сервере.
export const PROXY_BASE_URL = "/api/proxy";
export const AUTH_BASE_URL = "/api/auth";

declare module "axios" {
  interface AxiosRequestConfig {
    /** Не пытаться обновить сессию при 401 (login, register, сам refresh) */
    skipAuthRefresh?: boolean;
    /** Служебный флаг: запрос уже повторялся после refresh */
    _retried?: boolean;
  }
}

export const api = axios.create({
  baseURL: PROXY_BASE_URL,
  withCredentials: true,
  headers: {
    // Обязательный заголовок для CSRF-защиты BFF (src/server/bff/http.ts)
    "X-Requested-With": "XMLHttpRequest",
  },
});

// ─── Ошибки ────────────────────────────────────────────────────────────────

interface BackendErrorBody {
  error?: {
    code?: string;
    message?: string;
    details?: ApiErrorDetail[] | null;
    request_id?: string | null;
  };
}

export interface ApiErrorDetail {
  field?: string;
  message?: string;
}

/** Единый тип ошибки для всех запросов. */
export class ApiError extends Error {
  readonly status: number; // 0 — сеть недоступна
  readonly code: string;
  readonly details: ApiErrorDetail[];
  readonly requestId: string | null;

  constructor(params: {
    status: number;
    code: string;
    message: string;
    details?: ApiErrorDetail[] | null;
    requestId?: string | null;
  }) {
    super(params.message);
    this.name = "ApiError";
    this.status = params.status;
    this.code = params.code;
    this.details = params.details ?? [];
    this.requestId = params.requestId ?? null;
  }

  get isUnauthorized() {
    return this.status === 401;
  }
  get isForbidden() {
    return this.status === 403;
  }
  get isNetworkError() {
    return this.status === 0;
  }
}

const toApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) return error;
  if (error instanceof AxiosError) {
    if (!error.response) {
      return new ApiError({
        status: 0,
        code: "network_error",
        message: "Network error",
      });
    }
    const body = error.response.data as BackendErrorBody | undefined;
    return new ApiError({
      status: error.response.status,
      code: body?.error?.code ?? `http_${error.response.status}`,
      message: body?.error?.message ?? error.message,
      details: body?.error?.details,
      requestId: body?.error?.request_id,
    });
  }
  return new ApiError({ status: 0, code: "unknown", message: String(error) });
};

// ─── Обновление сессии ─────────────────────────────────────────────────────

// Один общий refresh на все параллельные запросы: если access-токен истёк,
// десять запросов получат 401, но refresh выполнится ОДИН раз, а остальные
// дождутся его и повторятся.
/**
 * ok      — сессия обновлена;
 * expired — refresh-токен недействителен (BFF уже удалил cookie);
 * failed  — временная ошибка (сеть, 5xx): сессию не трогаем.
 */
export type RefreshResult = "ok" | "expired" | "failed";

let refreshPromise: Promise<RefreshResult> | null = null;

export const refreshSession = (): Promise<RefreshResult> => {
  if (!refreshPromise) {
    refreshPromise = api
      .post("/refresh", undefined, {
        baseURL: AUTH_BASE_URL,
        skipAuthRefresh: true,
      })
      .then((): RefreshResult => "ok")
      .catch((err: unknown): RefreshResult => {
        const status = err instanceof ApiError ? err.status : 0;
        const expired = status === 401 || status === 403;
        // Один вызов на всю пачку параллельных запросов, а не на каждый.
        // Только при окончательно истёкшей сессии (cookie уже удалены),
        // иначе /login ↔ /dashboard могли бы перенаправлять друг на друга.
        if (expired) onSessionExpired?.();
        return expired ? "expired" : "failed";
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

// Подписка на «сессия окончательно истекла» (refresh не помог).
// Регистрируется один раз в провайдере, а не в каждом компоненте.
type SessionExpiredHandler = () => void;
let onSessionExpired: SessionExpiredHandler | null = null;
export const setSessionExpiredHandler = (handler: SessionExpiredHandler) => {
  onSessionExpired = handler;
};

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    const apiError = toApiError(error);
    const config =
      error instanceof AxiosError
        ? (error.config as InternalAxiosRequestConfig | undefined)
        : undefined;

    const canRefresh =
      apiError.status === 401 &&
      apiError.code !== "no_session" && // гостя обновлять нечем
      config &&
      !config.skipAuthRefresh &&
      !config._retried; // не более одного повтора — без бесконечных циклов

    if (canRefresh) {
      const result = await refreshSession();
      if (result === "ok") {
        const retryConfig: AxiosRequestConfig = { ...config, _retried: true };
        return api.request(retryConfig);
      }
    }

    return Promise.reject(apiError);
  },
);
