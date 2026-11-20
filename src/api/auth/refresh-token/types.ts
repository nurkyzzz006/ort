/**
 * Swagger: POST /auth/refresh принимает RefreshIn и возвращает TokenOut.
 * Через BFF: refresh_token читается из cookie, новые токены записываются
 * в cookie, клиент получает 204 и только результат:
 * ok — обновлено, expired — сессия окончена, failed — временная ошибка.
 */
export type { RefreshResult as RefreshTokenResult } from "../../axios";
