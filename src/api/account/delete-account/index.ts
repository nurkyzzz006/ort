import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { logout } from "../../auth/logout";
import type { DeleteAccountRequest, DeleteAccountResponse } from "./types";

// DELETE /api/v1/account — необратимо удаляет аккаунт и все данные
export const deleteAccount = async (
  data: DeleteAccountRequest,
): Promise<DeleteAccountResponse> => {
  await api.delete("/account", { data });
  // Токены удалённого аккаунта больше не действуют — очищаем cookie сессии
  await logout().catch(() => undefined);
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteAccountResponse, ApiError, DeleteAccountRequest>({
    mutationFn: deleteAccount,
    onSuccess: () => queryClient.clear(),
  });
};

export type * from "./types";
