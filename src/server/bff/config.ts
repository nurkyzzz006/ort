// Серверная конфигурация BFF. Импортируется ТОЛЬКО из Route Handlers и src/proxy.ts.

export const BACKEND_URL =
  process.env.BACKEND_URL ?? "http://16.179.209.67/orto/api/v1";

// Secure-cookie включаются в production (HTTPS, например Vercel).
// Для self-hosted production без HTTPS можно выставить COOKIE_SECURE=false,
// но это небезопасно — используйте HTTPS.
export const COOKIE_SECURE =
  process.env.COOKIE_SECURE !== undefined
    ? process.env.COOKIE_SECURE === "true"
    : process.env.NODE_ENV === "production";

// Префикс __Host- запрещает подмену cookie с поддоменов (требует Secure + path=/).
const prefix = COOKIE_SECURE ? "__Host-" : "";

export const COOKIE = {
  access: `${prefix}orto_at`,
  refresh: `${prefix}orto_rt`,
  // «Запомнить меня»: 1 — постоянные cookie, 0 — до закрытия браузера
  remember: `${prefix}orto_rm`,
} as const;

// Бэкенд не сообщает срок жизни refresh-токена — держим cookie 30 дней.
// Если бэкенд отзовёт токен раньше, refresh вернёт 401 и сессия завершится.
export const REFRESH_MAX_AGE = 60 * 60 * 24 * 30;

// Заголовок, который обязан присылать наш Axios (защита от CSRF)
export const CSRF_HEADER = "x-requested-with";
export const CSRF_HEADER_VALUE = "XMLHttpRequest";
