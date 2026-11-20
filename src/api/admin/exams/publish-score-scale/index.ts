import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { invalidateKeys, queryKeys } from "../../../query-keys";
import { apiPath } from "../../../shared/url";
import type { PublishScoreScaleResponse, PublishScoreScaleRequest } from "./types";

// POST /api/v1/admin/score-scales/{scale_id}/publish
// Исторические результаты не пересчитываются (ТЗ 7.2)
export const publishScoreScale = async ({ scaleId }: PublishScoreScaleRequest) => {
  const res = await api.post<PublishScoreScaleResponse>(apiPath`/admin/score-scales/${scaleId}/publish`);
  return res.data;
};

export const usePublishScoreScale = () => {
  const queryClient = useQueryClient();

  return useMutation<PublishScoreScaleResponse, ApiError, PublishScoreScaleRequest>({
    mutationFn: publishScoreScale,
    onSuccess: () => invalidateKeys(queryClient, [queryKeys.admin.formats(), queryKeys.tests.all]),
  });
};

export type * from "./types";
