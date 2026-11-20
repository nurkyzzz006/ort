"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/api";
import PageHeader from "@/components/ui/PageHeader";
import Segmented from "@/components/ui/Segmented";
import { useT } from "@/i18n";
import CatalogTab from "./CatalogTab";
import ContentTab from "./ContentTab";
import FormatsTab from "./FormatsTab";
import Overview from "./Overview";
import QuestionsTab from "./QuestionsTab";
import ReportsTab from "./ReportsTab";
import TestsTab from "./TestsTab";
import UsersTab from "./UsersTab";
import roles from "../roles/roles.module.scss";

export type AdminTab = "overview" | "questions" | "catalog" | "tests" | "formats" | "users" | "reports" | "content";

/** Вкладки по ролям (ТЗ 2): редактор и эксперт работают с контентом, админ — со всем */
const CONTENT_TABS: AdminTab[] = ["overview", "questions", "catalog", "reports", "content"];
const ADMIN_TABS: AdminTab[] = ["overview", "questions", "catalog", "tests", "formats", "users", "reports", "content"];

const isTab = (v: string | null, tabs: AdminTab[]): v is AdminTab => !!v && (tabs as string[]).includes(v);

/** Админ-панель на реальном admin-API (36 endpoint-ов) */
const AdminPanel = () => {
  const t = useT();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { hasRole } = useSession();

  const tabs = hasRole("admin") ? ADMIN_TABS : CONTENT_TABS;
  const raw = params.get("tab");
  const tab: AdminTab = isTab(raw, tabs) ? raw : "overview";

  // Вкладка — в URL: ссылки и «Назад» работают
  const go = (next: AdminTab) =>
    router.replace(next === "overview" ? pathname : `${pathname}?tab=${next}`, { scroll: false });

  return (
    <>
      <PageHeader title={t.admin.title} subtitle={t.admin.subtitle} />
      <div className={roles.toolbar}>
        <Segmented
          ariaLabel={t.adm.tabsLabel}
          value={tab}
          onChange={go}
          options={tabs.map((v) => ({ value: v, label: t.adm.tabs[v] }))}
        />
      </div>

      {tab === "overview" && <Overview onOpen={go} />}
      {tab === "questions" && <QuestionsTab />}
      {tab === "catalog" && <CatalogTab />}
      {tab === "tests" && <TestsTab />}
      {tab === "formats" && <FormatsTab />}
      {tab === "users" && <UsersTab />}
      {tab === "reports" && <ReportsTab />}
      {tab === "content" && <ContentTab />}
    </>
  );
};

export default AdminPanel;
