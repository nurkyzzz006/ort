import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import { apiPath, createIdempotencyKey } from "../../shared/url";
import type { StartTestRequest, StartTestResponse } from "./types";

// POST /api/v1/tests/{test_id}/start
export const startTest = async ({ testId, idempotencyKey }: StartTestRequest) => {
  const res = await api.post<StartTestResponse>(
    apiPath`/tests/${testId}/start`,
    undefined,
    { headers: { "Idempotency-Key": idempotencyKey ?? createIdempotencyKey() } },
  );
  return res.data;
};

export const useStartTest = () => {
  const queryClient = useQueryClient();

  return useMutation<StartTestResponse, ApiError, StartTestRequest>({
    mutationFn: startTest,
    onSuccess: (session) => {
      // Экран экзамена откроется сразу, без повторного запроса
      queryClient.setQueryData(queryKeys.sessions.detail(session.id), session);
      void queryClient.invalidateQueries({ queryKey: queryKeys.sessions.list() });
    },
  });
};

export type * from "./types";
