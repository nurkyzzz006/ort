import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { invalidateKeys, queryKeys } from "../../query-keys";
import type { ArchiveGoalResponse } from "./types";

// DELETE /api/v1/goals/current — архивировать текущую цель
export const archiveGoal = async (): Promise<ArchiveGoalResponse> => {
  await api.delete("/goals/current");
};

export const useArchiveGoal = () => {
  const queryClient = useQueryClient();

  return useMutation<ArchiveGoalResponse, ApiError, void>({
    mutationFn: archiveGoal,
    onSuccess: () => {
      // Цели больше нет — удаляем её и прогресс из кэша
      queryClient.removeQueries({ queryKey: queryKeys.goals.all });
      void invalidateKeys(queryClient, [
        queryKeys.plan.all,
        queryKeys.stats.trajectory(),
      ]);
    },
  });
};

export type * from "./types";
