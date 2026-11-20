import { useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { queryKeys } from "../../../query-keys";
import type { QueryOptions } from "../../../shared/types";
import type { GetAdminTestsResponse } from "./types";

// GET /api/v1/admin/tests
// Все тесты, включая черновики
export const getAdminTests = async () => {
  const res = await api.get<GetAdminTestsResponse>("/admin/tests");
  return res.data;
};

export const useGetAdminTests = (options?: QueryOptions<GetAdminTestsResponse>) =>
  useQuery<GetAdminTestsResponse, ApiError>({
    ...options,
    queryKey: queryKeys.admin.tests(),
    queryFn: getAdminTests,
  });

export type * from "./types";
