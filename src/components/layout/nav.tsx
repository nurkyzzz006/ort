import type { ReactNode } from "react";
import {
  LuBookOpen,
  LuChartNoAxesColumn,
  LuClipboardList,
  LuFileText,
  LuHouse,
  LuLayoutGrid,
  LuRotateCw,
  LuShieldCheck,
  LuSparkles,
  LuTarget,
  LuTriangleAlert,
  LuTrophy,
} from "react-icons/lu";
import type { Dictionary } from "@/i18n";

export type NavKey = keyof Dictionary["nav"]["items"];

export interface NavItem {
  key: NavKey;
  href: string;
  icon: ReactNode;
  /** Счётчик из API рядом с пунктом */
  counter?: "mistakes" | "review";
}

/** Меню кабинета ученика (раздел «Окуу») */
export const DASHBOARD_NAV: NavItem[] = [
  { key: "home", href: "/", icon: <LuHouse /> },
  { key: "cabinet", href: "/dashboard/kabinet", icon: <LuLayoutGrid /> },
  { key: "tests", href: "/dashboard/tester", icon: <LuFileText /> },
  { key: "practice", href: "/dashboard/practice", icon: <LuTarget /> },
  { key: "subjects", href: "/dashboard/subjects", icon: <LuBookOpen /> },
  { key: "homework", href: "/dashboard/homework", icon: <LuClipboardList /> },
  { key: "olympiads", href: "/dashboard/olympiads", icon: <LuTrophy /> },
  { key: "mistakes", href: "/dashboard/wrongs", icon: <LuTriangleAlert />, counter: "mistakes" },
  { key: "review", href: "/dashboard/smart", icon: <LuRotateCw />, counter: "review" },
  { key: "tutor", href: "/dashboard/aiteacher", icon: <LuSparkles /> },
  { key: "analytics", href: "/dashboard/analytics", icon: <LuChartNoAxesColumn /> },
];

/** Админ-панель — только для ролей бэкенда admin / editor / expert (ТЗ 9.4) */
export const ADMIN_NAV_ITEM: NavItem = { key: "admin", href: "/dashboard/admin", icon: <LuShieldCheck /> };
export const ADMIN_ROLES = ["admin", "editor", "expert"] as const;

/** Якоря лендинга */
export const LANDING_NAV = [
  { key: "how", href: "/#how" },
  { key: "tests", href: "/#features" },
  { key: "practice", href: "/#features" },
  { key: "analytics", href: "/#features" },
] as const;
