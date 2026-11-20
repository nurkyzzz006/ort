import type { ScoreScale, ScoreScaleIn } from "../../types";

export type CreateScoreScaleBody = ScoreScaleIn;

/** Параметры POST /admin/exam-format-versions/{fv_id}/scales */
export interface CreateScoreScaleRequest {
  formatVersionId: string; // uuid
  data: CreateScoreScaleBody;
}

/** Swagger: POST /admin/exam-format-versions/{fv_id}/scales */
export type CreateScoreScaleResponse = ScoreScale;
