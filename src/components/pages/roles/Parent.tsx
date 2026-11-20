"use client";
import { useState } from "react";
import { LuCalendar, LuClock, LuFlame, LuTarget, LuTrendingUp } from "react-icons/lu";
import Badge, { type BadgeTone } from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import LineChart from "@/components/ui/LineChart";
import PageHeader from "@/components/ui/PageHeader";
import { ProgressBar, toneByRatio } from "@/components/ui/Progress";
import Segmented from "@/components/ui/Segmented";
import StatCard from "@/components/ui/StatCard";
import DemoNotice, { useL } from "@/demo/DemoNotice";
import { children, type PlanStatus } from "@/demo/data";
import { useT } from "@/i18n";
import { formatDate } from "@/i18n/format";
import { useSettings } from "@/settings/SettingsProvider";
import layout from "../sidebar/layout.module.scss";
import { HOMEWORK_TONE } from "./Homework";
import scss from "./roles.module.scss";

export const PLAN_TONE: Record<PlanStatus, BadgeTone> = {
  ahead: "success",
  on_track: "primary",
  behind: "warning",
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

/**
 * Кабинет родителя (ТЗ 2: P2 — отдельная модель доступа и согласия).
 * ДЕМО: API для привязки детей и родительских отчётов ещё нет.
 */
const Parent = () => {
  const t = useT();
  const l = useL();
  const { locale } = useSettings();
  const [childId, setChildId] = useState(children[0].id);
  const c = children.find((x) => x.id === childId) ?? children[0];
  const growth = c.now - c.start;

  return (
    <>
      <PageHeader title={t.parent.title} subtitle={t.parent.subtitle} />
      <DemoNotice endpoints="GET /parent/children · GET /parent/children/{id}/report" />

      {children.length > 1 && (
        <div className={scss.toolbar}>
          <Segmented
            ariaLabel={t.parent.child}
            value={childId}
            onChange={setChildId}
            options={children.map((x) => ({ value: x.id, label: x.name.split(" ")[0] }))}
          />
        </div>
      )}

      <div className={scss.childHead}>
        <span className={scss.avatarLg} aria-hidden>
          {initials(c.name)}
        </span>
        <div>
          <h2>{c.name}</h2>
          <p className={scss.muted}>
            {l(c.grade)} · {t.parent.lastActive}: {formatDate(c.lastActive, locale)}
          </p>
        </div>
        <Badge tone={PLAN_TONE[c.status]}>{t.parent.planStatus[c.status]}</Badge>
      </div>

      <div className={layout.stats}>
        <StatCard
          icon={<LuTrendingUp />}
          label={t.parent.scoreNow}
          value={`≈ ${c.now}`}
          hint={`${t.trajectory.start} ${c.start} · ${growth >= 0 ? "+" : ""}${growth}`}
        />
        <StatCard icon={<LuTarget />} tone="info" label={t.goal.target} value={c.target} hint={formatDate(c.examDate, locale)} />
        <StatCard icon={<LuFlame />} tone="warning" label={t.stats.streak} value={t.common.days(c.streak)} />
        <StatCard
          icon={<LuClock />}
          tone="success"
          label={t.parent.weekTime}
          value={t.common.minutes(c.minutesWeek)}
          hint={t.parent.solvedWeek(c.solvedWeek)}
        />
      </div>

      <div className={layout.columns}>
        <div className={layout.stack}>
          <Card title={t.trajectory.title} action={<Badge tone="warning">{t.common.estimated}</Badge>}>
            <LineChart points={c.trajectory} target={c.target} ariaLabel={t.trajectory.title} />
            <p className={scss.muted}>{t.parent.trajectoryNote}</p>
          </Card>

          <Card title={t.parent.homework}>
            <ul className={scss.list}>
              {c.homework.map((h) => (
                <li key={l(h.title)}>
                  <LuCalendar aria-hidden />
                  <div className={scss.grow}>
                    <strong>{l(h.title)}</strong>
                    <span>
                      {t.parent.due}: {formatDate(h.due, locale)}
                      {h.score && ` · ${h.score}`}
                    </span>
                  </div>
                  <Badge tone={HOMEWORK_TONE[h.status]}>{t.homework.status[h.status]}</Badge>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className={layout.stack}>
          <Card title={t.parent.weekPlan}>
            <div className={layout.row}>
              <span>{t.review.planDone}</span>
              <strong>
                {c.planDone} / {c.planTotal}
              </strong>
            </div>
            <ProgressBar value={c.planDone / c.planTotal} tone={c.status === "behind" ? "warning" : "success"} />
            <div className={layout.row}>
              <span>{t.stats.accuracy}</span>
              <strong>{Math.round(c.accuracy * 100)}%</strong>
            </div>
          </Card>

          <Card title={t.parent.weakTopics} tone="warning">
            <ul className={scss.list}>
              {c.weak.map((w) => (
                <li key={l(w.title)}>
                  <div className={scss.grow}>
                    <strong>{l(w.title)}</strong>
                    <ProgressBar value={w.mastery} tone={toneByRatio(w.mastery)} size="sm" />
                  </div>
                  <strong>{Math.round(w.mastery * 100)}%</strong>
                </li>
              ))}
            </ul>
            <p className={scss.muted}>{t.parent.weakNote}</p>
          </Card>

          <Card title={t.parent.privacyTitle}>
            <p className={scss.muted}>{t.parent.privacyText}</p>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Parent;
