import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { invalidateKeys, queryKeys } from "../../../query-keys";
import type { CreateQuestionResponse, CreateQuestionRequest } from "./types";

// POST /api/v1/admin/questions → 201
// Создаёт вопрос в статусе draft
export const createQuestion = async (data: CreateQuestionRequest) => {
  const res = await api.post<CreateQuestionResponse>("/admin/questions", data);
  return res.data;
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateQuestionResponse, ApiError, CreateQuestionRequest>({
    mutationFn: createQuestion,
    onSuccess: () => invalidateKeys(queryClient, [queryKeys.admin.questionsAll()]),
  });
};

export type * from "./types";
