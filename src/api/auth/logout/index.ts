import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, AUTH_BASE_URL, type ApiError } from "../../axios";
import type { LogoutResponse } from "./types";

// POST /api/v1/auth/logout (через BFF /api/auth/logout) → 204
export const logout = async (): Promise<LogoutResponse> => {
  await api.post("/logout", undefined, {
    baseURL: AUTH_BASE_URL,
    skipAuthRefresh: true,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation<LogoutResponse, ApiError, void>({
    mutationFn: logout,
    // Cookie удаляются BFF даже при ошибке бэкенда — чистим кэш в любом случае
    onSettled: () => queryClient.clear(),
  });
};

export type * from "./types";
