import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { invalidateKeys, queryKeys } from "../../../query-keys";
import type { CreateExamFormatResponse, CreateExamFormatRequest } from "./types";

// POST /api/v1/admin/exam-formats → 201
// Новая версия blueprint в статусе draft
export const createExamFormat = async (data: CreateExamFormatRequest) => {
  const res = await api.post<CreateExamFormatResponse>("/admin/exam-formats", data);
  return res.data;
};

export const useCreateExamFormat = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateExamFormatResponse, ApiError, CreateExamFormatRequest>({
    mutationFn: createExamFormat,
    onSuccess: () => invalidateKeys(queryClient, [queryKeys.admin.formats()]),
  });
};

export type * from "./types";
