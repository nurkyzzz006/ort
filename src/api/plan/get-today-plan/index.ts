import { useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import { nullIfNotFound } from "../../shared/not-found";
import type { QueryOptions } from "../../shared/types";
import type { GetTodayPlanResponse } from "./types";

// GET /api/v1/plan/today
// 404 → null: плана ещё нет (нормальное состояние, кэшируется без повторных запросов)
export const getTodayPlan = async (): Promise<GetTodayPlanResponse | null> =>
  nullIfNotFound(api.get<GetTodayPlanResponse>("/plan/today").then((res) => res.data));

export const useGetTodayPlan = (options?: QueryOptions<GetTodayPlanResponse | null>) =>
  useQuery<GetTodayPlanResponse | null, ApiError>({
    ...options,
    queryKey: queryKeys.plan.today(),
    queryFn: getTodayPlan,
  });

export type * from "./types";
