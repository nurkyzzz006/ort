import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import type { StartPracticeRequest, StartPracticeResponse } from "./types";

// POST /api/v1/practice/sessions → 201
// Вопросы на языке ученика, сначала ещё не решённые.
export const startPractice = async (data: StartPracticeRequest) => {
  const res = await api.post<StartPracticeResponse>("/practice/sessions", data);
  return res.data;
};

export const useStartPractice = () => {
  const queryClient = useQueryClient();

  return useMutation<StartPracticeResponse, ApiError, StartPracticeRequest>({
    mutationFn: startPractice,
    onSuccess: (practice) =>
      queryClient.setQueryData(queryKeys.practice.detail(practice.id), practice),
  });
};

export type * from "./types";
