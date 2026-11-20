import { useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import type { QueryOptions } from "../../shared/types";
import type { GetMeResponse } from "./types";

// GET /api/v1/me
export const getMe = async () => {
  const res = await api.get<GetMeResponse>("/me");
  return res.data;
};

export const useGetMe = (options?: QueryOptions<GetMeResponse>) =>
  useQuery<GetMeResponse, ApiError>({
    queryKey: queryKeys.me.profile(),
    queryFn: getMe,
    ...options,
  });

export type * from "./types";
