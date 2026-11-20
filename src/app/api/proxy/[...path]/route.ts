import type { NextRequest } from "next/server";
import { readTokens } from "@/server/bff/cookies";
import { backendFetch, checkCsrf, errorResponse } from "@/server/bff/http";

// /api/proxy/<path> → {backend}/<path>
// Подставляет access-токен из HttpOnly cookie в заголовок Authorization.

// Эти endpoint-ы возвращают или принимают токены — только через /api/auth/*,
// иначе токены попали бы в клиентский JavaScript.
const BLOCKED = new Set([
  "auth/login",
  "auth/register",
  "auth/refresh",
  "auth/logout",
  "auth/logout-all",
]);

const FORWARD_REQUEST_HEADERS = [
  "content-type",
  "accept",
  "accept-language",
  "idempotency-key",
  "x-request-id",
];

const FORWARD_RESPONSE_HEADERS = [
  "content-type",
  "content-disposition",
  "content-length",
  "cache-control",
  "etag",
  "last-modified",
  "x-request-id",
];

async function handler(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const csrf = checkCsrf(req);
  if (csrf) return csrf;

  const { path } = await ctx.params;
  const joined = path.map(encodeURIComponent).join("/");
  // Запрещаем выход за пределы API (/../) и токен-endpoint-ы
  if (path.some((s) => s === ".." || s === ".") || BLOCKED.has(path.join("/"))) {
    return errorResponse(404, "not_found", "Not found");
  }

  const { access, refresh } = readTokens(req);

  // access-cookie истекает вместе с токеном. Если его нет, но есть refresh —
  // сразу просим клиента обновить сессию, не тратя запрос к бэкенду.
  if (!access && refresh) {
    return errorResponse(401, "token_expired", "Access token expired");
  }

  const headers = new Headers();
  for (const name of FORWARD_REQUEST_HEADERS) {
    const value = req.headers.get(name);
    if (value) headers.set(name, value);
  }
  if (access) headers.set("authorization", `Bearer ${access}`);

  const hasBody = req.method !== "GET" && req.method !== "HEAD";

  let upstream: Response;
  try {
    upstream = await backendFetch(`/${joined}${req.nextUrl.search}`, {
      method: req.method,
      headers,
      body: hasBody ? await req.arrayBuffer() : undefined,
    });
  } catch {
    return errorResponse(502, "backend_unavailable", "Backend is unavailable");
  }

  const responseHeaders = new Headers();
  for (const name of FORWARD_RESPONSE_HEADERS) {
    const value = upstream.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }

  // Гость (нет ни одной cookie) обратился к защищённому endpoint-у:
  // помечаем, чтобы клиент не пытался делать бессмысленный refresh.
  if (upstream.status === 401 && !access && !refresh) {
    return errorResponse(401, "no_session", "Authentication required");
  }

  const noBody = upstream.status === 204 || upstream.status === 304;
  return new Response(noBody ? null : upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
