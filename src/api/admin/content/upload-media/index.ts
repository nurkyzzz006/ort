import { useMutation } from "@tanstack/react-query";
import { api, type ApiError } from "../../../axios";
import type { UploadMediaResponse, UploadMediaRequest } from "./types";

// POST /api/v1/admin/media → 201
// Картинка для вопроса; вставьте возвращённый markdown в текст вопроса
export const uploadMedia = async ({ file }: UploadMediaRequest) => {
  const form = new FormData();
  form.append("file", file);
  const res = await api.post<UploadMediaResponse>("/admin/media", form);
  return res.data;
};

export const useUploadMedia = () => {
  return useMutation<UploadMediaResponse, ApiError, UploadMediaRequest>({
    mutationFn: uploadMedia,
  });
};

export type * from "./types";
