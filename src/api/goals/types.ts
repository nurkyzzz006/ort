// Модели, общие для endpoint-ов модуля goals
import type { Milestone } from "../shared/types";

/** Swagger: ProgramRef — программа вуза, выбранная как цель */
export interface ProgramRef {
  id: string; // uuid
  university_ky: string;
  university_ru: string;
  title_ky: string;
  title_ru: string;
  year: number;
  threshold_score: number;
  source: string;
}

/** Swagger: GoalOut */
export interface Goal {
  id: string; // uuid
  format_code: string;
  start_score: number;
  target_score: number;
  max_score: number;
  exam_date: string; // date
  days_left: number;
  minutes_per_day: number;
  milestones: Milestone[];
  program?: ProgramRef | null;
  created_at: string; // date-time
}
