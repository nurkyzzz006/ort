import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { invalidateKeys, queryKeys } from "../../../query-keys";
import { apiPath } from "../../../shared/url";
import type { SetUserRolesResponse, SetUserRolesRequest } from "./types";

// PUT /api/v1/admin/users/{user_id}/roles
export const setUserRoles = async ({ userId, data }: SetUserRolesRequest) => {
  const res = await api.put<SetUserRolesResponse>(apiPath`/admin/users/${userId}/roles`, data);
  return res.data;
};

export const useSetUserRoles = () => {
  const queryClient = useQueryClient();

  return useMutation<SetUserRolesResponse, ApiError, SetUserRolesRequest>({
    mutationFn: setUserRoles,
    onSuccess: () => invalidateKeys(queryClient, [queryKeys.admin.usersAll()]),
  });
};

export type * from "./types";
