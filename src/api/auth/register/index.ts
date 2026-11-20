import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, AUTH_BASE_URL, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import type { RegisterRequest, RegisterResponse } from "./types";

// POST /api/v1/auth/register (через BFF /api/auth/register) → 201
export const register = async (data: RegisterRequest) => {
  const res = await api.post<RegisterResponse>("/register", data, {
    baseURL: AUTH_BASE_URL,
    skipAuthRefresh: true,
  });
  return res.data;
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation<RegisterResponse, ApiError, RegisterRequest>({
    mutationFn: register,
    onSuccess: ({ user }) => {
      queryClient.clear();
      queryClient.setQueryData(queryKeys.me.profile(), user);
    },
  });
};

export type * from "./types";
