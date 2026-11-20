import type { UntypedResponse } from "../../../shared/types";

/** Параметры POST /admin/question-reports/{report_id}/resolve */
export interface ResolveQuestionReportRequest {
  reportId: string; // uuid
}

/**
 * Swagger: схема ответа не описана (object).
 * TODO: заменить, когда бэкенд опишет схему в Swagger.
 */
export type ResolveQuestionReportResponse = UntypedResponse;
