import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { invalidateKeys, queryKeys } from "../../query-keys";
import { apiPath } from "../../shared/url";
import type { UpdateMistakeRequest, UpdateMistakeResponse } from "./types";

// PATCH /api/v1/mistakes/{card_id}
export const updateMistake = async ({ cardId, data }: UpdateMistakeRequest) => {
  const res = await api.patch<UpdateMistakeResponse>(
    apiPath`/mistakes/${cardId}`,
    data,
  );
  return res.data;
};

export const useUpdateMistake = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateMistakeResponse, ApiError, UpdateMistakeRequest>({
    mutationFn: updateMistake,
    // Архивирование меняет и список, и очередь повторения
    onSuccess: () =>
      invalidateKeys(queryClient, [queryKeys.mistakes.all, queryKeys.review.all]),
  });
};

export type * from "./types";
