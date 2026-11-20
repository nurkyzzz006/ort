import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { invalidateKeys, queryKeys } from "../../../query-keys";
import { apiPath } from "../../../shared/url";
import type { UpdateTopicResponse, UpdateTopicRequest } from "./types";

// PATCH /api/v1/admin/topics/{topic_id}
export const updateTopic = async ({ topicId, data }: UpdateTopicRequest) => {
  const res = await api.patch<UpdateTopicResponse>(apiPath`/admin/topics/${topicId}`, data);
  return res.data;
};

export const useUpdateTopic = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateTopicResponse, ApiError, UpdateTopicRequest>({
    mutationFn: updateTopic,
    onSuccess: () => invalidateKeys(queryClient, [queryKeys.admin.topicsAll(), queryKeys.catalog.all]),
  });
};

export type * from "./types";
