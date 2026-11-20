import { useGetMe } from "../me/get-me";
import type { RoleCode, User } from "../shared/types";

const SESSION_STALE_TIME = 5 * 60_000;

/**
 * Единственный источник информации о текущем пользователе.
 * Используйте его во всех компонентах вместо собственных проверок авторизации.
 * После перезагрузки страницы сессия восстанавливается из HttpOnly cookie
 * запросом GET /me (при необходимости Axios сам сделает refresh).
 */
export const useSession = () => {
  const query = useGetMe({ retry: false, staleTime: SESSION_STALE_TIME });

  const user: User | null = query.data ?? null;
  const roles = user?.roles ?? [];

  return {
    user,
    /** Идёт первая проверка сессии */
    isLoading: query.isPending,
    isAuthenticated: user !== null,
    /** Есть ли у пользователя хотя бы одна из ролей */
    hasRole: (...required: RoleCode[]) =>
      required.some((role) => roles.includes(role)),
    error: query.error,
    refetch: query.refetch,
  };
};
