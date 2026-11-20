import { useQuery } from "@tanstack/react-query";
import { api, PROXY_BASE_URL, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import type { QueryOptions } from "../../shared/types";
import { apiPath } from "../../shared/url";
import type { GetMediaResponse } from "./types";

// GET /api/v1/media/{media_id} (публичный)

/**
 * Адрес файла для <img src={…}> — рекомендуемый способ показа картинок:
 * браузер сам кэширует их, а запрос идёт через тот же BFF.
 */
export const getMediaUrl = (mediaId: string) =>
  `${PROXY_BASE_URL}${apiPath`/media/${mediaId}`}`;

export const getMedia = async (mediaId: string) => {
  const res = await api.get<GetMediaResponse>(apiPath`/media/${mediaId}`, {
    responseType: "blob",
  });
  return res.data;
};

/** Файл как Blob — если его нужно обработать в коде (скачать, нарисовать на canvas) */
export const useGetMedia = (
  mediaId: string | undefined,
  options?: QueryOptions<GetMediaResponse>,
) =>
  useQuery<GetMediaResponse, ApiError>({
    staleTime: Infinity, // файл по id не меняется
    ...options,
    queryKey: queryKeys.media.detail(mediaId ?? ""),
    queryFn: () => getMedia(mediaId as string),
    enabled: Boolean(mediaId) && options?.enabled !== false,
  });

export type * from "./types";
