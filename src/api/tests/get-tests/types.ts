import type { Locale, TestKind } from "../../shared/types";
import type { Test } from "../types";

/** Query-параметры GET /tests (все необязательные) */
export interface GetTestsParams {
  /** kind=mock — полные пробные экзамены */
  kind?: TestKind | null;
  subject_id?: string | null; // uuid
  language?: Locale | null;
}

/** Swagger: TestOut[] — только опубликованные тесты */
export type GetTestsResponse = Test[];
