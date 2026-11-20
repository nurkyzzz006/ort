import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { invalidateKeys, queryKeys } from "../../query-keys";
import type {
  CreateSelfReportedCheckpointRequest,
  CreateSelfReportedCheckpointResponse,
} from "./types";

// POST /api/v1/checkpoints/self-reported → 201
export const createSelfReportedCheckpoint = async (
  data: CreateSelfReportedCheckpointRequest,
) => {
  const res = await api.post<CreateSelfReportedCheckpointResponse>(
    "/checkpoints/self-reported",
    data,
  );
  return res.data;
};

export const useCreateSelfReportedCheckpoint = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateSelfReportedCheckpointResponse,
    ApiError,
    CreateSelfReportedCheckpointRequest
  >({
    mutationFn: createSelfReportedCheckpoint,
    // Новая точка отсчёта меняет траекторию, прогноз и цель
    onSuccess: () =>
      invalidateKeys(queryClient, [
        queryKeys.checkpoints.all,
        queryKeys.stats.trajectory(),
        queryKeys.plan.prediction(),
        queryKeys.goals.all,
      ]),
  });
};

export type * from "./types";
