import type { AdminUser } from "../../types";
import type { RoleCode } from "../../../shared/types";

/** Swagger: UserRolesIn — 1…4 роли, заменяет текущие (действие в audit log) */
export type SetUserRolesBody = { roles: RoleCode[] };

/** Параметры PUT /admin/users/{user_id}/roles */
export interface SetUserRolesRequest {
  userId: string; // uuid
  data: SetUserRolesBody;
}

/** Swagger: PUT /admin/users/{user_id}/roles */
export type SetUserRolesResponse = AdminUser;
