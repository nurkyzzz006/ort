import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { invalidateKeys, queryKeys } from "../../../query-keys";
import { apiPath } from "../../../shared/url";
import type { ResolveQuestionReportResponse, ResolveQuestionReportRequest } from "./types";

// POST /api/v1/admin/question-reports/{report_id}/resolve
export const resolveQuestionReport = async ({ reportId }: ResolveQuestionReportRequest) => {
  const res = await api.post<ResolveQuestionReportResponse>(apiPath`/admin/question-reports/${reportId}/resolve`);
  return res.data;
};

export const useResolveQuestionReport = () => {
  const queryClient = useQueryClient();

  return useMutation<ResolveQuestionReportResponse, ApiError, ResolveQuestionReportRequest>({
    mutationFn: resolveQuestionReport,
    onSuccess: () => invalidateKeys(queryClient, [queryKeys.admin.reportsAll()]),
  });
};

export type * from "./types";
