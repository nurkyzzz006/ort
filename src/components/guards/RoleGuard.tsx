"use client";
import type { ReactNode } from "react";
import { LuShieldX } from "react-icons/lu";
import { useSession, type RoleCode } from "@/api";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Empty, Loader } from "@/components/ui/StateView";
import { useT } from "@/i18n";

interface RoleGuardProps {
  /** Достаточно любой из перечисленных ролей */
  roles: RoleCode[];
  children: ReactNode;
}

/**
 * Показывает содержимое только пользователям с нужной ролью.
 * Это проверка для интерфейса: настоящие права всегда проверяет бэкенд
 * (он вернёт 403 на запрос без прав).
 */
const RoleGuard = ({ roles, children }: RoleGuardProps) => {
  const t = useT();
  const { isLoading, isAuthenticated, hasRole } = useSession();

  if (isLoading) return <Loader />;

  if (!isAuthenticated || !hasRole(...roles)) {
    return (
      <Card>
        <Empty
          icon={<LuShieldX />}
          title={t.guard.title}
          text={t.guard.text}
          action={
            <Button href="/dashboard/kabinet" size="sm">
              {t.guard.back}
            </Button>
          }
        />
      </Card>
    );
  }

  return <>{children}</>;
};

export default RoleGuard;
