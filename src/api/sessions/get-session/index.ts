import { useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import type { QueryOptions } from "../../shared/types";
import { apiPath } from "../../shared/url";
import type { GetSessionResponse } from "./types";

// GET /api/v1/sessions/{session_id}
export const getSession = async (sessionId: string) => {
  const res = await api.get<GetSessionResponse>(apiPath`/sessions/${sessionId}`);
  return res.data;
};

/**
 * Состояние экзамена. Не перезапрашивается при фокусе окна, чтобы не
 * перетирать ответы, которые ещё сохраняются (useSaveAnswer обновляет кэш сам).
 */
export const useGetSession = (
  sessionId: string | undefined,
  options?: QueryOptions<GetSessionResponse>,
) =>
  useQuery<GetSessionResponse, ApiError>({
    refetchOnWindowFocus: false,
    ...options,
    queryKey: queryKeys.sessions.detail(sessionId ?? ""),
    queryFn: () => getSession(sessionId as string),
    enabled: Boolean(sessionId) && options?.enabled !== false,
  });

export type * from "./types";
