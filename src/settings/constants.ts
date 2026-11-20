// Несекретные настройки интерфейса. Токены и пароли здесь НЕ хранятся.

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

/** Языки интерфейса по ТЗ и макетам: кыргызский и русский */
export type UiLocale = "ky" | "ru";

export const UI_LOCALES: readonly UiLocale[] = ["ky", "ru"];
export const DEFAULT_LOCALE: UiLocale = "ky";

export const THEME_STORAGE_KEY = "orto-theme";
export const LOCALE_STORAGE_KEY = "orto-locale";

/**
 * Язык дублируется в cookie, чтобы сервер сразу отрисовал страницу
 * на нужном языке (без мигания и ошибок hydration).
 * Cookie не HttpOnly — это обычная настройка, а не секрет.
 */
export const LOCALE_COOKIE = "orto_locale";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const isUiLocale = (value: unknown): value is UiLocale =>
  value === "ky" || value === "ru";

export const isThemePreference = (value: unknown): value is ThemePreference =>
  value === "light" || value === "dark" || value === "system";

/**
 * Выполняется в <head> до первой отрисовки: применяет сохранённую тему,
 * а при первом визите — системную (prefers-color-scheme).
 */
export const THEME_INIT_SCRIPT = `(function(){try{var p=localStorage.getItem("${THEME_STORAGE_KEY}");if(p!=="light"&&p!=="dark")p=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",p)}catch(e){}})()`;
