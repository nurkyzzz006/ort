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

// POST /api/auth/login → POST {backend}/auth/login
// Токены кладутся в HttpOnly cookie, клиент получает только { user }.
export async function POST(req: NextRequest) {
  const csrf = checkCsrf(req);
  if (csrf) return csrf;

  const body = await readJsonBody(req);
  if (!body) return errorResponse(400, "validation_error", "Invalid request");

  const { remember, ...credentials } = body;
  const res = await backendJson<BackendAuthOut>("/auth/login", credentials);

  if (!res.ok || !res.data?.tokens) {
    return NextResponse.json(res.data, { status: res.status });
  }

  const response = NextResponse.json({ user: res.data.user });
  setAuthCookies(response, res.data.tokens, remember !== false);
  return response;
}
