// Модели, общие для endpoint-ов модуля plan

/** Swagger: PlanItemKind */
export type PlanItemKind = "practice" | "review" | "mock";

/** Swagger: PlanItemStatus */
export type PlanItemStatus = "pending" | "done" | "skipped";

/** Swagger: PlanItemOut — задание плана на день */
export interface PlanItem {
  id: string; // uuid
  day: string; // date
  kind: PlanItemKind;
  skill_id: string | null;
  skill_title_ky: string | null;
  skill_title_ru: string | null;
  minutes: number;
  expected_gain: number;
  status: PlanItemStatus;
}

/** Swagger: PlanDayOut */
export interface PlanDay {
  day: string; // date
  minutes: number;
  items: PlanItem[];
}

/** Swagger: PlanOut */
export interface Plan {
  id: string; // uuid
  version: number;
  days: PlanDay[];
}
