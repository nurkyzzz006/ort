import type { Session } from "../types";

/** Параметры POST /sessions/{session_id}/sections/{section_code}/close */
export interface CloseSectionRequest {
  sessionId: string; // uuid
  sectionCode: string;
}

/** Swagger: SessionOut — сессия после закрытия раздела */
export type CloseSectionResponse = Session;
