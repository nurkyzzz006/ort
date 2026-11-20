import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import type {
  UpdateNotificationsRequest,
  UpdateNotificationsResponse,
} from "./types";

// PATCH /api/v1/me/notifications
export const updateNotifications = async (data: UpdateNotificationsRequest) => {
  const res = await api.patch<UpdateNotificationsResponse>(
    "/me/notifications",
    data,
  );
  return res.data;
};

export const useUpdateNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateNotificationsResponse,
    ApiError,
    UpdateNotificationsRequest
  >({
    mutationFn: updateNotifications,
    onSuccess: (settings) =>
      queryClient.setQueryData(queryKeys.me.notifications(), settings),
  });
};

export type * from "./types";
