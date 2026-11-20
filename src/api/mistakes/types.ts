// Модели, общие для endpoint-ов модуля mistakes (журнал ошибок)
import type { CardStatus, MistakeReason, SnapshotOption } from "../shared/types";

/** Swagger: CardOut — карточка ошибки */
export interface MistakeCard {
  id: string; // uuid
  status: CardStatus;
  source: string;
  reason: MistakeReason | null;
  skill_id: string; // uuid
  question_code: string;
  stem: string;
  options: SnapshotOption[];
  selected_option_id: string | null;
  correct_option_id: string; // uuid
  solution: string | null;
  error_count: number;
  consecutive_successes: number;
  due_at: string | null;
  created_at: string; // date-time
}
