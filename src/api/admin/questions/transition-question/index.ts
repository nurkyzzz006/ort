import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { invalidateKeys, queryKeys } from "../../../query-keys";
import { apiPath } from "../../../shared/url";
import type { TransitionQuestionResponse, TransitionQuestionRequest } from "./types";

// POST /api/v1/admin/questions/versions/{version_id}/transition
// Перевод по workflow: draft → editorial_review → expert_review → approved → published → retired
export const transitionQuestion = async ({ versionId, data }: TransitionQuestionRequest) => {
  const res = await api.post<TransitionQuestionResponse>(apiPath`/admin/questions/versions/${versionId}/transition`, data);
  return res.data;
};

export const useTransitionQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation<TransitionQuestionResponse, ApiError, TransitionQuestionRequest>({
    mutationFn: transitionQuestion,
    onSuccess: () => invalidateKeys(queryClient, [queryKeys.admin.questionsAll(), queryKeys.tests.all]),
  });
};

export type * from "./types";
