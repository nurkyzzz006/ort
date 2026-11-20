import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import type { RebuildPlanResponse } from "./types";

// POST /api/v1/plan/rebuild
export const rebuildPlan = async () => {
  const res = await api.post<RebuildPlanResponse>("/plan/rebuild");
  return res.data;
};

export const useRebuildPlan = () => {
  const queryClient = useQueryClient();

  return useMutation<RebuildPlanResponse, ApiError, void>({
    mutationFn: rebuildPlan,
    onSuccess: (plan) => {
      queryClient.setQueryData(queryKeys.plan.current(), plan);
      void queryClient.invalidateQueries({ queryKey: queryKeys.plan.today() });
    },
  });
};

export type * from "./types";
