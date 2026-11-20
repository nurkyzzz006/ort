import type { QuestionPage, QuestionStatus } from "../../types";
import type { Locale, PaginationParams } from "../../../shared/types";

/** Query-параметры: limit 1–100 (default 50), offset ≥ 0 */
export interface GetAdminQuestionsParams extends PaginationParams {
  status?: QuestionStatus | null;
  language?: Locale | null;
  skill_id?: string | null; // uuid
}

/** Swagger: GET /admin/questions */
export type GetAdminQuestionsResponse = QuestionPage;
