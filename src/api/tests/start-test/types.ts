import type { Session } from "../../sessions/types";

/** Параметры POST /tests/{test_id}/start */
export interface StartTestRequest {
  testId: string; // uuid
  /**
   * Заголовок Idempotency-Key (maxLength: 64). Если не передан,
   * генерируется автоматически: повтор того же запроса не создаст
   * вторую сессию.
   */
  idempotencyKey?: string;
}

/**
 * Swagger: SessionOut.
 * 201 — новая сессия; 200 — возвращена незавершённая (или с тем же ключом).
 */
export type StartTestResponse = Session;
