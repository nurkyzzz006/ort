import type { PlanItem } from "../types";

/** Swagger: TodayOut — план на сегодня */
export interface GetTodayPlanResponse {
  day: string; // date
  items: PlanItem[];
  done: number;
  total: number;
  due_cards: number;
  streak: number;
}
