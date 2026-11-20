import type { CardStatus, Page, PaginationParams } from "../../shared/types";
import type { MistakeCard } from "../types";

/** Swagger: AttemptSource — где была допущена ошибка */
export type AttemptSource = "test" | "practice" | "review";

/** Query-параметры GET /mistakes: limit 1–100 (default 20), offset ≥ 0 */
export interface GetMistakesParams extends PaginationParams {
  status?: CardStatus | null;
  skill_id?: string | null; // uuid
  source?: AttemptSource | null;
}

/** Swagger: CardPage */
export type GetMistakesResponse = Page<MistakeCard>;
