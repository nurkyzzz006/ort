import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import type { QueryOptions } from "../../shared/types";
import type {
  GetUniversityProgramsParams,
  GetUniversityProgramsResponse,
} from "./types";

// GET /api/v1/universities/programs (публичный)
export const getUniversityPrograms = async (params?: GetUniversityProgramsParams) => {
  const res = await api.get<GetUniversityProgramsResponse>(
    "/universities/programs",
    { params },
  );
  return res.data;
};

export const useGetUniversityPrograms = (
  params?: GetUniversityProgramsParams,
  options?: QueryOptions<GetUniversityProgramsResponse>,
) =>
  useQuery<GetUniversityProgramsResponse, ApiError>({
    placeholderData: keepPreviousData, // поиск без «мигания» списка
    ...options,
    queryKey: queryKeys.universities.programs(params),
    queryFn: () => getUniversityPrograms(params),
  });

export type * from "./types";
