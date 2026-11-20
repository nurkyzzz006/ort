import type { NextRequest, NextResponse } from "next/server";
import { COOKIE, COOKIE_SECURE, REFRESH_MAX_AGE } from "./config";

export interface BackendTokens {
  access_token: string;
  refresh_token: string;
  token_type?: string;
  expires_in: number;
}

const base = {
  httpOnly: true, // недоступны из JavaScript
  secure: COOKIE_SECURE, // только HTTPS в production
  sameSite: "lax" as const, // не отправляются в кросс-сайтовых POST
  path: "/",
};

export const readTokens = (req: NextRequest) => ({
  access: req.cookies.get(COOKIE.access)?.value ?? null,
  refresh: req.cookies.get(COOKIE.refresh)?.value ?? null,
  remember: req.cookies.get(COOKIE.remember)?.value !== "0",
});

export const setAuthCookies = (
  res: NextResponse,
  tokens: BackendTokens,
  remember: boolean,
) => {
  // access-cookie живёт столько же, сколько токен (минус запас 10 с),
  // поэтому истёкший токен просто исчезает и BFF сразу просит refresh.
  const accessAge = Math.max(tokens.expires_in - 10, 1);

  res.cookies.set(COOKIE.access, tokens.access_token, {
    ...base,
    maxAge: accessAge,
  });
  res.cookies.set(COOKIE.refresh, tokens.refresh_token, {
    ...base,
    // без maxAge — session-cookie, удаляется при закрытии браузера
    ...(remember ? { maxAge: REFRESH_MAX_AGE } : {}),
  });
  res.cookies.set(COOKIE.remember, remember ? "1" : "0", {
    ...base,
    ...(remember ? { maxAge: REFRESH_MAX_AGE } : {}),
  });
};

export const clearAuthCookies = (res: NextResponse) => {
  for (const name of Object.values(COOKIE)) {
    res.cookies.set(name, "", { ...base, maxAge: 0 });
  }
};
