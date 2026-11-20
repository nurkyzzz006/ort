import { useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import type { QueryOptions } from "../../shared/types";
import type { GetScoreTrajectoryResponse } from "./types";

// GET /api/v1/stats/score-trajectory
export const getScoreTrajectory = async () => {
  const res = await api.get<GetScoreTrajectoryResponse>("/stats/score-trajectory");
  return res.data;
};

export const useGetScoreTrajectory = (
  options?: QueryOptions<GetScoreTrajectoryResponse>,
) =>
  useQuery<GetScoreTrajectoryResponse, ApiError>({
    ...options,
    queryKey: queryKeys.stats.trajectory(),
    queryFn: getScoreTrajectory,
  });

export type * from "./types";
