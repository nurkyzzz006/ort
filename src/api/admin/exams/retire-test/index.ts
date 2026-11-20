import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { invalidateKeys, queryKeys } from "../../../query-keys";
import { apiPath } from "../../../shared/url";
import type { RetireTestResponse, RetireTestRequest } from "./types";

// POST /api/v1/admin/tests/{test_id}/retire
export const retireTest = async ({ testId }: RetireTestRequest) => {
  const res = await api.post<RetireTestResponse>(apiPath`/admin/tests/${testId}/retire`);
  return res.data;
};

export const useRetireTest = () => {
  const queryClient = useQueryClient();

  return useMutation<RetireTestResponse, ApiError, RetireTestRequest>({
    mutationFn: retireTest,
    onSuccess: () => invalidateKeys(queryClient, [queryKeys.admin.testsAll(), queryKeys.tests.all]),
  });
};

export type * from "./types";
