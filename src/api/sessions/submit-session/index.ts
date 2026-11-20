import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { invalidateKeys, LEARNING_PROGRESS_KEYS, queryKeys } from "../../query-keys";
import { apiPath } from "../../shared/url";
import type { SubmitSessionRequest, SubmitSessionResponse } from "./types";

// POST /api/v1/sessions/{session_id}/submit — завершить тест
export const submitSession = async ({ sessionId }: SubmitSessionRequest) => {
  const res = await api.post<SubmitSessionResponse>(
    apiPath`/sessions/${sessionId}/submit`,
  );
  return res.data;
};

export const useSubmitSession = () => {
  const queryClient = useQueryClient();

  return useMutation<SubmitSessionResponse, ApiError, SubmitSessionRequest>({
    mutationFn: submitSession,
    onSuccess: (result, { sessionId }) => {
      // Результат сразу доступен экрану результатов
      queryClient.setQueryData(queryKeys.sessions.result(sessionId), result);
      // Новый результат меняет статистику, прогноз, цель, план и журнал ошибок
      void invalidateKeys(queryClient, LEARNING_PROGRESS_KEYS);
    },
  });
};

export type * from "./types";
