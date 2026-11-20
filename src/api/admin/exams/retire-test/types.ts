import type { TestAdmin } from "../../types";

/** Параметры POST /admin/tests/{test_id}/retire */
export interface RetireTestRequest {
  testId: string; // uuid
}

/** Swagger: POST /admin/tests/{test_id}/retire */
export type RetireTestResponse = TestAdmin;
