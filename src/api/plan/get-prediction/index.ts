import { useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import type { QueryOptions } from "../../shared/types";
import type { GetPredictionResponse } from "./types";

// GET /api/v1/prediction
export const getPrediction = async () => {
  const res = await api.get<GetPredictionResponse>("/prediction");
  return res.data;
};

export const useGetPrediction = (options?: QueryOptions<GetPredictionResponse>) =>
  useQuery<GetPredictionResponse, ApiError>({
    ...options,
    queryKey: queryKeys.plan.prediction(),
    queryFn: getPrediction,
  });

export type * from "./types";
