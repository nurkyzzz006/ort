/**
 * Swagger: POST /auth/logout принимает RefreshIn { refresh_token }.
 * refresh_token берёт из HttpOnly cookie сам BFF, поэтому тело с клиента пустое.
 * Ответ: 204 No Content.
 */
export type LogoutResponse = void;
