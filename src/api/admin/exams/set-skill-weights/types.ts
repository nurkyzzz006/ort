import type { UntypedResponse } from "../../../shared/types";
import type { SkillWeightIn } from "../../types";

export type SetSkillWeightsBody = SkillWeightIn[];

/** Параметры PUT /admin/exam-format-versions/{fv_id}/skill-weights */
export interface SetSkillWeightsRequest {
  formatVersionId: string; // uuid
  data: SetSkillWeightsBody;
}

/**
 * Swagger: схема ответа не описана (object).
 * TODO: заменить, когда бэкенд опишет схему в Swagger.
 */
export type SetSkillWeightsResponse = UntypedResponse;
