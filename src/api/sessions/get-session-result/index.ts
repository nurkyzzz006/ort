import { useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import type { QueryOptions } from "../../shared/types";
import { apiPath } from "../../shared/url";
import type { GetSessionResultResponse } from "./types";

// GET /api/v1/sessions/{session_id}/result
export const getSessionResult = async (sessionId: string) => {
  const res = await api.get<GetSessionResultResponse>(
    apiPath`/sessions/${sessionId}/result`,
  );
  return res.data;
};

/** Результат завершённого теста не меняется — кэш не устаревает */
export const useGetSessionResult = (
  sessionId: string | undefined,
  options?: QueryOptions<GetSessionResultResponse>,
) =>
  useQuery<GetSessionResultResponse, ApiError>({
    staleTime: Infinity,
    ...options,
    queryKey: queryKeys.sessions.result(sessionId ?? ""),
    queryFn: () => getSessionResult(sessionId as string),
    enabled: Boolean(sessionId) && options?.enabled !== false,
  });

export type * from "./types";
