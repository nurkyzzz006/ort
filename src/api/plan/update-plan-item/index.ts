import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import { apiPath } from "../../shared/url";
import type { UpdatePlanItemRequest, UpdatePlanItemResponse } from "./types";

// PATCH /api/v1/plan/items/{item_id}
export const updatePlanItem = async ({ itemId, data }: UpdatePlanItemRequest) => {
  const res = await api.patch<UpdatePlanItemResponse>(
    apiPath`/plan/items/${itemId}`,
    data,
  );
  return res.data;
};

export const useUpdatePlanItem = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdatePlanItemResponse, ApiError, UpdatePlanItemRequest>({
    mutationFn: updatePlanItem,
    // Статус задания отображается и в плане, и в «сегодня»
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.plan.all }),
  });
};

export type * from "./types";
