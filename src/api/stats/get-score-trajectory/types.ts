import type { Milestone, Prediction } from "../../shared/types";

/** Swagger: TrajectoryPoint */
export interface TrajectoryPoint {
  taken_at: string; // date-time
  kind: string;
  total_scaled: number | null;
  total_raw: number;
  max_raw: number;
}

/** Swagger: TrajectoryOut — траектория балла к цели */
export interface GetScoreTrajectoryResponse {
  points: TrajectoryPoint[];
  target_score: number | null;
  exam_date: string | null;
  milestones: Milestone[];
  prediction: Prediction;
}
