import { useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import type { QueryOptions } from "../../shared/types";
import type { GetAchievementsResponse } from "./types";

// GET /api/v1/achievements
export const getAchievements = async () => {
  const res = await api.get<GetAchievementsResponse>("/achievements");
  return res.data;
};

export const useGetAchievements = (options?: QueryOptions<GetAchievementsResponse>) =>
  useQuery<GetAchievementsResponse, ApiError>({
    ...options,
    queryKey: queryKeys.stats.achievements(),
    queryFn: getAchievements,
  });

export type * from "./types";
