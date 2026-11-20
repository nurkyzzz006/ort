const DEFAULT_REDIRECT = "/dashboard";

/**
 * Адрес возврата после входа из ?next=…
 * Разрешены только внутренние пути — защита от open redirect
 * (например, ?next=//evil.com или ?next=https://evil.com).
 */
export const getRedirectTarget = (): string => {
  if (typeof window === "undefined") return DEFAULT_REDIRECT;
  const next = new URLSearchParams(window.location.search).get("next");
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return DEFAULT_REDIRECT;
  }
  return next;
};
