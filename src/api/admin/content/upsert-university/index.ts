import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { invalidateKeys, queryKeys } from "../../../query-keys";
import type { UpsertUniversityResponse, UpsertUniversityRequest } from "./types";

// PUT /api/v1/admin/universities
export const upsertUniversity = async (data: UpsertUniversityRequest) => {
  const res = await api.put<UpsertUniversityResponse>("/admin/universities", data);
  return res.data;
};

export const useUpsertUniversity = () => {
  const queryClient = useQueryClient();

  return useMutation<UpsertUniversityResponse, ApiError, UpsertUniversityRequest>({
    mutationFn: upsertUniversity,
    onSuccess: () => invalidateKeys(queryClient, [queryKeys.universities.all]),
  });
};

export type * from "./types";
