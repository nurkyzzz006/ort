import type { TestValidation } from "../../types";

/** Параметры GET /admin/tests/{test_id}/validate */
export interface ValidateTestRequest {
  testId: string; // uuid
}

/** Swagger: GET /admin/tests/{test_id}/validate */
export type ValidateTestResponse = TestValidation;
