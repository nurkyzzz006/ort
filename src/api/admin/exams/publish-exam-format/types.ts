import type { ExamFormatVersion } from "../../types";

/** Параметры POST /admin/exam-format-versions/{fv_id}/publish */
export interface PublishExamFormatRequest {
  formatVersionId: string; // uuid
}

/** Swagger: POST /admin/exam-format-versions/{fv_id}/publish */
export type PublishExamFormatResponse = ExamFormatVersion;
