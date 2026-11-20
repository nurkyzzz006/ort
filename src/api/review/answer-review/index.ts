import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { invalidateKeys, queryKeys } from "../../query-keys";
import { apiPath, createIdempotencyKey } from "../../shared/url";
import type { AnswerReviewRequest, AnswerReviewResponse } from "./types";

// POST /api/v1/review/{card_id}/answer
export const answerReview = async ({
  cardId,
  data,
  idempotencyKey,
}: AnswerReviewRequest) => {
  const res = await api.post<AnswerReviewResponse>(
    apiPath`/review/${cardId}/answer`,
    data,
    { headers: { "Idempotency-Key": idempotencyKey ?? createIdempotencyKey() } },
  );
  return res.data;
};

export const useAnswerReview = () => {
  const queryClient = useQueryClient();

  return useMutation<AnswerReviewResponse, ApiError, AnswerReviewRequest>({
    mutationFn: answerReview,
    onSuccess: () => {
      // Очередь не перезапрашиваем сразу: экран ещё показывает решение.
      // Помечаем устаревшей — обновится при следующем открытии или refetch().
      void queryClient.invalidateQueries({
        queryKey: queryKeys.review.all,
        refetchType: "none",
      });
      void invalidateKeys(queryClient, [
        queryKeys.mistakes.all,
        queryKeys.stats.all,
        queryKeys.plan.today(),
      ]);
    },
  });
};

export type * from "./types";
