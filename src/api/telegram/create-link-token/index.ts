import { useMutation } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import type { CreateLinkTokenResponse } from "./types";

// POST /api/v1/telegram/link-token
export const createLinkToken = async () => {
  const res = await api.post<CreateLinkTokenResponse>("/telegram/link-token");
  return res.data;
};

export const useCreateLinkToken = () =>
  useMutation<CreateLinkTokenResponse, ApiError, void>({
    mutationFn: createLinkToken,
  });

export type * from "./types";
