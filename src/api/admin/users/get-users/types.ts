import type { AdminUserPage } from "../../types";
import type { PaginationParams } from "../../../shared/types";

/** Query-параметры: limit 1–100 (default 50), offset ≥ 0 */
export type GetAdminUsersParams = PaginationParams;

/** Swagger: GET /admin/users */
export type GetAdminUsersResponse = AdminUserPage;
