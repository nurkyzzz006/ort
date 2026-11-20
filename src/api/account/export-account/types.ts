import type { FileResponse } from "../../shared/types";

/**
 * Swagger: GET /account/export — «всё, что хранится об ученике,
 * в виде JSON-файла для скачивания». Схема содержимого не описана,
 * поэтому файл возвращается как Blob.
 */
export type ExportAccountResponse = FileResponse;
