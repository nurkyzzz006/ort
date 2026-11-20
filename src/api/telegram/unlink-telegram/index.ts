import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import { queryKeys } from "../../query-keys";
import type { UnlinkTelegramResponse } from "./types";

// DELETE /api/v1/telegram/link
export const unlinkTelegram = async (): Promise<UnlinkTelegramResponse> => {
  await api.delete("/telegram/link");
};

export const useUnlinkTelegram = () => {
  const queryClient = useQueryClient();

  return useMutation<UnlinkTelegramResponse, ApiError, void>({
    mutationFn: unlinkTelegram,
    // telegram_linked хранится в настройках уведомлений
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.me.notifications() }),
  });
};

export type * from "./types";
