import type { PlanItem, PlanItemStatus } from "../types";

/** Swagger: PlanItemUpdateIn */
export interface UpdatePlanItemBody {
  status: PlanItemStatus;
}

/** Параметры PATCH /plan/items/{item_id} */
export interface UpdatePlanItemRequest {
  itemId: string; // uuid
  data: UpdatePlanItemBody;
}

/** Swagger: PlanItemOut */
export type UpdatePlanItemResponse = PlanItem;
