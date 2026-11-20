// Чтение текущего времени вынесено из рендера компонентов:
// React Compiler требует, чтобы рендер был чистым (без Date.now()).

/** Текущее время, мс */
export const nowMs = () => Date.now();

/** Сколько целых секунд прошло с момента start (мс) */
export const secondsSince = (start: number) => Math.max(0, Math.round((Date.now() - start) / 1000));

/** Срок прошёл больше суток назад */
export const isOverdue = (iso: string) => new Date(iso).getTime() < Date.now() - 24 * 3600 * 1000;
