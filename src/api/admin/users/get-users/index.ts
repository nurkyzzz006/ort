import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { queryKeys } from "../../../query-keys";
import type { QueryOptions } from "../../../shared/types";
import type { GetAdminUsersResponse, GetAdminUsersParams } from "./types";

// GET /api/v1/admin/users
export const getAdminUsers = async (params?: GetAdminUsersParams) => {
  const res = await api.get<GetAdminUsersResponse>("/admin/users", { params });
  return res.data;
};

export const useGetAdminUsers = (
  params?: GetAdminUsersParams,
  options?: QueryOptions<GetAdminUsersResponse>,
) =>
  useQuery<GetAdminUsersResponse, ApiError>({
    placeholderData: keepPreviousData,
    ...options,
    queryKey: queryKeys.admin.users(params),
    queryFn: () => getAdminUsers(params),
  });

export type * from "./types";
