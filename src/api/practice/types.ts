// Модели, общие для endpoint-ов модуля practice
import type { SnapshotOption } from "../shared/types";

/** Swagger: FeedbackOut — мгновенная проверка ответа */
export interface PracticeFeedback {
  is_correct: boolean;
  selected_option_id: string; // uuid
  correct_option_id: string; // uuid
  /** Проверенное решение */
  solution: string | null;
}

/** Swagger: PracticeQuestionOut */
export interface PracticeQuestion {
  id: string; // uuid
  position: number;
  question_version_id: string; // uuid
  skill_id: string; // uuid
  stem: string;
  options: SnapshotOption[];
  /** null — на вопрос ещё не ответили */
  feedback: PracticeFeedback | null;
}

/** Swagger: PracticeOut */
export interface PracticeSession {
  id: string; // uuid
  status: string;
  skill_id: string | null;
  topic_id: string | null;
  total: number;
  answered: number;
  correct: number;
  questions: PracticeQuestion[];
}
