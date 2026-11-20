/** Swagger: PasswordResetConfirmIn */
export interface ConfirmPasswordResetRequest {
  token: string; // maxLength: 256 — токен из письма
  new_password: string; // minLength: 8, maxLength: 128
}

/** Swagger: 204 No Content */
export type ConfirmPasswordResetResponse = void;
