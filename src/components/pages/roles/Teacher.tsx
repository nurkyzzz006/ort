"use client";
import { useMemo, useState } from "react";
import { LuClipboardList, LuTarget, LuTrendingUp, LuTriangleAlert, LuUsers } from "react-icons/lu";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import { ProgressBar } from "@/components/ui/Progress";
import Segmented from "@/components/ui/Segmented";
import StatCard from "@/components/ui/StatCard";
import DemoNotice, { useL } from "@/demo/DemoNotice";
import { classes, students, type PlanStatus } from "@/demo/data";
import { useT } from "@/i18n";
import { formatDate } from "@/i18n/format";
import { useSettings } from "@/settings/SettingsProvider";
import layout from "../sidebar/layout.module.scss";
import { PLAN_TONE } from "./Parent";
import scss from "./roles.module.scss";

type Sort = "score" | "risk";

/** Сначала отстающие */
const RISK_RANK: Record<PlanStatus, number> = { behind: 0, on_track: 1, ahead: 2 };

/** Кабинет учителя: классы и прогресс учеников (ДЕМО: API для учителей ещё нет) */
const Teacher = () => {
  const t = useT();
  const l = useL();
  const { locale } = useSettings();
  const [classId, setClassId] = useState(classes[0].id);
  const [sort, setSort] = useState<Sort>("risk");
  const cls = classes.find((c) => c.id === classId) ?? classes[0];

  const list = useMemo(
    () =>
      students
        .filter((s) => s.classId === classId)
        .sort((a, b) => (sort === "score" ? b.score - a.score : RISK_RANK[a.status] - RISK_RANK[b.status] || a.score - b.score)),
    [classId, sort],
  );
  const atRisk = list.filter((s) => s.status === "behind");

  return (
    <>
      <PageHeader
        title={t.teacher.title}
        subtitle={t.teacher.subtitle}
        actions={
          <Button href="/dashboard/teacher/homework" icon={<LuClipboardList />}>
            {t.teacher.giveHomework}
          </Button>
        }
      />
      <DemoNotice endpoints="GET /teacher/classes · GET /teacher/classes/{id}/students" />

      <ul className={`${scss.grid3} ${scss.mb}`}>
        {classes.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              className={[scss.tileButton, c.id === classId ? scss.tileActive : ""].join(" ")}
              aria-pressed={c.id === classId}
              onClick={() => setClassId(c.id)}
            >
              <div className={scss.tileTop}>
                <h3>{c.name}</h3>
                <Badge tone="neutral">{l(c.subject)}</Badge>
              </div>
              <p className={scss.meta}>
                <span>
                  <LuUsers aria-hidden /> {t.teacher.students(c.students)}
                </span>
                <span>
                  <LuTrendingUp aria-hidden /> ≈ {c.avgScore}
                </span>
                {c.behind > 0 && (
                  <span className={scss.down}>
                    <LuTriangleAlert aria-hidden /> {t.teacher.behind(c.behind)}
                  </span>
                )}
              </p>
            </button>
          </li>
        ))}
      </ul>

      <div className={layout.stats}>
        <StatCard icon={<LuUsers />} label={t.teacher.studentsLabel} value={cls.students} />
        <StatCard icon={<LuTrendingUp />} tone="info" label={t.teacher.avgScore} value={`≈ ${cls.avgScore}`} hint={t.common.estimated} />
        <StatCard icon={<LuTarget />} tone="success" label={t.stats.accuracy} value={`${Math.round(cls.avgAccuracy * 100)}%`} />
        <StatCard icon={<LuClipboardList />} tone="warning" label={t.teacher.activeHomework} value={cls.activeHomework} />
      </div>

      <div className={layout.columns}>
        <Card
          title={`${t.teacher.studentsLabel} · ${cls.name}`}
          padding="none"
          action={
            <Segmented
              variant="switch"
              ariaLabel={t.teacher.sort}
              value={sort}
              onChange={setSort}
              options={[
                { value: "risk", label: t.teacher.sortRisk },
                { value: "score", label: t.teacher.sortScore },
              ]}
            />
          }
        >
          <div className={scss.tableWrap}>
            <table className={scss.table}>
              <thead>
                <tr>
                  <th>{t.teacher.student}</th>
                  <th>{t.result.scaled}</th>
                  <th>{t.stats.accuracy}</th>
                  <th>{t.teacher.homeworkCol}</th>
                  <th>{t.mistakes.columns.status}</th>
                </tr>
              </thead>
              <tbody>
                {list.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className={scss.person}>
                        <span className={scss.avatar} aria-hidden>
                          {s.name[0]}
                        </span>
                        <div>
                          <strong>{s.name}</strong>
                          <small>{formatDate(s.lastActive, locale)}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={scss.strong}>≈ {s.score}</span>{" "}
                      <span className={s.delta >= 0 ? scss.up : scss.down}>
                        {s.delta >= 0 ? "+" : ""}
                        {s.delta}
                      </span>
                    </td>
                    <td>{Math.round(s.accuracy * 100)}%</td>
                    <td>
                      {s.homeworkDone}/{s.homeworkTotal}
                      <ProgressBar value={s.homeworkDone / s.homeworkTotal} size="sm" />
                    </td>
                    <td>
                      <Badge tone={PLAN_TONE[s.status]}>{t.parent.planStatus[s.status]}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className={layout.stack}>
          <Card title={t.teacher.atRisk} tone={atRisk.length ? "warning" : "default"}>
            {atRisk.length === 0 ? (
              <p className={scss.muted}>{t.teacher.noRisk}</p>
            ) : (
              <ul className={scss.list}>
                {atRisk.map((s) => (
                  <li key={s.id}>
                    <span className={scss.avatar} aria-hidden>
                      {s.name[0]}
                    </span>
                    <div className={scss.grow}>
                      <strong>{s.name}</strong>
                      <span>
                        {Math.round(s.accuracy * 100)}% · {t.teacher.homeworkShort(s.homeworkDone, s.homeworkTotal)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <p className={scss.muted}>{t.teacher.riskNote}</p>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Teacher;
