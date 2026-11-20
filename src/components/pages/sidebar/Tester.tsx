"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LuClock, LuFileText, LuPlay } from "react-icons/lu";
import {
  getErrorMessage,
  useGetSessions,
  useGetSubjects,
  useGetTests,
  type SessionListItem,
  type TestKind,
} from "@/api";
import Badge, { type BadgeTone } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import Segmented from "@/components/ui/Segmented";
import { Empty, ErrorState, Skeleton } from "@/components/ui/StateView";
import { pickTitle, useT } from "@/i18n";
import { formatClock, formatDate, toMinutes } from "@/i18n/format";
import { useSettings } from "@/settings/SettingsProvider";
import { useOpenTest } from "./actions";
import layout from "./layout.module.scss";
import scss from "./Tester.module.scss";

type KindFilter = "all" | TestKind;
const KINDS: KindFilter[] = ["all", "mock", "section", "diagnostic", "mini", "subject"];
const isKind = (v: string | null): v is TestKind =>
  v === "mock" || v === "section" || v === "diagnostic" || v === "mini" || v === "subject";

export const KIND_TONE: Record<TestKind, BadgeTone> = {
  mock: "primary",
  section: "info",
  diagnostic: "success",
  mini: "primary",
  subject: "warning",
};

/** Каталог тестов + история сессий (макет: стр. 3) */
const Tester = () => {
  const t = useT();
  const { locale } = useSettings();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const kindParam = params.get("kind");
  const kind: KindFilter = isKind(kindParam) ? kindParam : "all";

  const setKind = (next: KindFilter) => {
    const query = new URLSearchParams(params.toString());
    if (next === "all") query.delete("kind");
    else query.set("kind", next);
    router.replace(`${pathname}${query.size ? `?${query}` : ""}`, { scroll: false });
  };

  // Тесты на языке интерфейса (контент двуязычный: ky / ru)
  const tests = useGetTests({ kind: kind === "all" ? null : kind, language: locale });
  const subjects = useGetSubjects();
  const subjectName = (id: string | null) => {
    const s = subjects.data?.find((x) => x.id === id);
    return s ? pickTitle(s, locale) : null;
  };
  const openTest = useOpenTest();

  return (
    <>
      <PageHeader title={t.tests.title} subtitle={t.tests.subtitle} />

      <div className={scss.filters}>
        <Segmented
          ariaLabel={t.tests.filterLabel}
          value={kind}
          onChange={setKind}
          options={KINDS.map((k) => ({ value: k, label: t.tests.kinds[k] }))}
        />
      </div>

      {openTest.mutation.isError && (
        <p className={scss.error} role="alert">
          {getErrorMessage(openTest.mutation.error, t.errors)}
        </p>
      )}

      {tests.isPending ? (
        <div className={scss.grid}>
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} height={210} />
          ))}
        </div>
      ) : tests.isError ? (
        <Card>
          <ErrorState error={tests.error} onRetry={() => tests.refetch()} />
        </Card>
      ) : tests.data.length === 0 ? (
        <Card>
          <Empty icon={<LuFileText />} title={t.tests.emptyTitle} text={t.tests.emptyText} />
        </Card>
      ) : (
        <ul className={scss.grid}>
          {tests.data.map((test) => {
            const starting = openTest.mutation.isPending && openTest.mutation.variables?.testId === test.id;
            return (
              <li key={test.id} className={scss.card}>
                <div className={scss.cardTop}>
                  <Badge tone={KIND_TONE[test.kind]}>{t.tests.kinds[test.kind]}</Badge>
                  {test.scale_kind === "estimated" && (
                    <span className={layout.estimated}>{t.common.estimated}</span>
                  )}
                </div>
                <h3>{pickTitle(test, locale)}</h3>
                <p className={layout.muted}>{subjectName(test.subject_id) ?? t.tests.mainExam}</p>
                <p className={scss.meta}>
                  <span>
                    <LuClock aria-hidden /> {t.common.minutes(toMinutes(test.time_limit_sec))}
                  </span>
                  <span>
                    <LuFileText aria-hidden /> {t.common.questions(test.question_count)}
                  </span>
                  {test.sections.length > 1 && <span>{t.tests.sections(test.sections.length)}</span>}
                </p>
                <Button
                  variant="secondary"
                  fullWidth
                  icon={<LuPlay />}
                  loading={starting}
                  disabled={openTest.mutation.isPending}
                  onClick={() => openTest.open(test.id)}
                >
                  {t.tests.start}
                </Button>
              </li>
            );
          })}
        </ul>
      )}

      <SessionsTable />
    </>
  );
};

/** «Менин сессияларым» */
const SessionsTable = () => {
  const t = useT();
  const { locale } = useSettings();
  const sessions = useGetSessions({ limit: 20 });

  const status = (s: SessionListItem) =>
    s.submitted_at ? (
      <Badge tone="success">{t.tests.status.finished}</Badge>
    ) : (
      <Badge tone="warning">{t.tests.status.inProgress}</Badge>
    );

  const duration = (s: SessionListItem) =>
    s.submitted_at
      ? formatClock((new Date(s.submitted_at).getTime() - new Date(s.started_at).getTime()) / 1000)
      : "—";

  return (
    <Card title={t.tests.mySessions} padding="none" className={scss.sessions}>
      {sessions.isPending ? (
        <div className={scss.tablePad}>
          <Skeleton height={120} />
        </div>
      ) : sessions.isError ? (
        <ErrorState error={sessions.error} onRetry={() => sessions.refetch()} />
      ) : sessions.data.length === 0 ? (
        <Empty title={t.tests.noSessions} />
      ) : (
        <div className={scss.tableWrap}>
          <table className={scss.table}>
            <thead>
              <tr>
                <th>{t.tests.columns.test}</th>
                <th>{t.tests.columns.date}</th>
                <th>{t.tests.columns.result}</th>
                <th>{t.tests.columns.time}</th>
                <th>{t.tests.columns.status}</th>
                <th>
                  <span className="sr-only">{t.tests.columns.action}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sessions.data.map((s) => (
                <tr key={s.id}>
                  <td className={scss.testName}>{pickTitle(s, locale)}</td>
                  <td>{formatDate(s.started_at, locale)}</td>
                  <td>
                    {s.raw_score != null ? `${s.raw_score} / ${s.max_score ?? "—"}` : "—"}
                    {s.scaled_score != null && (
                      <span className={scss.scaled}>
                        ≈ {Math.round(s.scaled_score)} {t.common.points}
                      </span>
                    )}
                  </td>
                  <td>{duration(s)}</td>
                  <td>{status(s)}</td>
                  <td>
                    <Link
                      className={layout.link}
                      href={s.submitted_at ? `/dashboard/tester/${s.id}/result` : `/dashboard/tester/${s.id}`}
                    >
                      {s.submitted_at ? t.tests.analyze : t.tests.continue}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default Tester;
