import { useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import type { QueryOptions } from "../../shared/types";
import type { GetStatsOverviewParams, GetStatsOverviewResponse } from "./types";

// GET /api/v1/stats/overview
export const getStatsOverview = async (params?: GetStatsOverviewParams) => {
  const res = await api.get<GetStatsOverviewResponse>("/stats/overview", { params });
  return res.data;
};

export const useGetStatsOverview = (
  params?: GetStatsOverviewParams,
  options?: QueryOptions<GetStatsOverviewResponse>,
) =>
  useQuery<GetStatsOverviewResponse, ApiError>({
    ...options,
    queryKey: queryKeys.stats.overview(params?.period_days),
    queryFn: () => getStatsOverview(params),
  });

export type * from "./types";
