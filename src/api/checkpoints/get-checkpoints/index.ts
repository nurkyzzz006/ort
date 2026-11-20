import { useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import type { QueryOptions } from "../../shared/types";
import type { GetCheckpointsResponse } from "./types";

// GET /api/v1/checkpoints
export const getCheckpoints = async () => {
  const res = await api.get<GetCheckpointsResponse>("/checkpoints");
  return res.data;
};

export const useGetCheckpoints = (options?: QueryOptions<GetCheckpointsResponse>) =>
  useQuery<GetCheckpointsResponse, ApiError>({
    ...options,
    queryKey: queryKeys.checkpoints.list(),
    queryFn: getCheckpoints,
  });

export type * from "./types";
