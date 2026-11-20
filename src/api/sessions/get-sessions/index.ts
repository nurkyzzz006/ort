import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import type { QueryOptions } from "../../shared/types";
import type { GetSessionsParams, GetSessionsResponse } from "./types";

// GET /api/v1/sessions — история попыток ученика
export const getSessions = async (params?: GetSessionsParams) => {
  const res = await api.get<GetSessionsResponse>("/sessions", { params });
  return res.data;
};

export const useGetSessions = (
  params?: GetSessionsParams,
  options?: QueryOptions<GetSessionsResponse>,
) =>
  useQuery<GetSessionsResponse, ApiError>({
    placeholderData: keepPreviousData, // без «мигания» при смене страницы
    ...options,
    queryKey: queryKeys.sessions.list(params),
    queryFn: () => getSessions(params),
  });

export type * from "./types";
