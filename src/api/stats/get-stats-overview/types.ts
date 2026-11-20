/** Query-параметры GET /stats/overview */
export interface GetStatsOverviewParams {
  period_days?: number; // 1…365, default: 30
}

/** Swagger: OverviewOut */
export interface GetStatsOverviewResponse {
  period_days: number;
  solved: number;
  accuracy: number | null;
  avg_time_sec: number | null;
  due_cards: number;
  streak: number;
  longest_streak: number;
  active_days: number;
}
