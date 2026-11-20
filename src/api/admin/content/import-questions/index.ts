import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { invalidateKeys, queryKeys } from "../../../query-keys";
import type { ImportQuestionsResponse, ImportQuestionsRequest } from "./types";

// POST /api/v1/admin/questions/import
// CSV/JSON. dry_run=true (по умолчанию) только проверяет; файл с ошибкой не импортируется целиком
export const importQuestions = async ({ file, dryRun = true }: ImportQuestionsRequest) => {
  const form = new FormData();
  form.append("file", file);
  const res = await api.post<ImportQuestionsResponse>("/admin/questions/import", form, { params: { dry_run: dryRun } });
  return res.data;
};

export const useImportQuestions = () => {
  const queryClient = useQueryClient();

  return useMutation<ImportQuestionsResponse, ApiError, ImportQuestionsRequest>({
    mutationFn: importQuestions,
    // Вопросы создаются только при dry_run=false
    onSuccess: (_data, { dryRun = true }) => {
      if (!dryRun) void invalidateKeys(queryClient, [queryKeys.admin.questionsAll()]);
    },
  });
};

export type * from "./types";
