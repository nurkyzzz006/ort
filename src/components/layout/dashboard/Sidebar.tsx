"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LuLogOut, LuSettings } from "react-icons/lu";
import { useGetMistakes, useGetReviewQueue, useLogout, useSession } from "@/api";
import { useT } from "@/i18n";
import { ROLE_HOME, ROLE_NAV } from "@/roles/roles";
import { useViewRole } from "@/roles/ViewRoleProvider";
import Logo from "../common/Logo";
import scss from "./Dashboard.module.scss";

interface SidebarProps {
  open: boolean;
  onNavigate: () => void;
}

const matches = (pathname: string, href: string) =>
  href !== "/" && (pathname === href || pathname.startsWith(`${href}/`));

const Sidebar = ({ open, onNavigate }: SidebarProps) => {
  const t = useT();
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useSession();
  const { role } = useViewRole();
  const logout = useLogout();
  const nav = ROLE_NAV[role];

  // Активен самый конкретный пункт (/dashboard/teacher/homework, а не /dashboard/teacher)
  const activeHref = [...nav.map((i) => i.href), "/dashboard/settings"]
    .filter((href) => matches(pathname, href))
    .sort((a, b) => b.length - a.length)[0];
  const isActive = (href: string) => href === activeHref;

  // Счётчики в меню ученика — реальные данные: активные ошибки и карточки на сегодня
  const studentView = isAuthenticated && role === "student";
  const mistakes = useGetMistakes({ limit: 1 }, { enabled: studentView });
  const review = useGetReviewQueue({ enabled: studentView });
  const counters = { mistakes: mistakes.data?.total, review: review.data?.due };

  const onLogout = () =>
    logout.mutate(undefined, { onSettled: () => router.replace("/login") });

  return (
    <aside className={[scss.sidebar, open ? scss.sidebarOpen : ""].join(" ")} aria-label={t.nav.main}>
      <div className={scss.sidebarLogo}>
        <Logo href={ROLE_HOME[role]} subtitle={t.brand.long} inverted />
      </div>

      <nav className={scss.menu}>
        <p className={scss.menuTitle}>{t.roles.section[role]}</p>
        {nav.map((item) => {
          const active = isActive(item.href);
          const count = item.counter ? counters[item.counter] : undefined;
          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={onNavigate}
              className={active ? scss.active : ""}
              aria-current={active ? "page" : undefined}
            >
              <span className={scss.menuIcon}>{item.icon}</span>
              <span className={scss.menuLabel}>{t.nav.items[item.key]}</span>
              {count ? <span className={scss.counter}>{count > 99 ? "99+" : count}</span> : null}
            </Link>
          );
        })}

        <p className={scss.menuTitle}>{t.nav.sectionManage}</p>
        <Link
          href="/dashboard/settings"
          onClick={onNavigate}
          className={isActive("/dashboard/settings") ? scss.active : ""}
        >
          <span className={scss.menuIcon}>
            <LuSettings />
          </span>
          <span className={scss.menuLabel}>{t.nav.settings}</span>
        </Link>
      </nav>

      <button
        type="button"
        className={scss.logout}
        onClick={onLogout}
        disabled={logout.isPending}
      >
        <LuLogOut aria-hidden />
        {logout.isPending ? t.nav.loggingOut : t.nav.logout}
      </button>
    </aside>
  );
};

export default Sidebar;
