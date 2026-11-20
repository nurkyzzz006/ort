import { useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import { nullIfNotFound } from "../../shared/not-found";
import type { QueryOptions } from "../../shared/types";
import type { GetGoalProgressResponse } from "./types";

// GET /api/v1/goals/current/progress
// 404 → null: цели ещё нет (нормальное состояние, кэшируется без повторных запросов)
export const getGoalProgress = async (): Promise<GetGoalProgressResponse | null> =>
  nullIfNotFound(api.get<GetGoalProgressResponse>("/goals/current/progress").then((res) => res.data));

export const useGetGoalProgress = (
  options?: QueryOptions<GetGoalProgressResponse | null>,
) =>
  useQuery<GetGoalProgressResponse | null, ApiError>({
    ...options,
    queryKey: queryKeys.goals.progress(),
    queryFn: getGoalProgress,
  });

export type * from "./types";
