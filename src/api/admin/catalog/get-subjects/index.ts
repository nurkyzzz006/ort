import { useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { queryKeys } from "../../../query-keys";
import type { QueryOptions } from "../../../shared/types";
import type { GetAdminSubjectsResponse } from "./types";

// GET /api/v1/admin/subjects
// Все предметы, включая выключенные
export const getAdminSubjects = async () => {
  const res = await api.get<GetAdminSubjectsResponse>("/admin/subjects");
  return res.data;
};

export const useGetAdminSubjects = (options?: QueryOptions<GetAdminSubjectsResponse>) =>
  useQuery<GetAdminSubjectsResponse, ApiError>({
    ...options,
    queryKey: queryKeys.admin.subjects(),
    queryFn: getAdminSubjects,
  });

export type * from "./types";
