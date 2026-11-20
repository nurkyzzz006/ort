import type { UiLocale } from "@/settings/constants";

// Форматирование выполняется только на клиенте (данные приходят из React Query
// после монтирования), поэтому часовой пояс браузера не вызывает ошибок hydration.

const intlLocale = (locale: UiLocale) => (locale === "ru" ? "ru-RU" : "ky-KG");

export const formatDate = (iso: string | null | undefined, locale: UiLocale) => {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(intlLocale(locale), {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

export const formatShortDate = (iso: string, locale: UiLocale) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(intlLocale(locale), {
    day: "2-digit",
    month: "2-digit",
  }).format(date);
};

export const formatNumber = (value: number, locale: UiLocale) =>
  new Intl.NumberFormat(intlLocale(locale)).format(value);

/** 0.78 → "78%"; null → "—" (ТЗ 4.8: пустые данные — не «0%») */
export const formatPercent = (ratio: number | null | undefined) =>
  ratio === null || ratio === undefined ? "—" : `${Math.round(ratio * 100)}%`;

/** Секунды → "mm:ss" или "h:mm:ss" */
export const formatClock = (totalSeconds: number) => {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
};

/** Минуты из секунд, округление вверх */
export const toMinutes = (seconds: number) => Math.ceil(seconds / 60);

/** Доля в диапазоне 0…1 из значения, которое может прийти как 0…1 или 0…100 */
export const toRatio = (value: number | null | undefined) => {
  if (value === null || value === undefined) return null;
  return value > 1 ? value / 100 : value;
};
