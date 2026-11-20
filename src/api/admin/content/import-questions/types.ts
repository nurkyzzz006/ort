import type { UntypedResponse } from "../../../shared/types";

/** multipart/form-data: file (.csv / .json) + query dry_run */
export interface ImportQuestionsRequest {
  file: File;
  /** default true — только проверка, без создания вопросов */
  dryRun?: boolean;
}

/**
 * Swagger: схема ответа не описана (object).
 * TODO: заменить, когда бэкенд опишет схему в Swagger.
 */
export type ImportQuestionsResponse = UntypedResponse;
