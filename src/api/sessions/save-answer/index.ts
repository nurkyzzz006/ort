import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import { apiPath } from "../../shared/url";
import type { Session } from "../types";
import type { SaveAnswerRequest, SaveAnswerResponse } from "./types";

// PUT /api/v1/sessions/{session_id}/answers/{question_id}
// Автосохранение: безопасно повторять (сервер применяет только новый seq).
export const saveAnswer = async ({ sessionId, questionId, data }: SaveAnswerRequest) => {
  const res = await api.put<SaveAnswerResponse>(
    apiPath`/sessions/${sessionId}/answers/${questionId}`,
    data,
  );
  return res.data;
};

export const useSaveAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation<SaveAnswerResponse, ApiError, SaveAnswerRequest>({
    mutationFn: saveAnswer,
    // Сеть может моргнуть — автосохранение повторяем
    retry: 2,
    onSuccess: (answer, { sessionId }) => {
      if (!answer.applied) return;
      // Обновляем вопрос в кэше сессии без перезапроса всего экзамена
      queryClient.setQueryData<Session>(
        queryKeys.sessions.detail(sessionId),
        (session) =>
          session && {
            ...session,
            server_time: answer.server_time,
            questions: session.questions.map((q) =>
              q.id === answer.question_id
                ? {
                    ...q,
                    selected_option_id: answer.option_id,
                    marked: answer.marked,
                    seq: answer.seq,
                  }
                : q,
            ),
          },
      );
    },
  });
};

export type * from "./types";
