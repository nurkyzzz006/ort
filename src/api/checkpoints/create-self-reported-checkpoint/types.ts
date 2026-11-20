import type { Checkpoint } from "../../shared/types";

/** Swagger: SelfReportedIn — балл пробного экзамена вне платформы */
export interface CreateSelfReportedCheckpointRequest {
  total_scaled: number; // 0…1000
  taken_on: string; // date, "YYYY-MM-DD"
}

/** Swagger: 201 CheckpointOut */
export type CreateSelfReportedCheckpointResponse = Checkpoint;
