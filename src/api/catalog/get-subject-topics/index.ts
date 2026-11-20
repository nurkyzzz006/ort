import { useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import type { QueryOptions } from "../../shared/types";
import { apiPath } from "../../shared/url";
import type { GetSubjectTopicsResponse } from "./types";

const CATALOG_STALE_TIME = 10 * 60_000;

// GET /api/v1/subjects/{subject_id}/topics (публичный)
export const getSubjectTopics = async (subjectId: string) => {
  const res = await api.get<GetSubjectTopicsResponse>(
    apiPath`/subjects/${subjectId}/topics`,
  );
  return res.data;
};

/** Запрос не выполняется, пока subjectId не задан */
export const useGetSubjectTopics = (
  subjectId: string | undefined,
  options?: QueryOptions<GetSubjectTopicsResponse>,
) =>
  useQuery<GetSubjectTopicsResponse, ApiError>({
    staleTime: CATALOG_STALE_TIME,
    ...options,
    queryKey: queryKeys.catalog.topics(subjectId ?? ""),
    queryFn: () => getSubjectTopics(subjectId as string),
    enabled: Boolean(subjectId) && options?.enabled !== false,
  });

export type * from "./types";
