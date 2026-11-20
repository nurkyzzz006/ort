import RoleGuard from "@/components/guards/RoleGuard";
import AdminPanel from "@/components/pages/admin/AdminPanel";
import React, { Suspense } from "react";

// Реальные данные admin-API: доступ по роли (интерфейс) + проверка прав на бэкенде (403).
// AdminPanel читает ?tab= из URL → нужна Suspense-граница.
const page = () => (
  <RoleGuard roles={["admin", "editor", "expert"]}>
    <Suspense>
      <AdminPanel />
    </Suspense>
  </RoleGuard>
);

export default page;
