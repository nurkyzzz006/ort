import { useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { queryKeys } from "../../../query-keys";
import type { QueryOptions } from "../../../shared/types";
import type { GetQuestionReportsResponse, GetQuestionReportsParams } from "./types";

// GET /api/v1/admin/question-reports
// Жалобы учеников, старые первыми
export const getQuestionReports = async (params?: GetQuestionReportsParams) => {
  const res = await api.get<GetQuestionReportsResponse>("/admin/question-reports", { params });
  return res.data;
};

export const useGetQuestionReports = (
  params?: GetQuestionReportsParams,
  options?: QueryOptions<GetQuestionReportsResponse>,
) =>
  useQuery<GetQuestionReportsResponse, ApiError>({
    ...options,
    queryKey: queryKeys.admin.reports(params),
    queryFn: () => getQuestionReports(params),
  });

export type * from "./types";
