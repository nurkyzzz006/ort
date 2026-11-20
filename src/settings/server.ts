import { cookies } from "next/headers";
import { DEFAULT_LOCALE, isUiLocale, LOCALE_COOKIE, type UiLocale } from "./constants";

/** Язык интерфейса на сервере (из cookie, иначе — по умолчанию) */
export const getServerLocale = async (): Promise<UiLocale> => {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isUiLocale(value) ? value : DEFAULT_LOCALE;
};
