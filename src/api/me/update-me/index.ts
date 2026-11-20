import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import type { UpdateMeRequest, UpdateMeResponse } from "./types";

// PATCH /api/v1/me
export const updateMe = async (data: UpdateMeRequest) => {
  const res = await api.patch<UpdateMeResponse>("/me", data);
  return res.data;
};

export const useUpdateMe = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateMeResponse, ApiError, UpdateMeRequest>({
    mutationFn: updateMe,
    onSuccess: (user, variables) => {
      queryClient.setQueryData(queryKeys.me.profile(), user);
      // Язык контента влияет на тексты тестов, практики и плана
      if (variables.locale) {
        void queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] !== queryKeys.me.all[0],
        });
      }
    },
  });
};

export type * from "./types";
