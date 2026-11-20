import type { PracticeSession } from "../types";

/** Swagger: PracticeStartIn — по навыку, теме или пункту плана */
export interface StartPracticeRequest {
  skill_id?: string | null; // uuid
  topic_id?: string | null; // uuid
  count?: number; // 1…30, default: 10
  plan_item_id?: string | null; // uuid
}

/** Swagger: 201 PracticeOut */
export type StartPracticeResponse = PracticeSession;
