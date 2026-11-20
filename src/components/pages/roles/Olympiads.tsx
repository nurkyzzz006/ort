"use client";
import { useState } from "react";
import { LuBell, LuCalendar, LuCheck, LuMapPin, LuTrophy, LuUsers, LuWifi } from "react-icons/lu";
import Badge, { type BadgeTone } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import Segmented from "@/components/ui/Segmented";
import StatCard from "@/components/ui/StatCard";
import { Empty } from "@/components/ui/StateView";
import DemoNotice, { useL } from "@/demo/DemoNotice";
import { olympiads, type OlympiadLevel, type OlympiadStatus } from "@/demo/data";
import { useT } from "@/i18n";
import { formatDate, formatNumber } from "@/i18n/format";
import { useViewRole } from "@/roles/ViewRoleProvider";
import { useSettings } from "@/settings/SettingsProvider";
import layout from "../sidebar/layout.module.scss";
import scss from "./roles.module.scss";

const LEVEL_TONE: Record<OlympiadLevel, BadgeTone> = {
  school: "neutral",
  district: "info",
  republic: "primary",
  international: "warning",
};

const STATUS_TONE: Record<OlympiadStatus, BadgeTone> = {
  open: "success",
  upcoming: "info",
  finished: "neutral",
};

type Filter = "all" | OlympiadStatus;

/** Олимпиадалар (ДЕМО: API олимпиад на бэкенде ещё нет) */
const Olympiads = () => {
  const t = useT();
  const l = useL();
  const { locale } = useSettings();
  const { role } = useViewRole();
  const [filter, setFilter] = useState<Filter>("all");
  // Регистрация — локальное состояние демо, до появления POST /olympiads/{id}/register
  const [registered, setRegistered] = useState<string[]>([]);
  const [reminders, setReminders] = useState<string[]>([]);

  const list = olympiads.filter((o) => filter === "all" || o.status === filter);
  const finished = olympiads.filter((o) => o.myResult);
  const canRegister = role === "student";

  const toggle = (setter: typeof setRegistered, id: string) =>
    setter((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

  return (
    <>
      <PageHeader title={t.olympiads.title} subtitle={t.olympiads.subtitle} />
      <DemoNotice endpoints="GET /olympiads · POST /olympiads/{id}/register" />

      <div className={layout.stats}>
        <StatCard icon={<LuTrophy />} label={t.olympiads.open} value={olympiads.filter((o) => o.status === "open").length} />
        <StatCard icon={<LuCalendar />} tone="info" label={t.olympiads.upcoming} value={olympiads.filter((o) => o.status === "upcoming").length} />
        <StatCard icon={<LuCheck />} tone="success" label={t.olympiads.myRegistrations} value={registered.length} />
        <StatCard
          icon={<LuTrophy />}
          tone="warning"
          label={t.olympiads.bestPlace}
          value={finished.length ? Math.min(...finished.map((o) => o.myResult?.place ?? 99)) : "—"}
        />
      </div>

      <div className={scss.toolbar}>
        <Segmented
          ariaLabel={t.olympiads.filter}
          value={filter}
          onChange={setFilter}
          options={(["all", "open", "upcoming", "finished"] as Filter[]).map((f) => ({
            value: f,
            label: f === "all" ? t.tests.kinds.all : t.olympiads.status[f],
          }))}
        />
      </div>

      {list.length === 0 ? (
        <Empty icon={<LuTrophy />} title={t.olympiads.empty} />
      ) : (
        <ul className={scss.grid3}>
          {list.map((o) => {
            const isRegistered = registered.includes(o.id);
            return (
              <li key={o.id} className={scss.tile}>
                <div className={scss.tileTop}>
                  <Badge tone={LEVEL_TONE[o.level]}>{t.olympiads.level[o.level]}</Badge>
                  <Badge tone={STATUS_TONE[o.status]}>{t.olympiads.status[o.status]}</Badge>
                </div>
                <h3>{l(o.title)}</h3>
                <p className={scss.muted}>{l(o.subject)}</p>
                <p className={scss.meta}>
                  <span>
                    <LuCalendar aria-hidden /> {formatDate(o.date, locale)}
                  </span>
                  <span>
                    {o.format === "online" ? <LuWifi aria-hidden /> : <LuMapPin aria-hidden />}{" "}
                    {t.olympiads.format[o.format]}
                  </span>
                  {o.participants > 0 && (
                    <span>
                      <LuUsers aria-hidden /> {formatNumber(o.participants, locale)}
                    </span>
                  )}
                </p>

                {o.status === "open" && (
                  <p className={scss.muted}>
                    {t.olympiads.registrationUntil}: {formatDate(o.registrationUntil, locale)}
                  </p>
                )}

                {o.myResult ? (
                  <p className={scss.strong}>
                    {t.olympiads.result(o.myResult.place, o.myResult.score, o.myResult.max)}
                  </p>
                ) : o.status === "open" && canRegister ? (
                  <Button
                    fullWidth
                    variant={isRegistered ? "secondary" : "primary"}
                    icon={isRegistered ? <LuCheck /> : undefined}
                    onClick={() => toggle(setRegistered, o.id)}
                  >
                    {isRegistered ? t.olympiads.registered : t.olympiads.register}
                  </Button>
                ) : o.status === "upcoming" ? (
                  <Button
                    fullWidth
                    variant="secondary"
                    icon={<LuBell />}
                    aria-pressed={reminders.includes(o.id)}
                    onClick={() => toggle(setReminders, o.id)}
                  >
                    {reminders.includes(o.id) ? t.olympiads.reminderOn : t.olympiads.remind}
                  </Button>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default Olympiads;
