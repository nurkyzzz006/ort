
// Форматирование ДЕТЕРМИНИРОВАННОЕ — без Intl и без часового пояса машины:
// сервер (Node, часто без данных локали ky-KG, TZ=UTC) и браузер дают одинаковую
// строку, поэтому нет ошибок hydration, даже если компонент рендерится на сервере.
// Даты показываются по времени Бишкека (UTC+6, без перехода на летнее время) —
// это часовой пояс по умолчанию на бэкенде (Asia/Bishkek).

const BISHKEK_OFFSET_MS = 6 * 60 * 60 * 1000;
const pad = (n: number) => String(n).padStart(2, "0");

/** Части даты по времени Бишкека */
const bishkekParts = (iso: string) => {
  const time = new Date(iso).getTime();
  if (Number.isNaN(time)) return null;
  const d = new Date(time + BISHKEK_OFFSET_MS);
  return { day: d.getUTCDate(), month: d.getUTCMonth() + 1, year: d.getUTCFullYear() };
};

/** "12.12.2026" — формат, привычный и в ky, и в ru */
export const formatDate = (iso: string | null | undefined) => {
  if (!iso) return "—";
  const p = bishkekParts(iso);
  return p ? `${pad(p.day)}.${pad(p.month)}.${p.year}` : "—";
};

/** "12.12" — подписи на графиках */
export const formatShortDate = (iso: string) => {
  const p = bishkekParts(iso);
  return p ? `${pad(p.day)}.${pad(p.month)}` : "";
};

/** 1284 → "1 284" (неразрывный пробел, как в ky и ru) */
export const formatNumber = (value: number) => {
  const [int, frac] = String(Math.abs(value)).split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${value < 0 ? "−" : ""}${grouped}${frac ? `,${frac}` : ""}`;
};

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
