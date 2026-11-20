import type { PracticeFeedback } from "../types";

/** Swagger: PracticeAnswerIn */
export interface AnswerPracticeBody {
  option_id: string; // uuid
  time_spent_sec?: number; // ≥ 0, default: 0
}

/** Параметры POST /practice/sessions/{session_id}/answers/{question_id} */
export interface AnswerPracticeRequest {
  sessionId: string; // uuid
  questionId: string; // uuid
  data: AnswerPracticeBody;
}

/** Swagger: FeedbackOut — неверный ответ попадает в журнал ошибок */
export type AnswerPracticeResponse = PracticeFeedback;
