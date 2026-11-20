import { useMutation } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import type { ExportAccountResponse } from "./types";

// GET /api/v1/account/export
export const exportAccount = async () => {
  const res = await api.get<ExportAccountResponse>("/account/export", {
    responseType: "blob",
  });
  return res.data;
};

/**
 * Исключение из правила «GET → useQuery»: это действие по кнопке
 * «Скачать мои данные», а не данные для экрана. Хранить полную выгрузку
 * персональных данных в кэше не нужно, поэтому используется useMutation.
 */
export const useExportAccount = () =>
  useMutation<ExportAccountResponse, ApiError, void>({
    mutationFn: exportAccount,
  });

export type * from "./types";
