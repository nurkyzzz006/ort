import { NextResponse, type NextRequest } from "next/server";
import { clearAuthCookies, readTokens } from "@/server/bff/cookies";
import { backendJson, checkCsrf } from "@/server/bff/http";

// POST /api/auth/logout → POST {backend}/auth/logout
// Cookie удаляются в любом случае, даже если бэкенд недоступен.
export async function POST(req: NextRequest) {
  const csrf = checkCsrf(req);
  if (csrf) return csrf;

  const { refresh } = readTokens(req);
  if (refresh) {
    await backendJson("/auth/logout", { refresh_token: refresh }).catch(
      () => null,
    );
  }

  const response = new NextResponse(null, { status: 204 });
  clearAuthCookies(response);
  return response;
}
