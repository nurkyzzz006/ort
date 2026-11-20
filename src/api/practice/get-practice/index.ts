import { useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import type { QueryOptions } from "../../shared/types";
import { apiPath } from "../../shared/url";
import type { GetPracticeResponse } from "./types";

// GET /api/v1/practice/sessions/{session_id}
export const getPractice = async (sessionId: string) => {
  const res = await api.get<GetPracticeResponse>(
    apiPath`/practice/sessions/${sessionId}`,
  );
  return res.data;
};

export const useGetPractice = (
  sessionId: string | undefined,
  options?: QueryOptions<GetPracticeResponse>,
) =>
  useQuery<GetPracticeResponse, ApiError>({
    refetchOnWindowFocus: false,
    ...options,
    queryKey: queryKeys.practice.detail(sessionId ?? ""),
    queryFn: () => getPractice(sessionId as string),
    enabled: Boolean(sessionId) && options?.enabled !== false,
  });

export type * from "./types";
