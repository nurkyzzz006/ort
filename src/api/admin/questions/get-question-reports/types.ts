import type { UntypedResponse } from "../../../shared/types";

export interface GetQuestionReportsParams {
  /** default: "open"; другие значения в Swagger не перечислены */
  status?: string;
}

/**
 * Swagger: схема ответа не описана (object).
 * TODO: заменить, когда бэкенд опишет схему в Swagger.
 */
export type GetQuestionReportsResponse = UntypedResponse[];
