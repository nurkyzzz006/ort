import type { UntypedResponse } from "../../shared/types";

/** Query-параметры GET /universities/programs */
export interface GetUniversityProgramsParams {
  q?: string | null; // поиск, maxLength: 100
  max_score?: number | null; // ≥ 0 — программы с порогом не выше балла
}

/**
 * Swagger: массив object без описанной схемы — прошлые пороги
 * бюджетных мест с годом и источником.
 * TODO: заменить, когда бэкенд опишет схему в Swagger.
 */
export type GetUniversityProgramsResponse = UntypedResponse[];
