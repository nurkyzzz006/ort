import type { AuthUserResponse } from "../../shared/types";

/** Swagger: LoginIn (+ remember — обрабатывается BFF, на бэкенд не уходит) */
export interface LoginRequest {
  email: string; // format: email
  password: string; // maxLength: 128
  /** true — сессия переживает закрытие браузера (по умолчанию true) */
  remember?: boolean;
}

/** Swagger: AuthOut без tokens — токены остаются в HttpOnly cookie */
export type LoginResponse = AuthUserResponse;
