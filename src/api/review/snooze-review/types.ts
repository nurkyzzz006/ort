import type { UntypedResponse } from "../../shared/types";

/** Параметры POST /review/{card_id}/snooze */
export interface SnoozeReviewRequest {
  cardId: string; // uuid
}

/**
 * Swagger: 200, схема ответа не описана (object).
 * TODO: заменить, когда бэкенд опишет схему в Swagger.
 */
export type SnoozeReviewResponse = UntypedResponse;
