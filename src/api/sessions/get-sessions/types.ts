import type { PaginationParams, TestKind } from "../../shared/types";

/** Query-параметры GET /sessions: limit 1–100 (default 20), offset ≥ 0 */
export type GetSessionsParams = PaginationParams;

/** Swagger: SessionListItem */
export interface SessionListItem {
  id: string; // uuid
  test_id: string; // uuid
  test_code: string;
  title_ky: string;
  title_ru: string;
  kind: TestKind;
  status: string;
  started_at: string; // date-time
  submitted_at: string | null;
  raw_score: number | null;
  max_score: number | null;
  scaled_score: number | null;
}

/** Swagger: SessionListItem[] */
export type GetSessionsResponse = SessionListItem[];
