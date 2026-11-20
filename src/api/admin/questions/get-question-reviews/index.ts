import { useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { queryKeys } from "../../../query-keys";
import type { QueryOptions } from "../../../shared/types";
import { apiPath } from "../../../shared/url";
import type { GetQuestionReviewsResponse } from "./types";

// GET /api/v1/admin/questions/versions/{version_id}/reviews
// История переходов по workflow
export const getQuestionReviews = async (versionId: string) => {
  const res = await api.get<GetQuestionReviewsResponse>(apiPath`/admin/questions/versions/${versionId}/reviews`);
  return res.data;
};

/** Запрос не выполняется, пока versionId не задан */
export const useGetQuestionReviews = (
  versionId: string | undefined,
  options?: QueryOptions<GetQuestionReviewsResponse>,
) =>
  useQuery<GetQuestionReviewsResponse, ApiError>({
    ...options,
    queryKey: queryKeys.admin.reviews(versionId ?? ""),
    queryFn: () => getQuestionReviews(versionId as string),
    enabled: Boolean(versionId) && options?.enabled !== false,
  });

export type * from "./types";
