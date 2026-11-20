import { useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import type { QueryOptions } from "../../shared/types";
import type { GetNotificationsResponse } from "./types";

// GET /api/v1/me/notifications
export const getNotifications = async () => {
  const res = await api.get<GetNotificationsResponse>("/me/notifications");
  return res.data;
};

export const useGetNotifications = (
  options?: QueryOptions<GetNotificationsResponse>,
) =>
  useQuery<GetNotificationsResponse, ApiError>({
    ...options,
    queryKey: queryKeys.me.notifications(),
    queryFn: getNotifications,
  });

export type * from "./types";
