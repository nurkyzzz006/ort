import { useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import { nullIfNotFound } from "../../shared/not-found";
import type { QueryOptions } from "../../shared/types";
import type { GetGoalResponse } from "./types";

// GET /api/v1/goals/current
// 404 → null: цели ещё нет (нормальное состояние, кэшируется без повторных запросов)
export const getGoal = async (): Promise<GetGoalResponse | null> =>
  nullIfNotFound(api.get<GetGoalResponse>("/goals/current").then((res) => res.data));

export const useGetGoal = (options?: QueryOptions<GetGoalResponse | null>) =>
  useQuery<GetGoalResponse | null, ApiError>({
    ...options,
    queryKey: queryKeys.goals.current(),
    queryFn: getGoal,
  });

export type * from "./types";
