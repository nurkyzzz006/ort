import { useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { queryKeys } from "../../../query-keys";
import type { QueryOptions } from "../../../shared/types";
import { apiPath } from "../../../shared/url";
import type { GetAdminSubjectTopicsResponse } from "./types";

// GET /api/v1/admin/subjects/{subject_id}/topics
// Дерево тем с навыками, включая выключенные
export const getAdminSubjectTopics = async (subjectId: string) => {
  const res = await api.get<GetAdminSubjectTopicsResponse>(apiPath`/admin/subjects/${subjectId}/topics`);
  return res.data;
};

/** Запрос не выполняется, пока subjectId не задан */
export const useGetAdminSubjectTopics = (
  subjectId: string | undefined,
  options?: QueryOptions<GetAdminSubjectTopicsResponse>,
) =>
  useQuery<GetAdminSubjectTopicsResponse, ApiError>({
    ...options,
    queryKey: queryKeys.admin.topics(subjectId ?? ""),
    queryFn: () => getAdminSubjectTopics(subjectId as string),
    enabled: Boolean(subjectId) && options?.enabled !== false,
  });

export type * from "./types";
