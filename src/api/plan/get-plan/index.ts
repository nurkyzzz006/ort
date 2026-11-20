import { useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import { nullIfNotFound } from "../../shared/not-found";
import type { QueryOptions } from "../../shared/types";
import type { GetPlanResponse } from "./types";

// GET /api/v1/plan
// 404 → null: плана ещё нет (нормальное состояние, кэшируется без повторных запросов)
export const getPlan = async (): Promise<GetPlanResponse | null> =>
  nullIfNotFound(api.get<GetPlanResponse>("/plan").then((res) => res.data));

export const useGetPlan = (options?: QueryOptions<GetPlanResponse | null>) =>
  useQuery<GetPlanResponse | null, ApiError>({
    ...options,
    queryKey: queryKeys.plan.current(),
    queryFn: getPlan,
  });

export type * from "./types";
