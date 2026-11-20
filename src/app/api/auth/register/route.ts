import { NextResponse, type NextRequest } from "next/server";
import { setAuthCookies, type BackendTokens } from "@/server/bff/cookies";
import {
  backendJson,
  checkCsrf,
  errorResponse,
  readJsonBody,
} from "@/server/bff/http";

interface BackendAuthOut {
  user: unknown;
  tokens: BackendTokens;
}

// POST /api/auth/register → POST {backend}/auth/register
// После регистрации пользователь сразу авторизован (бэкенд возвращает токены).
export async function POST(req: NextRequest) {
  const csrf = checkCsrf(req);
  if (csrf) return csrf;

  const body = await readJsonBody(req);
  if (!body) return errorResponse(400, "validation_error", "Invalid request");

  const res = await backendJson<BackendAuthOut>("/auth/register", body);

  if (!res.ok || !res.data?.tokens) {
    return NextResponse.json(res.data, { status: res.status });
  }

  const response = NextResponse.json(
    { user: res.data.user },
    { status: res.status },
  );
  setAuthCookies(response, res.data.tokens, true);
  return response;
}
