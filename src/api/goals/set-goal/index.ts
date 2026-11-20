import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { invalidateKeys, queryKeys } from "../../query-keys";
import type { SetGoalRequest, SetGoalResponse } from "./types";

// PUT /api/v1/goals/current
export const setGoal = async (data: SetGoalRequest) => {
  const res = await api.put<SetGoalResponse>("/goals/current", data);
  return res.data;
};

export const useSetGoal = () => {
  const queryClient = useQueryClient();

  return useMutation<SetGoalResponse, ApiError, SetGoalRequest>({
    mutationFn: setGoal,
    onSuccess: (goal) => {
      queryClient.setQueryData(queryKeys.goals.current(), goal);
      // От цели зависят прогресс, план, траектория
      void invalidateKeys(queryClient, [
        queryKeys.goals.progress(),
        queryKeys.plan.all,
        queryKeys.stats.trajectory(),
      ]);
    },
  });
};

export type * from "./types";
