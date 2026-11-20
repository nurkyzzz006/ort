import { useMutation } from "@tanstack/react-query";
import { refreshSession, type ApiError } from "../../axios";
import type { RefreshTokenResult } from "./types";

// POST /api/v1/auth/refresh (через BFF /api/auth/refresh)
// Обычно вызывать вручную не нужно: Axios обновляет сессию сам при 401.
// Логика (один общий запрос на все параллельные 401) находится в axios.ts.
export const refreshToken = (): Promise<RefreshTokenResult> => refreshSession();

export const useRefreshToken = () =>
  useMutation<RefreshTokenResult, ApiError, void>({
    mutationFn: refreshToken,
  });

export type * from "./types";
