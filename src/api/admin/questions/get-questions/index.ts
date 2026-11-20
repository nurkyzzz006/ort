import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { queryKeys } from "../../../query-keys";
import type { QueryOptions } from "../../../shared/types";
import type { GetAdminQuestionsResponse, GetAdminQuestionsParams } from "./types";

// GET /api/v1/admin/questions
export const getAdminQuestions = async (params?: GetAdminQuestionsParams) => {
  const res = await api.get<GetAdminQuestionsResponse>("/admin/questions", { params });
  return res.data;
};

export const useGetAdminQuestions = (
  params?: GetAdminQuestionsParams,
  options?: QueryOptions<GetAdminQuestionsResponse>,
) =>
  useQuery<GetAdminQuestionsResponse, ApiError>({
    placeholderData: keepPreviousData,
    ...options,
    queryKey: queryKeys.admin.questions(params),
    queryFn: () => getAdminQuestions(params),
  });

export type * from "./types";
