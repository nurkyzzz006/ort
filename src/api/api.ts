import axios, { AxiosError } from "axios";
import { getAccessToken } from "./tokens";

export const api = axios.create({
  baseURL: "/backend",
  headers: { "Content-Type": "application/json" },
});

// Автоматически добавляем токен ко всем запросам
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Формат ошибок бэкенда: { error: { code, message, details } }
interface ApiErrorBody {
  error?: {
    code?: string;
    message?: string;
    details?: { field?: string; message?: string }[] | null;
  };
}

const ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: "Неверная почта или пароль",
  validation_error: "Проверьте правильность введённых данных",
  unauthorized: "Требуется вход в аккаунт",
};

export const getErrorMessage = (err: unknown): string => {
  const e = err as AxiosError<ApiErrorBody>;
  if (!e.response) return "Ошибка сети, попробуйте ещё раз";
  if (e.response.status === 429) return "Слишком много попыток, подождите немного";
  const code = e.response.data?.error?.code;
  if (code && ERROR_MESSAGES[code]) return ERROR_MESSAGES[code];
  return e.response.data?.error?.message || "Что-то пошло не так";
};
