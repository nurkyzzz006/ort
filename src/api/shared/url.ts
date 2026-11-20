/**
 * Безопасная сборка пути с параметрами:
 *   apiPath`/sessions/${id}/answers/${questionId}`
 * Каждое подставленное значение кодируется (encodeURIComponent),
 * поэтому «/», «?» или «..» в id не изменят адрес запроса.
 */
export const apiPath = (
  strings: TemplateStringsArray,
  ...values: (string | number)[]
): string =>
  strings.reduce(
    (acc, part, i) =>
      acc + part + (i < values.length ? encodeURIComponent(String(values[i])) : ""),
    "",
  );

/** Ключ идемпотентности для запросов, которые нельзя выполнить дважды */
export const createIdempotencyKey = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
