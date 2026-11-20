import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { invalidateKeys, queryKeys } from "../../../query-keys";
import { apiPath } from "../../../shared/url";
import type { SetSkillWeightsResponse, SetSkillWeightsRequest } from "./types";

// PUT /api/v1/admin/exam-format-versions/{fv_id}/skill-weights
// Сколько вопросов раздела приносит навык — основа Score ROI
export const setSkillWeights = async ({ formatVersionId, data }: SetSkillWeightsRequest) => {
  const res = await api.put<SetSkillWeightsResponse>(apiPath`/admin/exam-format-versions/${formatVersionId}/skill-weights`, data);
  return res.data;
};

export const useSetSkillWeights = () => {
  const queryClient = useQueryClient();

  return useMutation<SetSkillWeightsResponse, ApiError, SetSkillWeightsRequest>({
    mutationFn: setSkillWeights,
    onSuccess: () => invalidateKeys(queryClient, [queryKeys.admin.formats(), queryKeys.plan.skillsRoi()]),
  });
};

export type * from "./types";
