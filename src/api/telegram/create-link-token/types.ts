/**
 * Swagger: LinkTokenOut — одноразовый короткоживущий токен.
 * Ученик отправляет его боту командой /start <token> или открывает deep_link.
 */
export interface CreateLinkTokenResponse {
  token: string;
  expires_in: number; // секунды
  deep_link: string | null;
}
