import type { ReactNode } from "react";
import {
  LuBookOpen,
  LuChartNoAxesColumn,
  LuClipboardList,
  LuFileText,
  LuHouse,
  LuLayoutGrid,
  LuRotateCw,
  LuServer,
  LuShieldCheck,
  LuSparkles,
  LuTarget,
  LuTriangleAlert,
  LuTrophy,
  LuUsers,
} from "react-icons/lu";

/**
 * Вид интерфейса (чей кабинет показываем).
 * Права доступа определяет ТОЛЬКО бэкенд по своим ролям (student, editor, expert, admin);
 * parent / teacher / sysadmin пока есть лишь в дизайне — API для них не реализован.
 */
export type ViewRole = "student" | "parent" | "teacher" | "admin" | "sysadmin";

export const VIEW_ROLES: ViewRole[] = ["student", "parent", "teacher", "admin", "sysadmin"];

/** Роли, для которых бэкенд уже даёт API */
export const ROLES_WITH_API: ViewRole[] = ["student", "admin"];

export const isViewRole = (v: unknown): v is ViewRole =>
  typeof v === "string" && (VIEW_ROLES as string[]).includes(v);

/** Вид по умолчанию — по реальной роли пользователя из /me */
export const defaultViewRole = (backendRoles: string[]): ViewRole =>
  backendRoles.includes("admin") || backendRoles.includes("editor") || backendRoles.includes("expert")
    ? "admin"
    : "student";

export type NavKey =
  | "home"
  | "cabinet"
  | "tests"
  | "practice"
  | "subjects"
  | "homework"
  | "olympiads"
  | "mistakes"
  | "review"
  | "tutor"
  | "analytics"
  | "children"
  | "classes"
  | "assignments"
  | "admin"
  | "system";

export interface NavItem {
  key: NavKey;
  href: string;
  icon: ReactNode;
  /** Счётчик из API рядом с пунктом (только у ученика) */
  counter?: "mistakes" | "review";
}

const item = (key: NavKey, href: string, icon: ReactNode, counter?: NavItem["counter"]): NavItem => ({
  key,
  href,
  icon,
  counter,
});

/** Меню кабинета для каждого вида */
export const ROLE_NAV: Record<ViewRole, NavItem[]> = {
  student: [
    item("home", "/", <LuHouse />),
    item("cabinet", "/dashboard/kabinet", <LuLayoutGrid />),
    item("tests", "/dashboard/tester", <LuFileText />),
    item("practice", "/dashboard/practice", <LuTarget />),
    item("subjects", "/dashboard/subjects", <LuBookOpen />),
    item("homework", "/dashboard/homework", <LuClipboardList />),
    item("olympiads", "/dashboard/olympiads", <LuTrophy />),
    item("mistakes", "/dashboard/wrongs", <LuTriangleAlert />, "mistakes"),
    item("review", "/dashboard/smart", <LuRotateCw />, "review"),
    item("tutor", "/dashboard/aiteacher", <LuSparkles />),
    item("analytics", "/dashboard/analytics", <LuChartNoAxesColumn />),
  ],
  parent: [
    item("home", "/", <LuHouse />),
    item("children", "/dashboard/parent", <LuUsers />),
    item("olympiads", "/dashboard/olympiads", <LuTrophy />),
    item("subjects", "/dashboard/subjects", <LuBookOpen />),
  ],
  teacher: [
    item("home", "/", <LuHouse />),
    item("classes", "/dashboard/teacher", <LuUsers />),
    item("assignments", "/dashboard/teacher/homework", <LuClipboardList />),
    item("olympiads", "/dashboard/olympiads", <LuTrophy />),
    item("subjects", "/dashboard/subjects", <LuBookOpen />),
  ],
  admin: [
    item("home", "/", <LuHouse />),
    item("admin", "/dashboard/admin", <LuShieldCheck />),
    item("subjects", "/dashboard/subjects", <LuBookOpen />),
    item("olympiads", "/dashboard/olympiads", <LuTrophy />),
    item("system", "/dashboard/system", <LuServer />),
  ],
  sysadmin: [
    item("home", "/", <LuHouse />),
    item("system", "/dashboard/system", <LuServer />),
  ],
};

/** Стартовая страница кабинета для вида */
export const ROLE_HOME: Record<ViewRole, string> = {
  student: "/dashboard/kabinet",
  parent: "/dashboard/parent",
  teacher: "/dashboard/teacher",
  admin: "/dashboard/admin",
  sysadmin: "/dashboard/system",
};
