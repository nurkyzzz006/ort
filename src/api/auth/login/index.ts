import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, AUTH_BASE_URL, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import type { LoginRequest, LoginResponse } from "./types";

// POST /api/v1/auth/login (через BFF /api/auth/login)
export const login = async (data: LoginRequest) => {
  const res = await api.post<LoginResponse>("/login", data, {
    baseURL: AUTH_BASE_URL,
    skipAuthRefresh: true,
  });
  return res.data;
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, ApiError, LoginRequest>({
    mutationFn: login,
    onSuccess: ({ user }) => {
      // Убираем данные прошлого пользователя и сразу кладём профиль в кэш
      queryClient.clear();
      queryClient.setQueryData(queryKeys.me.profile(), user);
    },
  });
};

export type * from "./types";
