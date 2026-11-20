import type { TestAdmin } from "../../types";

/** Параметры POST /admin/tests/{test_id}/publish */
export interface PublishTestRequest {
  testId: string; // uuid
}

/** Swagger: POST /admin/tests/{test_id}/publish */
export type PublishTestResponse = TestAdmin;
