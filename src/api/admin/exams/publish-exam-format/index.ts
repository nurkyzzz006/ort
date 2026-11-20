import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { invalidateKeys, queryKeys } from "../../../query-keys";
import { apiPath } from "../../../shared/url";
import type { PublishExamFormatResponse, PublishExamFormatRequest } from "./types";

// POST /api/v1/admin/exam-format-versions/{fv_id}/publish
export const publishExamFormat = async ({ formatVersionId }: PublishExamFormatRequest) => {
  const res = await api.post<PublishExamFormatResponse>(apiPath`/admin/exam-format-versions/${formatVersionId}/publish`);
  return res.data;
};

export const usePublishExamFormat = () => {
  const queryClient = useQueryClient();

  return useMutation<PublishExamFormatResponse, ApiError, PublishExamFormatRequest>({
    mutationFn: publishExamFormat,
    onSuccess: () => invalidateKeys(queryClient, [queryKeys.admin.formats()]),
  });
};

export type * from "./types";
