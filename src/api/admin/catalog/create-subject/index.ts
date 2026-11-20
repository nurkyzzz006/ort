import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { invalidateKeys, queryKeys } from "../../../query-keys";
import type { CreateSubjectResponse, CreateSubjectRequest } from "./types";

// POST /api/v1/admin/subjects → 201
export const createSubject = async (data: CreateSubjectRequest) => {
  const res = await api.post<CreateSubjectResponse>("/admin/subjects", data);
  return res.data;
};

export const useCreateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateSubjectResponse, ApiError, CreateSubjectRequest>({
    mutationFn: createSubject,
    onSuccess: () => invalidateKeys(queryClient, [queryKeys.admin.subjects(), queryKeys.catalog.all]),
  });
};

export type * from "./types";
