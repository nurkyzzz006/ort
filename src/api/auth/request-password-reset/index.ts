import { useMutation } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import type {
  RequestPasswordResetRequest,
  RequestPasswordResetResponse,
} from "./types";

// POST /api/v1/auth/password-reset/request → 202
export const requestPasswordReset = async (
  data: RequestPasswordResetRequest,
) => {
  const res = await api.post<RequestPasswordResetResponse>(
    "/auth/password-reset/request",
    data,
    { skipAuthRefresh: true },
  );
  return res.data;
};

export const useRequestPasswordReset = () =>
  useMutation<RequestPasswordResetResponse, ApiError, RequestPasswordResetRequest>({
    mutationFn: requestPasswordReset,
  });

export type * from "./types";
