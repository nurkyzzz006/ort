import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { invalidateKeys, queryKeys } from "../../../query-keys";
import { apiPath } from "../../../shared/url";
import type { UpdateSubjectResponse, UpdateSubjectRequest } from "./types";

// PATCH /api/v1/admin/subjects/{subject_id}
export const updateSubject = async ({ subjectId, data }: UpdateSubjectRequest) => {
  const res = await api.patch<UpdateSubjectResponse>(apiPath`/admin/subjects/${subjectId}`, data);
  return res.data;
};

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateSubjectResponse, ApiError, UpdateSubjectRequest>({
    mutationFn: updateSubject,
    onSuccess: () => invalidateKeys(queryClient, [queryKeys.admin.subjects(), queryKeys.catalog.all]),
  });
};

export type * from "./types";
