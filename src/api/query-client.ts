import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "./axios";

const MAX_RETRIES = 2;

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        // Ошибки 4xx (нет доступа, не найдено, валидация) повторять бессмысленно
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
            return false;
          }
          return failureCount < MAX_RETRIES;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
