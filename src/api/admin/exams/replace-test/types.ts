import type { TestAdmin, TestIn } from "../../types";

export type ReplaceTestBody = TestIn;

/** Параметры PUT /admin/tests/{test_id} */
export interface ReplaceTestRequest {
  testId: string; // uuid
  data: ReplaceTestBody;
}

/** Swagger: PUT /admin/tests/{test_id} */
export type ReplaceTestResponse = TestAdmin;
