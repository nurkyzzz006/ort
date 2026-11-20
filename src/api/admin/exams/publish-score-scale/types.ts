import type { ScoreScale } from "../../types";

/** Параметры POST /admin/score-scales/{scale_id}/publish */
export interface PublishScoreScaleRequest {
  scaleId: string; // uuid
}

/** Swagger: POST /admin/score-scales/{scale_id}/publish */
export type PublishScoreScaleResponse = ScoreScale;
