"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { createQueryClient, setSessionExpiredHandler } from "@/api";
import { SettingsProvider } from "@/settings/SettingsProvider";
import type { UiLocale } from "@/settings/constants";

interface ILayout {
  locale: UiLocale;
  children: ReactNode;
}

const PROTECTED_PREFIXES = ["/dashboard"];

const LayoutClient: FC<ILayout> = ({ locale, children }) => {
  const [queryClient] = useState(createQueryClient);
  const router = useRouter();

  useEffect(() => {
    // Сессия окончательно истекла: refresh не помог, BFF уже удалил cookie.
    // Регистрируется один раз здесь, а не в каждом компоненте.
    setSessionExpiredHandler(() => {
      const { pathname, search } = window.location;
      const isProtected = PROTECTED_PREFIXES.some(
        (p) => pathname === p || pathname.startsWith(`${p}/`),
      );
      // На публичных страницах ничего не делаем: useSession сам покажет гостя.
      if (!isProtected) return;

      queryClient.clear(); // данные прошлой сессии не должны остаться в памяти
      router.replace(`/login?next=${encodeURIComponent(pathname + search)}`);
    });
  }, [queryClient, router]);

  // Настройки интерфейса (тема, язык) — отдельно от API-авторизации
  return (
    <SettingsProvider initialLocale={locale}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SettingsProvider>
  );
};

export default LayoutClient;
