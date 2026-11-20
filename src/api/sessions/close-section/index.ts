import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import { apiPath } from "../../shared/url";
import type { CloseSectionRequest, CloseSectionResponse } from "./types";

// POST /api/v1/sessions/{session_id}/sections/{section_code}/close
export const closeSection = async ({ sessionId, sectionCode }: CloseSectionRequest) => {
  const res = await api.post<CloseSectionResponse>(
    apiPath`/sessions/${sessionId}/sections/${sectionCode}/close`,
  );
  return res.data;
};

export const useCloseSection = () => {
  const queryClient = useQueryClient();

  return useMutation<CloseSectionResponse, ApiError, CloseSectionRequest>({
    mutationFn: closeSection,
    onSuccess: (session) =>
      queryClient.setQueryData(queryKeys.sessions.detail(session.id), session),
  });
};

export type * from "./types";
