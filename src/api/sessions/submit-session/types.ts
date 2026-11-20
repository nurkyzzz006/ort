import type { SessionResult } from "../types";

/** Параметры POST /sessions/{session_id}/submit */
export interface SubmitSessionRequest {
  sessionId: string; // uuid
}

/** Swagger: ResultOut */
export type SubmitSessionResponse = SessionResult;
