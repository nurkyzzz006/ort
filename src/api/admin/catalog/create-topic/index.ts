import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import { invalidateKeys, queryKeys } from "../../../query-keys";
import type { CreateTopicResponse, CreateTopicRequest } from "./types";

// POST /api/v1/admin/topics → 201
export const createTopic = async (data: CreateTopicRequest) => {
  const res = await api.post<CreateTopicResponse>("/admin/topics", data);
  return res.data;
};

export const useCreateTopic = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateTopicResponse, ApiError, CreateTopicRequest>({
    mutationFn: createTopic,
    onSuccess: () => invalidateKeys(queryClient, [queryKeys.admin.topicsAll(), queryKeys.catalog.all]),
  });
};

export type * from "./types";
