"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LuCalendar, LuFlame, LuLogOut, LuMenu, LuSettings } from "react-icons/lu";
import { useGetGoal, useGetStatsOverview, useLogout, useSession } from "@/api";
import { useT } from "@/i18n";
import { useViewRole } from "@/roles/ViewRoleProvider";
import LanguageSwitch from "../common/LanguageSwitch";
import RoleSwitch from "./RoleSwitch";
import ThemeSwitch from "../common/ThemeSwitch";
import commonScss from "../common/common.module.scss";
import scss from "./Dashboard.module.scss";

const initials = (name: string | null | undefined, email: string | null | undefined) => {
  const source = (name || email || "?").trim();
  const parts = source.split(/\s+/).filter(Boolean);
  return (parts.length > 1 ? parts[0][0] + parts[1][0] : source.slice(0, 2)).toUpperCase();
};

interface TopbarProps {
  onMenu: () => void;
}

const Topbar = ({ onMenu }: TopbarProps) => {
  const t = useT();
  const router = useRouter();
  const { user, isAuthenticated } = useSession();
  const { role } = useViewRole();
  // Серия и цель — данные ученика
  const studentView = isAuthenticated && role === "student";
  const overview = useGetStatsOverview(undefined, { enabled: studentView });
  const goal = useGetGoal({ enabled: studentView });
  const logout = useLogout();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Закрытие меню профиля по клику вне и по Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const streak = overview.data?.streak;

  return (
    <header className={scss.topbar}>
      <button type="button" className={scss.burger} onClick={onMenu} aria-label={t.common.openMenu}>
        <LuMenu />
      </button>

      <div className={scss.topbarInfo}>
        {!studentView ? null : goal.data ? (
          <Link href="/dashboard/analytics" className={scss.goalChip}>
            <LuCalendar aria-hidden />
            {t.topbar.daysLeft(goal.data.days_left)} · {t.topbar.target} {goal.data.target_score}
          </Link>
        ) : (
          // null — цели ещё нет
          goal.data === null && (
            <Link href="/dashboard/settings#goal" className={scss.goalChip}>
              <LuCalendar aria-hidden />
              {t.topbar.setGoal}
            </Link>
          )
        )}
      </div>

      <div className={scss.topbarActions}>
        <RoleSwitch />
        <LanguageSwitch />
        {studentView && streak !== undefined && (
          <span className={scss.streak} title={t.topbar.streakTitle}>
            <LuFlame aria-hidden /> {t.common.days(streak)}
          </span>
        )}
        <ThemeSwitch />

        <div className={scss.profile} ref={menuRef}>
          <button
            type="button"
            className={scss.avatar}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label={t.topbar.profileMenu}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {initials(user?.display_name, user?.email)}
          </button>
          {menuOpen && (
            <div className={scss.profileMenu} role="menu">
              <div className={scss.profileHead}>
                <strong>{user?.display_name || t.topbar.student}</strong>
                <span>{user?.email}</span>
              </div>
              <Link
                href="/dashboard/settings"
                role="menuitem"
                className={commonScss.menuItem}
                onClick={() => setMenuOpen(false)}
              >
                <LuSettings aria-hidden /> {t.nav.settings}
              </Link>
              <button
                type="button"
                role="menuitem"
                className={commonScss.menuItem}
                onClick={() =>
                  logout.mutate(undefined, { onSettled: () => router.replace("/login") })
                }
              >
                <LuLogOut aria-hidden /> {t.nav.logout}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
