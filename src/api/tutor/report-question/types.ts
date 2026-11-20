import type { UntypedResponse } from "../../shared/types";

/** Swagger: ReportIn — «вопрос или объяснение неверны / непонятны» */
export interface ReportQuestionRequest {
  question_version_id: string; // uuid
  /** Тип жалобы; допустимые значения в Swagger не описаны */
  kind: string;
  comment?: string | null;
}

/**
 * Swagger: 201, схема ответа не описана (object).
 * TODO: заменить, когда бэкенд опишет схему в Swagger.
 */
export type ReportQuestionResponse = UntypedResponse;
