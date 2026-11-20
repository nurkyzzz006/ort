import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { invalidateKeys, queryKeys } from "../../../query-keys";
import { apiPath } from "../../../shared/url";
import type { CreateQuestionVersionResponse, CreateQuestionVersionRequest } from "./types";

// POST /api/v1/admin/questions/versions/{version_id}/new-version → 201
// Новая черновая версия на основе существующей
export const createQuestionVersion = async ({ versionId }: CreateQuestionVersionRequest) => {
  const res = await api.post<CreateQuestionVersionResponse>(apiPath`/admin/questions/versions/${versionId}/new-version`);
  return res.data;
};

export const useCreateQuestionVersion = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateQuestionVersionResponse, ApiError, CreateQuestionVersionRequest>({
    mutationFn: createQuestionVersion,
    onSuccess: () => invalidateKeys(queryClient, [queryKeys.admin.questionsAll()]),
  });
};

export type * from "./types";
