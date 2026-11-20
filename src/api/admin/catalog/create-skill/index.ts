import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { invalidateKeys, queryKeys } from "../../../query-keys";
import type { CreateSkillResponse, CreateSkillRequest } from "./types";

// POST /api/v1/admin/skills → 201
export const createSkill = async (data: CreateSkillRequest) => {
  const res = await api.post<CreateSkillResponse>("/admin/skills", data);
  return res.data;
};

export const useCreateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateSkillResponse, ApiError, CreateSkillRequest>({
    mutationFn: createSkill,
    onSuccess: () => invalidateKeys(queryClient, [queryKeys.admin.topicsAll(), queryKeys.catalog.all]),
  });
};

export type * from "./types";
