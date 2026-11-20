import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { invalidateKeys, LEARNING_PROGRESS_KEYS, queryKeys } from "../../query-keys";
import { apiPath } from "../../shared/url";
import type { FinishPracticeRequest, FinishPracticeResponse } from "./types";

// POST /api/v1/practice/sessions/{session_id}/finish
export const finishPractice = async ({ sessionId }: FinishPracticeRequest) => {
  const res = await api.post<FinishPracticeResponse>(
    apiPath`/practice/sessions/${sessionId}/finish`,
  );
  return res.data;
};

export const useFinishPractice = () => {
  const queryClient = useQueryClient();

  return useMutation<FinishPracticeResponse, ApiError, FinishPracticeRequest>({
    mutationFn: finishPractice,
    onSuccess: (practice) => {
      queryClient.setQueryData(queryKeys.practice.detail(practice.id), practice);
      void invalidateKeys(queryClient, LEARNING_PROGRESS_KEYS);
    },
  });
};

export type * from "./types";
