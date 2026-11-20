import type { GradeStatus, Locale, User } from "../../shared/types";

/** Swagger: MeUpdateIn — передавайте только изменяемые поля */
export interface UpdateMeRequest {
  display_name?: string | null; // minLength: 1, maxLength: 50
  locale?: Locale | null;
  timezone?: string | null; // maxLength: 64
  grade_status?: GradeStatus | null;
}

/** Swagger: UserOut */
export type UpdateMeResponse = User;
