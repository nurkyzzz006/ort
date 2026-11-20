import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { invalidateKeys, queryKeys } from "../../../query-keys";
import { apiPath } from "../../../shared/url";
import type { PublishTestResponse, PublishTestRequest } from "./types";

// POST /api/v1/admin/tests/{test_id}/publish
export const publishTest = async ({ testId }: PublishTestRequest) => {
  const res = await api.post<PublishTestResponse>(apiPath`/admin/tests/${testId}/publish`);
  return res.data;
};

export const usePublishTest = () => {
  const queryClient = useQueryClient();

  return useMutation<PublishTestResponse, ApiError, PublishTestRequest>({
    mutationFn: publishTest,
    onSuccess: () => invalidateKeys(queryClient, [queryKeys.admin.testsAll(), queryKeys.tests.all]),
  });
};

export type * from "./types";
