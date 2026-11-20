import { ApiError } from "../axios";

/**
 * Тексты ошибок приходят из словаря интерфейса (src/i18n),
 * поэтому API-слой не зависит от языка.
 */
export interface ErrorMessages {
  byCode: Record<string, string>;
  byStatus: Record<number, string>;
  server: string;
  unknown: string;
}

export const getErrorMessage = (error: unknown, messages: ErrorMessages): string => {
  if (!(error instanceof ApiError)) return messages.unknown;
  if (messages.byCode[error.code]) return messages.byCode[error.code];
  if (messages.byStatus[error.status]) return messages.byStatus[error.status];
  if (error.status >= 500) return messages.server;
  return error.message || messages.unknown;
};

/** Ошибки валидации по полям: { email: "…" } — для подсветки полей формы */
export const getFieldErrors = (error: unknown): Record<string, string> => {
  if (!(error instanceof ApiError)) return {};
  const result: Record<string, string> = {};
  for (const d of error.details) {
    if (d.field && d.message) result[d.field.replace(/^body\./, "")] = d.message;
  }
  return result;
};
