import type { PracticeSession } from "../types";

/** Параметры POST /practice/sessions/{session_id}/finish */
export interface FinishPracticeRequest {
  sessionId: string; // uuid
}

/** Swagger: PracticeOut */
export type FinishPracticeResponse = PracticeSession;
