import type { Prediction } from "../../shared/types";
import type { Goal } from "../types";

/** Swagger: GoalProgressOut — положение ученика относительно цели */
export interface GetGoalProgressResponse {
  goal: Goal;
  current_score: number | null;
  gap: number | null;
  next_milestone: number | null;
  track: string;
  expected_score_today: number;
  /** Хватит ли оставшегося времени */
  feasible: boolean;
  minutes_needed: number;
  minutes_available: number;
  max_reachable: number;
  prediction: Prediction;
}
