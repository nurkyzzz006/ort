import type { UntypedResponse } from "../../../shared/types";
import type { ProgramUpdateIn } from "../../types";

export type UpdateUniversityProgramBody = ProgramUpdateIn;

/** Параметры PATCH /admin/university-programs/{program_id} */
export interface UpdateUniversityProgramRequest {
  programId: string; // uuid
  data: UpdateUniversityProgramBody;
}

/**
 * Swagger: схема ответа не описана (object).
 * TODO: заменить, когда бэкенд опишет схему в Swagger.
 */
export type UpdateUniversityProgramResponse = UntypedResponse;
