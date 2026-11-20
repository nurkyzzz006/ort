import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { invalidateKeys, queryKeys } from "../../../query-keys";
import { apiPath } from "../../../shared/url";
import type { UpdateSkillResponse, UpdateSkillRequest } from "./types";

// PATCH /api/v1/admin/skills/{skill_id}
export const updateSkill = async ({ skillId, data }: UpdateSkillRequest) => {
  const res = await api.patch<UpdateSkillResponse>(apiPath`/admin/skills/${skillId}`, data);
  return res.data;
};

export const useUpdateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateSkillResponse, ApiError, UpdateSkillRequest>({
    mutationFn: updateSkill,
    onSuccess: () => invalidateKeys(queryClient, [queryKeys.admin.topicsAll(), queryKeys.catalog.all]),
  });
};

export type * from "./types";
