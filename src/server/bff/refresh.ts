import { backendJson } from "./http";
import type { BackendTokens } from "./cookies";

type RefreshResult = Awaited<ReturnType<typeof callRefresh>>;

const callRefresh = (refreshToken: string) =>
  backendJson<BackendTokens>("/auth/refresh", { refresh_token: refreshToken });

/**
 * Бэкенд выдаёт НОВЫЙ refresh-токен при каждом refresh (ротация),
 * поэтому два параллельных refresh с одним и тем же токеном сломали бы сессию.
 * Здесь одинаковые запросы (например, из двух вкладок) объединяются в один,
 * а результат кэшируется на 15 секунд.
 *
 * Ограничение: кэш живёт в памяти одного серверного процесса. На клиенте
 * параллельные запросы дополнительно объединяются в src/api/axios.ts.
 */
const inFlight = new Map<string, Promise<RefreshResult>>();
const RESULT_TTL_MS = 15_000;

export const refreshTokens = (refreshToken: string): Promise<RefreshResult> => {
  const existing = inFlight.get(refreshToken);
  if (existing) return existing;

  const promise = callRefresh(refreshToken);
  inFlight.set(refreshToken, promise);
  promise.finally(() => {
    setTimeout(() => inFlight.delete(refreshToken), RESULT_TTL_MS);
  });
  return promise;
};
