"use client";
import { useState } from "react";
import { LuCalendar, LuCheck, LuClipboardList, LuClock, LuFileText, LuPlay, LuTriangleAlert } from "react-icons/lu";
import Badge, { type BadgeTone } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import Segmented from "@/components/ui/Segmented";
import StatCard from "@/components/ui/StatCard";
import { Empty } from "@/components/ui/StateView";
import DemoNotice, { useL } from "@/demo/DemoNotice";
import { studentHomework, type HomeworkStatus } from "@/demo/data";
import { useT } from "@/i18n";
import { formatDate } from "@/i18n/format";
import layout from "../sidebar/layout.module.scss";
import scss from "./roles.module.scss";

export const HOMEWORK_TONE: Record<HomeworkStatus, BadgeTone> = {
  pending: "primary",
  late: "danger",
  done: "success",
  review: "warning",
};

type Filter = "all" | "active" | "done";

/** Үй тапшырма — задания от учителя (ДЕМО: API для домашки ещё нет) */
const Homework = () => {
  const t = useT();
  const l = useL();
  const [filter, setFilter] = useState<Filter>("active");

  const list = studentHomework.filter((h) =>
    filter === "all" ? true : filter === "done" ? h.status === "done" || h.status === "review" : h.status === "pending" || h.status === "late",
  );
  const graded = studentHomework.filter((h) => h.score !== undefined && h.max);
  const avg = graded.length
    ? Math.round((graded.reduce((s, h) => s + (h.score ?? 0) / (h.max ?? 1), 0) / graded.length) * 100)
    : null;

  return (
    <>
      <PageHeader title={t.homework.title} subtitle={t.homework.subtitle} />
      <DemoNotice endpoints="GET /homework · POST /homework/{id}/submit" />

      <div className={layout.stats}>
        <StatCard icon={<LuClipboardList />} label={t.homework.active} value={studentHomework.filter((h) => h.status === "pending").length} />
        <StatCard icon={<LuTriangleAlert />} tone="danger" label={t.homework.late} value={studentHomework.filter((h) => h.status === "late").length} />
        <StatCard icon={<LuCheck />} tone="success" label={t.homework.done} value={studentHomework.filter((h) => h.status === "done" || h.status === "review").length} />
        <StatCard icon={<LuFileText />} tone="info" label={t.homework.avgScore} value={avg !== null ? `${avg}%` : "—"} />
      </div>

      <div className={scss.toolbar}>
        <Segmented
          ariaLabel={t.homework.filter}
          value={filter}
          onChange={setFilter}
          options={(["active", "done", "all"] as Filter[]).map((f) => ({ value: f, label: t.homework.filters[f] }))}
        />
      </div>

      {list.length === 0 ? (
        <Empty icon={<LuCheck />} title={t.homework.empty} />
      ) : (
        <ul className={scss.grid3}>
          {list.map((h) => (
            <li key={h.id} className={scss.tile}>
              <div className={scss.tileTop}>
                <Badge tone="neutral">{l(h.subject)}</Badge>
                <Badge tone={HOMEWORK_TONE[h.status]}>{t.homework.status[h.status]}</Badge>
              </div>
              <h3>{l(h.title)}</h3>
              <p className={scss.muted}>{t.homework.teacher}: {h.teacher}</p>
              <p className={scss.meta}>
                <span>
                  <LuCalendar aria-hidden /> {formatDate(h.due)}
                </span>
                <span>
                  <LuFileText aria-hidden /> {t.common.questions(h.questions)}
                </span>
                <span>
                  <LuClock aria-hidden /> {t.common.minutes(h.minutes)}
                </span>
              </p>
              {h.score !== undefined ? (
                <p className={scss.strong}>
                  {t.homework.result}: {h.score} / {h.max}
                </p>
              ) : (
                <Button href="/dashboard/practice" icon={<LuPlay />} fullWidth variant={h.status === "late" ? "primary" : "secondary"}>
                  {t.homework.start}
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Homework;
