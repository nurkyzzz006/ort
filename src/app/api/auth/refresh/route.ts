import { NextResponse, type NextRequest } from "next/server";
import {
  clearAuthCookies,
  readTokens,
  setAuthCookies,
} from "@/server/bff/cookies";
import { checkCsrf, errorResponse } from "@/server/bff/http";
import { refreshTokens } from "@/server/bff/refresh";

// POST /api/auth/refresh → POST {backend}/auth/refresh
// refresh-токен берётся из HttpOnly cookie; клиент его никогда не видит.
export async function POST(req: NextRequest) {
  const csrf = checkCsrf(req);
  if (csrf) return csrf;

  const { refresh, remember } = readTokens(req);
  if (!refresh) {
    const response = errorResponse(401, "no_session", "Not signed in");
    clearAuthCookies(response);
    return response;
  }

  const res = await refreshTokens(refresh);

  if (!res.ok || !res.data) {
    // Refresh-токен недействителен — сессия окончена.
    const response = NextResponse.json(res.data, { status: res.status });
    if (res.status === 401 || res.status === 403) clearAuthCookies(response);
    return response;
  }

  const response = new NextResponse(null, { status: 204 });
  setAuthCookies(response, res.data, remember);
  return response;
}
