"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  isThemePreference,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemePreference,
  type UiLocale,
} from "./constants";

interface SettingsContextValue {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemePreference) => void;
  locale: UiLocale;
  setLocale: (locale: UiLocale) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

const safeGet = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSet = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // приватный режим / запрет хранилища — настройка просто не сохранится
  }
};

const systemTheme = (): ResolvedTheme =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

const applyTheme = (theme: ResolvedTheme) =>
  document.documentElement.setAttribute("data-theme", theme);

interface SettingsProviderProps {
  /** Язык, который сервер прочитал из cookie — совпадает с первой отрисовкой */
  initialLocale: UiLocale;
  children: ReactNode;
}

export const SettingsProvider = ({ initialLocale, children }: SettingsProviderProps) => {
  // На сервере и при гидратации — "system": так разметка совпадает.
  // Настоящее значение подхватывается сразу после монтирования
  // (сам цвет темы уже применён inline-скриптом, мигания нет).
  const [theme, setThemeState] = useState<ThemePreference>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");
  const [locale, setLocaleState] = useState<UiLocale>(initialLocale);

  useEffect(() => {
    const saved = safeGet(THEME_STORAGE_KEY);
    const preference = isThemePreference(saved) ? saved : "system";
    // Синхронизация с внешним хранилищем после гидратации
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(preference);
    setResolvedTheme(preference === "system" ? systemTheme() : preference);
    // Язык живёт в localStorage и cookie; cookie нужна серверу
    safeSet(LOCALE_STORAGE_KEY, initialLocale);
  }, [initialLocale]);

  // Следим за системной темой, пока выбран режим "system"
  useEffect(() => {
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const next = media.matches ? "dark" : "light";
      setResolvedTheme(next);
      applyTheme(next);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback((next: ThemePreference) => {
    const resolved = next === "system" ? systemTheme() : next;
    setThemeState(next);
    setResolvedTheme(resolved);
    applyTheme(resolved);
    safeSet(THEME_STORAGE_KEY, next);
  }, []);

  const setLocale = useCallback((next: UiLocale) => {
    setLocaleState(next);
    safeSet(LOCALE_STORAGE_KEY, next);
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
    document.documentElement.lang = next;
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme, locale, setLocale }),
    [theme, resolvedTheme, setTheme, locale, setLocale],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside <SettingsProvider>");
  return ctx;
};
