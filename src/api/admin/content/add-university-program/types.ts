import type { UntypedResponse } from "../../../shared/types";
import type { ProgramIn } from "../../types";

export type AddUniversityProgramBody = ProgramIn;

/** Параметры POST /admin/universities/{university_id}/programs */
export interface AddUniversityProgramRequest {
  universityId: string; // uuid
  data: AddUniversityProgramBody;
}

/**
 * Swagger: схема ответа не описана (object).
 * TODO: заменить, когда бэкенд опишет схему в Swagger.
 */
export type AddUniversityProgramResponse = UntypedResponse;
