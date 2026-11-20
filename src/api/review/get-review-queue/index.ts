import { useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import type { QueryOptions } from "../../shared/types";
import type { GetReviewQueueResponse } from "./types";

// GET /api/v1/review/queue
export const getReviewQueue = async () => {
  const res = await api.get<GetReviewQueueResponse>("/review/queue");
  return res.data;
};

export const useGetReviewQueue = (options?: QueryOptions<GetReviewQueueResponse>) =>
  useQuery<GetReviewQueueResponse, ApiError>({
    ...options,
    queryKey: queryKeys.review.queue(),
    queryFn: getReviewQueue,
  });

export type * from "./types";
