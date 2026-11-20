import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import { apiPath } from "../../shared/url";
import type { PracticeSession } from "../types";
import type { AnswerPracticeRequest, AnswerPracticeResponse } from "./types";

// POST /api/v1/practice/sessions/{session_id}/answers/{question_id}
export const answerPractice = async ({
  sessionId,
  questionId,
  data,
}: AnswerPracticeRequest) => {
  const res = await api.post<AnswerPracticeResponse>(
    apiPath`/practice/sessions/${sessionId}/answers/${questionId}`,
    data,
  );
  return res.data;
};

export const useAnswerPractice = () => {
  const queryClient = useQueryClient();

  return useMutation<AnswerPracticeResponse, ApiError, AnswerPracticeRequest>({
    mutationFn: answerPractice,
    onSuccess: (feedback, { sessionId, questionId }) => {
      // Показываем проверку сразу и обновляем счётчики в кэше
      queryClient.setQueryData<PracticeSession>(
        queryKeys.practice.detail(sessionId),
        (practice) => {
          if (!practice) return practice;
          const target = practice.questions.find((q) => q.id === questionId);
          const isFirstAnswer = target ? target.feedback === null : false;
          return {
            ...practice,
            answered: practice.answered + (isFirstAnswer ? 1 : 0),
            correct:
              practice.correct + (isFirstAnswer && feedback.is_correct ? 1 : 0),
            questions: practice.questions.map((q) =>
              q.id === questionId ? { ...q, feedback } : q,
            ),
          };
        },
      );
      // Неверный ответ попадает в журнал ошибок
      if (!feedback.is_correct) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.mistakes.all });
      }
    },
  });
};

export type * from "./types";
