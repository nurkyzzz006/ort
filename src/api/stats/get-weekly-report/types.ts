/** Swagger: WeeklyReportOut — недельный отчёт */
export interface GetWeeklyReportResponse {
  week_start: string; // date
  solved: number;
  solved_previous: number;
  accuracy: number | null;
  accuracy_previous: number | null;
  active_days: number;
  plan_done: number;
  plan_total: number;
  cards_mastered: number;
  score_now: number | null;
  score_week_ago: number | null;
  next_milestone: number | null;
  streak: number;
}
