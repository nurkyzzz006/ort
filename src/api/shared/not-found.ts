import { ApiError } from "../axios";

/**
 * Для endpoint-ов «текущего» ресурса (цель, план) ответ 404 означает
 * «ещё не создан» — это нормальное состояние, а не ошибка.
 * Возвращаем null: он кэшируется, и запрос не повторяется на каждом экране.
 */
export const nullIfNotFound = async <T>(request: Promise<T>): Promise<T | null> => {
  try {
    return await request;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
};
