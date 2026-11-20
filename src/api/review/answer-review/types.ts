import type { CardStatus } from "../../shared/types";

/** Swagger: ReviewAnswerIn */
export interface AnswerReviewBody {
  option_id: string; // uuid
  time_spent_sec?: number; // ≥ 0, default: 0
}

/** Параметры POST /review/{card_id}/answer */
export interface AnswerReviewRequest {
  cardId: string; // uuid
  data: AnswerReviewBody;
  /**
   * Заголовок Idempotency-Key (maxLength: 64): повторный запрос вернёт тот же
   * результат и не сдвинет карточку второй раз. Генерируется автоматически.
   */
  idempotencyKey?: string;
}

/** Swagger: ReviewResultOut */
export interface AnswerReviewResponse {
  is_correct: boolean;
  selected_option_id: string; // uuid
  correct_option_id: string; // uuid
  solution: string | null;
  card_id: string; // uuid
  status: CardStatus;
  consecutive_successes: number;
  next_due_at: string | null;
  interval_days: number;
}
