import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, AUTH_BASE_URL, type ApiError } from "../../axios";
import type { LogoutAllResponse } from "./types";

// POST /api/v1/auth/logout-all (через BFF /api/auth/logout-all) → 204
// Завершает сессии на всех устройствах. Если access-токен истёк,
// Axios сам выполнит refresh и повторит запрос.
export const logoutAll = async (): Promise<LogoutAllResponse> => {
  await api.post("/logout-all", undefined, { baseURL: AUTH_BASE_URL });
};

export const useLogoutAll = () => {
  const queryClient = useQueryClient();

  return useMutation<LogoutAllResponse, ApiError, void>({
    mutationFn: logoutAll,
    onSuccess: () => queryClient.clear(),
  });
};

export type * from "./types";
