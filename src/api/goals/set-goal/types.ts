import type { Goal } from "../types";

/**
 * Swagger: GoalIn — задать или заменить цель.
 * Требуется результат пробного экзамена как точка отсчёта.
 */
export interface SetGoalRequest {
  target_score?: number | null;
  program_id?: string | null; // uuid
  exam_date: string; // date, "YYYY-MM-DD"
  minutes_per_day: number; // 10…600
  format_code?: string | null;
}

/** Swagger: GoalOut */
export type SetGoalResponse = Goal;
