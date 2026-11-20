import { useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import type { QueryOptions } from "../../shared/types";
import type { GetTestsParams, GetTestsResponse } from "./types";

// GET /api/v1/tests (публичный)
export const getTests = async (params?: GetTestsParams) => {
  const res = await api.get<GetTestsResponse>("/tests", { params });
  return res.data;
};

export const useGetTests = (
  params?: GetTestsParams,
  options?: QueryOptions<GetTestsResponse>,
) =>
  useQuery<GetTestsResponse, ApiError>({
    ...options,
    queryKey: queryKeys.tests.list(params),
    queryFn: () => getTests(params),
  });

export type * from "./types";
