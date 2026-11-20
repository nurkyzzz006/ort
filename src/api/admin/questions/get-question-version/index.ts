import { useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { queryKeys } from "../../../query-keys";
import type { QueryOptions } from "../../../shared/types";
import { apiPath } from "../../../shared/url";
import type { GetQuestionVersionResponse } from "./types";

// GET /api/v1/admin/questions/versions/{version_id}
export const getQuestionVersion = async (versionId: string) => {
  const res = await api.get<GetQuestionVersionResponse>(apiPath`/admin/questions/versions/${versionId}`);
  return res.data;
};

/** Запрос не выполняется, пока versionId не задан */
export const useGetQuestionVersion = (
  versionId: string | undefined,
  options?: QueryOptions<GetQuestionVersionResponse>,
) =>
  useQuery<GetQuestionVersionResponse, ApiError>({
    ...options,
    queryKey: queryKeys.admin.question(versionId ?? ""),
    queryFn: () => getQuestionVersion(versionId as string),
    enabled: Boolean(versionId) && options?.enabled !== false,
  });

export type * from "./types";
