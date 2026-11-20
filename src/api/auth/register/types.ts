import type { AuthUserResponse, Locale } from "../../shared/types";

/** Swagger: RegisterIn */
export interface RegisterRequest {
  email: string; // format: email
  password: string; // minLength: 8, maxLength: 128
  display_name?: string | null; // minLength: 1, maxLength: 50
  locale?: Locale; // default: "ky"
  timezone?: string; // maxLength: 64, default: "Asia/Bishkek"
  accept_terms: true;
  accept_privacy: true;
}

/** Swagger: AuthOut без tokens — токены остаются в HttpOnly cookie */
export type RegisterResponse = AuthUserResponse;
