import type { QuestionReview } from "../../types";

/** Параметры GET /admin/questions/versions/{version_id}/reviews */
export interface GetQuestionReviewsRequest {
  versionId: string; // uuid
}

/** Swagger: GET /admin/questions/versions/{version_id}/reviews */
export type GetQuestionReviewsResponse = QuestionReview[];
