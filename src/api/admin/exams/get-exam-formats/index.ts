import { useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { queryKeys } from "../../../query-keys";
import type { QueryOptions } from "../../../shared/types";
import type { GetExamFormatsResponse } from "./types";

// GET /api/v1/admin/exam-formats
export const getExamFormats = async () => {
  const res = await api.get<GetExamFormatsResponse>("/admin/exam-formats");
  return res.data;
};

export const useGetExamFormats = (options?: QueryOptions<GetExamFormatsResponse>) =>
  useQuery<GetExamFormatsResponse, ApiError>({
    ...options,
    queryKey: queryKeys.admin.formats(),
    queryFn: getExamFormats,
  });

export type * from "./types";
