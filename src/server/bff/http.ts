import { NextResponse, type NextRequest } from "next/server";
import { BACKEND_URL, CSRF_HEADER, CSRF_HEADER_VALUE } from "./config";

// Ошибки BFF в том же формате, что и у бэкенда: { error: { code, message, ... } }
export const errorResponse = (status: number, code: string, message: string) =>
  NextResponse.json(
    { error: { code, message, details: null, request_id: null } },
    { status },
  );

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * Защита от CSRF для изменяющих запросов:
 * 1) cookie с SameSite=Lax не уходят в кросс-сайтовых POST;
 * 2) Origin / Sec-Fetch-Site должны совпадать с нашим сайтом;
 * 3) обязателен заголовок X-Requested-With — чужой сайт не может
 *    его отправить без CORS-preflight, а CORS на BFF не разрешён.
 * Возвращает ответ-ошибку или null, если запрос допустим.
 */
export const checkCsrf = (req: NextRequest): NextResponse | null => {
  if (SAFE_METHODS.has(req.method)) return null;

  const fetchSite = req.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") {
    return errorResponse(403, "csrf_failed", "Cross-site request blocked");
  }

  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  let originHost: string | null = null;
  try {
    originHost = origin ? new URL(origin).host : null;
  } catch {
    originHost = null;
  }
  if (!originHost || originHost !== host) {
    return errorResponse(403, "csrf_failed", "Invalid request origin");
  }

  if (req.headers.get(CSRF_HEADER) !== CSRF_HEADER_VALUE) {
    return errorResponse(403, "csrf_failed", "Missing CSRF header");
  }

  return null;
};

/** Запрос к бэкенду (только на сервере). */
export const backendFetch = (path: string, init: RequestInit = {}) =>
  fetch(`${BACKEND_URL}${path}`, { ...init, cache: "no-store" });

/** JSON-запрос к бэкенду; возвращает статус и разобранное тело. */
export const backendJson = async <T>(
  path: string,
  body: unknown,
  headers: Record<string, string> = {},
): Promise<{ ok: boolean; status: number; data: T | null }> => {
  const res = await backendFetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let data: T | null = null;
  try {
    data = text ? (JSON.parse(text) as T) : null;
  } catch {
    data = null;
  }
  return { ok: res.ok, status: res.status, data };
};

/** Безопасно читает JSON-тело входящего запроса. */
export const readJsonBody = async (
  req: NextRequest,
): Promise<Record<string, unknown> | null> => {
  try {
    const body: unknown = await req.json();
    return body && typeof body === "object" && !Array.isArray(body)
      ? (body as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
};
