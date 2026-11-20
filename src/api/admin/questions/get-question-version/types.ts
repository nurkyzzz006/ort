import type { QuestionAdmin } from "../../types";

/** Параметры GET /admin/questions/versions/{version_id} */
export interface GetQuestionVersionRequest {
  versionId: string; // uuid
}

/** Swagger: GET /admin/questions/versions/{version_id} */
export type GetQuestionVersionResponse = QuestionAdmin;
