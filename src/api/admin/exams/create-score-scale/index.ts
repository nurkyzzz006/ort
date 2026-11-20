import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { invalidateKeys, queryKeys } from "../../../query-keys";
import { apiPath } from "../../../shared/url";
import type { CreateScoreScaleResponse, CreateScoreScaleRequest } from "./types";

// POST /api/v1/admin/exam-format-versions/{fv_id}/scales → 201
// Шкала raw → балл (ТЗ 13.4)
export const createScoreScale = async ({ formatVersionId, data }: CreateScoreScaleRequest) => {
  const res = await api.post<CreateScoreScaleResponse>(apiPath`/admin/exam-format-versions/${formatVersionId}/scales`, data);
  return res.data;
};

export const useCreateScoreScale = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateScoreScaleResponse, ApiError, CreateScoreScaleRequest>({
    mutationFn: createScoreScale,
    onSuccess: () => invalidateKeys(queryClient, [queryKeys.admin.formats()]),
  });
};

export type * from "./types";
