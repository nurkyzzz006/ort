import { useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import type { QueryOptions } from "../../shared/types";
import { apiPath } from "../../shared/url";
import type { GetSessionStrategyResponse } from "./types";

// GET /api/v1/sessions/{session_id}/strategy
export const getSessionStrategy = async (sessionId: string) => {
  const res = await api.get<GetSessionStrategyResponse>(
    apiPath`/sessions/${sessionId}/strategy`,
  );
  return res.data;
};

export const useGetSessionStrategy = (
  sessionId: string | undefined,
  options?: QueryOptions<GetSessionStrategyResponse>,
) =>
  useQuery<GetSessionStrategyResponse, ApiError>({
    staleTime: Infinity,
    ...options,
    queryKey: queryKeys.sessions.strategy(sessionId ?? ""),
    queryFn: () => getSessionStrategy(sessionId as string),
    enabled: Boolean(sessionId) && options?.enabled !== false,
  });

export type * from "./types";
