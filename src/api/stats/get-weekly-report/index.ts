import { useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import type { QueryOptions } from "../../shared/types";
import type { GetWeeklyReportResponse } from "./types";

// GET /api/v1/reports/weekly
export const getWeeklyReport = async () => {
  const res = await api.get<GetWeeklyReportResponse>("/reports/weekly");
  return res.data;
};

export const useGetWeeklyReport = (options?: QueryOptions<GetWeeklyReportResponse>) =>
  useQuery<GetWeeklyReportResponse, ApiError>({
    ...options,
    queryKey: queryKeys.stats.weeklyReport(),
    queryFn: getWeeklyReport,
  });

export type * from "./types";
