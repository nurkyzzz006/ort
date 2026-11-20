import { NextResponse, type NextRequest } from "next/server";
import { COOKIE } from "@/server/bff/config";

// Защита маршрутов до рендера страницы.
// Проверяется только наличие сессии (cookie). Роли проверяет RoleGuard,
// а окончательно права всегда проверяет бэкенд.

const PROTECTED_PREFIXES = ["/dashboard"];
const GUEST_ONLY = ["/login", "/register", "/forgot-password", "/reset-password"];

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const hasSession =
    req.cookies.has(COOKIE.refresh) || req.cookies.has(COOKIE.access);

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (isProtected && !hasSession) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  if (GUEST_ONLY.includes(pathname) && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};
