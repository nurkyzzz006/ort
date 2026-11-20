import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { invalidateKeys, queryKeys } from "../../../query-keys";
import { apiPath } from "../../../shared/url";
import type { ReplaceTestResponse, ReplaceTestRequest } from "./types";

// PUT /api/v1/admin/tests/{test_id}
export const replaceTest = async ({ testId, data }: ReplaceTestRequest) => {
  const res = await api.put<ReplaceTestResponse>(apiPath`/admin/tests/${testId}`, data);
  return res.data;
};

export const useReplaceTest = () => {
  const queryClient = useQueryClient();

  return useMutation<ReplaceTestResponse, ApiError, ReplaceTestRequest>({
    mutationFn: replaceTest,
    onSuccess: () => invalidateKeys(queryClient, [queryKeys.admin.testsAll()]),
  });
};

export type * from "./types";
