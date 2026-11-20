"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useSession } from "@/api";
import { defaultViewRole, isViewRole, type ViewRole } from "./roles";

const STORAGE_KEY = "orto-view-role";

interface ViewRoleContextValue {
  role: ViewRole;
  setRole: (role: ViewRole) => void;
}

const ViewRoleContext = createContext<ViewRoleContextValue | null>(null);

/**
 * Какой кабинет показывать. Выбор — несекретная настройка интерфейса
 * (localStorage); права по-прежнему проверяет бэкенд.
 */
export const ViewRoleProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useSession();
  const [chosen, setChosen] = useState<ViewRole | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // Синхронизация с хранилищем после гидратации
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (isViewRole(saved)) setChosen(saved);
    } catch {
      // хранилище недоступно — используем роль по умолчанию
    }
  }, []);

  const setRole = useCallback((role: ViewRole) => {
    setChosen(role);
    try {
      localStorage.setItem(STORAGE_KEY, role);
    } catch {
      // не сохранилось — выбор действует до перезагрузки
    }
  }, []);

  const role = chosen ?? defaultViewRole(user?.roles ?? []);
  const value = useMemo(() => ({ role, setRole }), [role, setRole]);

  return <ViewRoleContext.Provider value={value}>{children}</ViewRoleContext.Provider>;
};

export const useViewRole = () => {
  const ctx = useContext(ViewRoleContext);
  if (!ctx) throw new Error("useViewRole must be used inside <ViewRoleProvider>");
  return ctx;
};
