import { NextResponse, type NextRequest } from "next/server";
import { clearAuthCookies, readTokens } from "@/server/bff/cookies";
import { backendJson, checkCsrf, errorResponse } from "@/server/bff/http";

// POST /api/auth/logout-all → POST {backend}/auth/logout-all (нужен access-токен)
// Если access-токен истёк, возвращаем 401 — клиент сделает refresh и повторит.
export async function POST(req: NextRequest) {
  const csrf = checkCsrf(req);
  if (csrf) return csrf;

  const { access, refresh } = readTokens(req);
  if (!access) {
    return refresh
      ? errorResponse(401, "token_expired", "Access token expired")
      : errorResponse(401, "no_session", "Not signed in");
  }

  const res = await backendJson("/auth/logout-all", undefined, {
    Authorization: `Bearer ${access}`,
  });

  if (!res.ok && res.status !== 401) {
    return NextResponse.json(res.data, { status: res.status });
  }
  if (res.status === 401) {
    return errorResponse(401, "token_expired", "Access token expired");
  }

  const response = new NextResponse(null, { status: 204 });
  clearAuthCookies(response);
  return response;
}
