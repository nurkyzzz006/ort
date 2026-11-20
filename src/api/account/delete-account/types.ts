/** Swagger: DeleteAccountIn */
export interface DeleteAccountRequest {
  password: string; // maxLength: 128
  /** Подтверждение; формат значения в Swagger не описан */
  confirm: string;
}

/** Swagger: 204 No Content */
export type DeleteAccountResponse = void;
