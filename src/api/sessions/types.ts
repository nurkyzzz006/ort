// Модели, общие для endpoint-ов модуля sessions (сессии тестов/экзаменов)
import type {
  Checkpoint,
  ScaleKind,
  SnapshotOption,
  TestKind,
} from "../shared/types";

/** Swagger: SessionSectionOut */
export interface SessionSection {
  code: string;
  title_ky: string;
  title_ru: string;
  time_limit_sec: number;
  started_at: string | null;
  deadline_at: string | null;
  closed_at: string | null;
}

/** Swagger: SessionQuestionOut */
export interface SessionQuestion {
  id: string; // uuid
  position: number;
  section_code: string | null;
  stem: string;
  options: SnapshotOption[];
  selected_option_id: string | null;
  marked: boolean;
  seq: number;
}

/** Swagger: SessionOut — состояние экрана экзамена */
export interface Session {
  id: string; // uuid
  test_id: string; // uuid
  test_code: string;
  title_ky: string;
  title_ru: string;
  kind: TestKind;
  status: string;
  finish_reason: string | null;
  started_at: string; // date-time
  deadline_at: string; // date-time
  submitted_at: string | null;
  /** Время сервера — для точного таймера на клиенте */
  server_time: string; // date-time
  current_section_code: string | null;
  sections: SessionSection[];
  questions: SessionQuestion[];
}

/** Swagger: ResultSectionOut */
export interface ResultSection {
  code: string;
  title_ky: string;
  title_ru: string;
  raw_score: number;
  max_score: number;
  scaled_score: number | null;
  correct: number;
  wrong: number;
  skipped: number;
}

/** Swagger: ResultQuestionOut */
export interface ResultQuestion {
  id: string; // uuid
  position: number;
  section_code: string | null;
  question_code: string;
  skill_id: string; // uuid
  stem: string;
  options: SnapshotOption[];
  selected_option_id: string | null;
  correct_option_id: string; // uuid
  is_correct: boolean | null;
  solution: string | null;
  time_spent_sec: number;
}

/** Swagger: ResultOut — результат завершённого теста */
export interface SessionResult {
  session_id: string; // uuid
  test_id: string; // uuid
  test_code: string;
  kind: TestKind;
  finish_reason: string;
  started_at: string; // date-time
  submitted_at: string; // date-time
  duration_sec: number;
  raw_score: number;
  max_score: number;
  scaled_score: number | null;
  scale_kind: ScaleKind | null;
  score_is_estimated: boolean;
  correct: number;
  wrong: number;
  skipped: number;
  sections: ResultSection[];
  questions: ResultQuestion[];
  checkpoint: Checkpoint | null;
}
