import { useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import type { QueryOptions } from "../../shared/types";
import type { GetStatsSkillsResponse } from "./types";

// GET /api/v1/stats/skills
export const getStatsSkills = async () => {
  const res = await api.get<GetStatsSkillsResponse>("/stats/skills");
  return res.data;
};

export const useGetStatsSkills = (options?: QueryOptions<GetStatsSkillsResponse>) =>
  useQuery<GetStatsSkillsResponse, ApiError>({
    ...options,
    queryKey: queryKeys.stats.skills(),
    queryFn: getStatsSkills,
  });

export type * from "./types";
