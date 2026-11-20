import { useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import type { QueryOptions } from "../../shared/types";
import type { GetSkillsRoiResponse } from "./types";

// GET /api/v1/skills/roi
export const getSkillsRoi = async () => {
  const res = await api.get<GetSkillsRoiResponse>("/skills/roi");
  return res.data;
};

export const useGetSkillsRoi = (options?: QueryOptions<GetSkillsRoiResponse>) =>
  useQuery<GetSkillsRoiResponse, ApiError>({
    ...options,
    queryKey: queryKeys.plan.skillsRoi(),
    queryFn: getSkillsRoi,
  });

export type * from "./types";
