// Хранение токенов.
// «Запомнить меня» → localStorage (остаётся после закрытия браузера),
// иначе → sessionStorage (удаляется при закрытии вкладки).

const ACCESS = "access_token";
const REFRESH = "refresh_token";

const read = (key: string): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key) ?? sessionStorage.getItem(key);
  } catch {
    return null;
  }
};

export const getAccessToken = () => read(ACCESS);
export const getRefreshToken = () => read(REFRESH);

export const saveTokens = (
  access: string,
  refresh: string,
  remember: boolean,
) => {
  clearTokens();
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(ACCESS, access);
  storage.setItem(REFRESH, refresh);
};

export const clearTokens = () => {
  try {
    [localStorage, sessionStorage].forEach((s) => {
      s.removeItem(ACCESS);
      s.removeItem(REFRESH);
    });
  } catch {
    // хранилище недоступно — ничего не делаем
  }
};
