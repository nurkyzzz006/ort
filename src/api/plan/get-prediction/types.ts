import type { Prediction } from "../../shared/types";

/**
 * Swagger: GET /prediction → PredictionOut.
 * Диапазон балла с уровнем уверенности; available=false без пробного экзамена.
 */
export type GetPredictionResponse = Prediction;
