import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { invalidateKeys, queryKeys } from "../../../query-keys";
import { apiPath } from "../../../shared/url";
import type { AddUniversityProgramResponse, AddUniversityProgramRequest } from "./types";

// POST /api/v1/admin/universities/{university_id}/programs → 201
export const addUniversityProgram = async ({ universityId, data }: AddUniversityProgramRequest) => {
  const res = await api.post<AddUniversityProgramResponse>(apiPath`/admin/universities/${universityId}/programs`, data);
  return res.data;
};

export const useAddUniversityProgram = () => {
  const queryClient = useQueryClient();

  return useMutation<AddUniversityProgramResponse, ApiError, AddUniversityProgramRequest>({
    mutationFn: addUniversityProgram,
    onSuccess: () => invalidateKeys(queryClient, [queryKeys.universities.all]),
  });
};

export type * from "./types";
