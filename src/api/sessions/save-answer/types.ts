/** Swagger: AnswerIn */
export interface SaveAnswerBody {
  option_id?: string | null; // null — снять ответ
  marked?: boolean | null; // отметка «вернуться позже»
  /** Порядковый номер изменения (1…2 000 000 000): старые seq сервер игнорирует */
  seq: number;
  time_spent_sec?: number | null;
}

/** Параметры PUT /sessions/{session_id}/answers/{question_id} */
export interface SaveAnswerRequest {
  sessionId: string; // uuid
  questionId: string; // uuid
  data: SaveAnswerBody;
}

/** Swagger: AnswerOut */
export interface SaveAnswerResponse {
  question_id: string; // uuid
  option_id: string | null;
  marked: boolean;
  seq: number;
  /** false — изменение устарело (пришёл более новый seq) */
  applied: boolean;
  answered_at: string | null;
  server_time: string; // date-time
}
