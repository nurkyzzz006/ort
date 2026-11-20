"use client";
import { LuBookOpen, LuFlag, LuTriangleAlert, LuUsers } from "react-icons/lu";
import { useGetAdminQuestions, useGetAdminUsers, useGetQuestionReports, useSession } from "@/api";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import { Skeleton } from "@/components/ui/StateView";
import { useT } from "@/i18n";
import roles from "../roles/roles.module.scss";
import layout from "../sidebar/layout.module.scss";
import type { AdminTab } from "./AdminPanel";
import { QUESTION_STATUSES } from "./shared";
import scss from "./admin.module.scss";

/** Колонка канбана: число вопросов в статусе (total) и первые 3 */
const FlowColumn = ({ status }: { status: (typeof QUESTION_STATUSES)[number] }) => {
  const t = useT();
  const q = useGetAdminQuestions({ status, limit: 3 });
  return (
    <section className={roles.column}>
      <header>
        <span>{t.adm.status[status]}</span>
        <span>{q.data?.total ?? "…"}</span>
      </header>
      {q.isPending ? (
        <Skeleton height={44} />
      ) : (
        q.data?.items.map((it) => (
          <div key={it.id} className={roles.kanbanCard}>
            {it.code} · v{it.version}
            <small>
              {it.language.toUpperCase()} · {it.stem.slice(0, 40)}
            </small>
          </div>
        ))
      )}
    </section>
  );
};

/** Обзор: реальные счётчики и поток контента (ТЗ 7.2) */
const Overview = ({ onOpen }: { onOpen: (tab: AdminTab) => void }) => {
  const t = useT();
  const { hasRole } = useSession();
  const isAdmin = hasRole("admin");

  const all = useGetAdminQuestions({ limit: 1 });
  const published = useGetAdminQuestions({ status: "published", limit: 1 });
  const editorial = useGetAdminQuestions({ status: "editorial_review", limit: 1 });
  const expert = useGetAdminQuestions({ status: "expert_review", limit: 1 });
  const users = useGetAdminUsers({ limit: 1 }, { enabled: isAdmin });
  const reports = useGetQuestionReports({ status: "open" });

  const inReview =
    editorial.data && expert.data ? editorial.data.total + expert.data.total : undefined;

  return (
    <div className={scss.stack}>
      <div className={layout.stats}>
        <StatCard
          icon={<LuBookOpen />}
          label={t.adminPanel.bank}
          value={all.data?.total ?? "—"}
          hint={published.data ? t.adminPanel.published(published.data.total) : undefined}
          loading={all.isPending}
        />
        <StatCard
          icon={<LuTriangleAlert />}
          tone="warning"
          label={t.adminPanel.inReview}
          value={inReview ?? "—"}
          hint={
            editorial.data && expert.data
              ? `${t.adm.status.editorial_review}: ${editorial.data.total} · ${t.adm.status.expert_review}: ${expert.data.total}`
              : undefined
          }
          loading={editorial.isPending || expert.isPending}
        />
        <StatCard
          icon={<LuUsers />}
          tone="success"
          label={t.adminPanel.users}
          value={isAdmin ? (users.data?.total ?? "—") : "—"}
          hint={isAdmin ? undefined : t.adm.adminOnly}
          loading={isAdmin && users.isPending}
        />
        <StatCard
          icon={<LuFlag />}
          tone="danger"
          label={t.adm.openReports}
          value={reports.data?.length ?? "—"}
          hint={
            <button type="button" className={layout.link} onClick={() => onOpen("reports")}>
              {t.adm.toReports}
            </button>
          }
          loading={reports.isPending}
        />
      </div>

      <Card
        title={t.adminPanel.flow}
        action={
          <button type="button" className={layout.link} onClick={() => onOpen("questions")}>
            {t.adm.toQuestions}
          </button>
        }
      >
        <div className={roles.kanban}>
          {QUESTION_STATUSES.map((s) => (
            <FlowColumn key={s} status={s} />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Overview;
