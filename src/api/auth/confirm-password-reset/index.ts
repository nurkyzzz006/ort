import { useMutation } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import type {
  ConfirmPasswordResetRequest,
  ConfirmPasswordResetResponse,
} from "./types";

// POST /api/v1/auth/password-reset/confirm → 204
export const confirmPasswordReset = async (
  data: ConfirmPasswordResetRequest,
): Promise<ConfirmPasswordResetResponse> => {
  await api.post("/auth/password-reset/confirm", data, {
    skipAuthRefresh: true,
  });
};

export const useConfirmPasswordReset = () =>
  useMutation<ConfirmPasswordResetResponse, ApiError, ConfirmPasswordResetRequest>({
    mutationFn: confirmPasswordReset,
  });

export type * from "./types";
