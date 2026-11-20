"use client";
import { useRouter } from "next/navigation";
import { LuEye } from "react-icons/lu";
import { useT } from "@/i18n";
import { ROLE_HOME, VIEW_ROLES, isViewRole } from "@/roles/roles";
import { useViewRole } from "@/roles/ViewRoleProvider";
import scss from "./Dashboard.module.scss";

/**
 * Переключатель вида кабинета: ученик / родитель / учитель / админ / сисадмин.
 * Нужен, чтобы посмотреть дизайн каждой роли; права проверяет бэкенд.
 */
const RoleSwitch = () => {
  const t = useT();
  const router = useRouter();
  const { role, setRole } = useViewRole();

  return (
    <label className={scss.roleSwitch} title={t.roles.switchHint}>
      <LuEye aria-hidden />
      <span className="sr-only">{t.roles.label}</span>
      <select
        value={role}
        onChange={(e) => {
          if (!isViewRole(e.target.value)) return;
          setRole(e.target.value);
          router.push(ROLE_HOME[e.target.value]);
        }}
      >
        {VIEW_ROLES.map((r) => (
          <option key={r} value={r}>
            {t.roles.names[r]}
          </option>
        ))}
      </select>
    </label>
  );
};

export default RoleSwitch;
