import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { invalidateKeys, queryKeys } from "../../../query-keys";
import type { CreateTestResponse, CreateTestRequest } from "./types";

// POST /api/v1/admin/tests → 201
export const createTest = async (data: CreateTestRequest) => {
  const res = await api.post<CreateTestResponse>("/admin/tests", data);
  return res.data;
};

export const useCreateTest = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateTestResponse, ApiError, CreateTestRequest>({
    mutationFn: createTest,
    onSuccess: () => invalidateKeys(queryClient, [queryKeys.admin.testsAll()]),
  });
};

export type * from "./types";
