import type { QuestionAdmin, QuestionUpdateIn } from "../../types";

export type UpdateQuestionVersionBody = QuestionUpdateIn;

/** Параметры PATCH /admin/questions/versions/{version_id} */
export interface UpdateQuestionVersionRequest {
  versionId: string; // uuid
  data: UpdateQuestionVersionBody;
}

/** Swagger: PATCH /admin/questions/versions/{version_id} */
export type UpdateQuestionVersionResponse = QuestionAdmin;
