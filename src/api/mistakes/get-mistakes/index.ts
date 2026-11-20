import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import type { QueryOptions } from "../../shared/types";
import type { GetMistakesParams, GetMistakesResponse } from "./types";

// GET /api/v1/mistakes
export const getMistakes = async (params?: GetMistakesParams) => {
  const res = await api.get<GetMistakesResponse>("/mistakes", { params });
  return res.data;
};

export const useGetMistakes = (
  params?: GetMistakesParams,
  options?: QueryOptions<GetMistakesResponse>,
) =>
  useQuery<GetMistakesResponse, ApiError>({
    placeholderData: keepPreviousData, // без «мигания» при смене фильтра/страницы
    ...options,
    queryKey: queryKeys.mistakes.list(params),
    queryFn: () => getMistakes(params),
  });

export type * from "./types";
