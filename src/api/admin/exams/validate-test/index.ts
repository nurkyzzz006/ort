import { useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { queryKeys } from "../../../query-keys";
import type { QueryOptions } from "../../../shared/types";
import { apiPath } from "../../../shared/url";
import type { ValidateTestResponse } from "./types";

// GET /api/v1/admin/tests/{test_id}/validate
// Проверка соответствия blueprint перед публикацией
export const validateTest = async (testId: string) => {
  const res = await api.get<ValidateTestResponse>(apiPath`/admin/tests/${testId}/validate`);
  return res.data;
};

/** Запрос не выполняется, пока testId не задан */
export const useValidateTest = (
  testId: string | undefined,
  options?: QueryOptions<ValidateTestResponse>,
) =>
  useQuery<ValidateTestResponse, ApiError>({
    ...options,
    queryKey: queryKeys.admin.testValidation(testId ?? ""),
    queryFn: () => validateTest(testId as string),
    enabled: Boolean(testId) && options?.enabled !== false,
  });

export type * from "./types";
