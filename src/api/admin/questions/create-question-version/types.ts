import type { QuestionAdmin } from "../../types";

/** Параметры POST /admin/questions/versions/{version_id}/new-version */
export interface CreateQuestionVersionRequest {
  versionId: string; // uuid
}

/** Swagger: POST /admin/questions/versions/{version_id}/new-version */
export type CreateQuestionVersionResponse = QuestionAdmin;
