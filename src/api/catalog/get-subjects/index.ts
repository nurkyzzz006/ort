import { useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import type { QueryOptions } from "../../shared/types";
import type { GetSubjectsResponse } from "./types";

const CATALOG_STALE_TIME = 10 * 60_000; // справочник меняется редко

// GET /api/v1/subjects (публичный)
export const getSubjects = async () => {
  const res = await api.get<GetSubjectsResponse>("/subjects");
  return res.data;
};

export const useGetSubjects = (options?: QueryOptions<GetSubjectsResponse>) =>
  useQuery<GetSubjectsResponse, ApiError>({
    staleTime: CATALOG_STALE_TIME,
    ...options,
    queryKey: queryKeys.catalog.subjects(),
    queryFn: getSubjects,
  });

export type * from "./types";
