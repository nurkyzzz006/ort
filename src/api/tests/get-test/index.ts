import { useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import type { QueryOptions } from "../../shared/types";
import { apiPath } from "../../shared/url";
import type { GetTestResponse } from "./types";

// GET /api/v1/tests/{test_id} (публичный)
export const getTest = async (testId: string) => {
  const res = await api.get<GetTestResponse>(apiPath`/tests/${testId}`);
  return res.data;
};

/** Запрос не выполняется, пока testId не задан */
export const useGetTest = (
  testId: string | undefined,
  options?: QueryOptions<GetTestResponse>,
) =>
  useQuery<GetTestResponse, ApiError>({
    ...options,
    queryKey: queryKeys.tests.detail(testId ?? ""),
    queryFn: () => getTest(testId as string),
    enabled: Boolean(testId) && options?.enabled !== false,
  });

export type * from "./types";
