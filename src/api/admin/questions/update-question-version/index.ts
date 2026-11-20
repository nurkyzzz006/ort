import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { invalidateKeys, queryKeys } from "../../../query-keys";
import { apiPath } from "../../../shared/url";
import type { UpdateQuestionVersionResponse, UpdateQuestionVersionRequest } from "./types";

// PATCH /api/v1/admin/questions/versions/{version_id}
// Опубликованную версию менять нельзя — создайте новую (ТЗ 7.2)
export const updateQuestionVersion = async ({ versionId, data }: UpdateQuestionVersionRequest) => {
  const res = await api.patch<UpdateQuestionVersionResponse>(apiPath`/admin/questions/versions/${versionId}`, data);
  return res.data;
};

export const useUpdateQuestionVersion = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateQuestionVersionResponse, ApiError, UpdateQuestionVersionRequest>({
    mutationFn: updateQuestionVersion,
    onSuccess: () => invalidateKeys(queryClient, [queryKeys.admin.questionsAll()]),
  });
};

export type * from "./types";
