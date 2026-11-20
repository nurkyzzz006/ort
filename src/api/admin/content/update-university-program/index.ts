import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { invalidateKeys, queryKeys } from "../../../query-keys";
import { apiPath } from "../../../shared/url";
import type { UpdateUniversityProgramResponse, UpdateUniversityProgramRequest } from "./types";

// PATCH /api/v1/admin/university-programs/{program_id}
export const updateUniversityProgram = async ({ programId, data }: UpdateUniversityProgramRequest) => {
  const res = await api.patch<UpdateUniversityProgramResponse>(apiPath`/admin/university-programs/${programId}`, data);
  return res.data;
};

export const useUpdateUniversityProgram = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateUniversityProgramResponse, ApiError, UpdateUniversityProgramRequest>({
    mutationFn: updateUniversityProgram,
    onSuccess: () => invalidateKeys(queryClient, [queryKeys.universities.all]),
  });
};

export type * from "./types";
