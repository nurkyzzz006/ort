import type { TestAdmin, TestIn } from "../../types";

export type CreateTestBody = TestIn;

export type CreateTestRequest = CreateTestBody;

/** Swagger: POST /admin/tests */
export type CreateTestResponse = TestAdmin;
