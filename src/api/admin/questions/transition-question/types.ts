import type { QuestionAdmin, TransitionIn } from "../../types";

export type TransitionQuestionBody = TransitionIn;

/** Параметры POST /admin/questions/versions/{version_id}/transition */
export interface TransitionQuestionRequest {
  versionId: string; // uuid
  data: TransitionQuestionBody;
}

/** Swagger: POST /admin/questions/versions/{version_id}/transition */
export type TransitionQuestionResponse = QuestionAdmin;
