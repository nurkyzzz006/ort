import type { SnapshotOption } from "../../shared/types";

/** Swagger: ReviewCardOut — карточка для интервального повторения */
export interface ReviewCard {
  card_id: string; // uuid
  skill_id: string; // uuid
  stem: string;
  options: SnapshotOption[];
  error_count: number;
  due_at: string; // date-time
  interval_days: number;
}

/** Swagger: ReviewQueueOut */
export interface GetReviewQueueResponse {
  due: number;
  estimated_minutes: number;
  items: ReviewCard[];
}
