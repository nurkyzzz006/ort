import type { UntypedResponse } from "../../../shared/types";

/** multipart/form-data: file */
export interface UploadMediaRequest {
  file: File;
}

/**
 * Swagger: схема ответа не описана (object).
 * TODO: заменить, когда бэкенд опишет схему в Swagger.
 */
export type UploadMediaResponse = UntypedResponse;
