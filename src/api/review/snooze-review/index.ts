import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import { apiPath } from "../../shared/url";
import type { SnoozeReviewRequest, SnoozeReviewResponse } from "./types";

// POST /api/v1/review/{card_id}/snooze — отложить карточку
export const snoozeReview = async ({ cardId }: SnoozeReviewRequest) => {
  const res = await api.post<SnoozeReviewResponse>(
    apiPath`/review/${cardId}/snooze`,
  );
  return res.data;
};

export const useSnoozeReview = () => {
  const queryClient = useQueryClient();

  return useMutation<SnoozeReviewResponse, ApiError, SnoozeReviewRequest>({
    mutationFn: snoozeReview,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.review.all }),
  });
};

export type * from "./types";
