"use client";
import Link from "next/link";
import {
  LuArrowRight,
  LuChartNoAxesColumn,
  LuCheck,
  LuCircleCheck,
  LuFileText,
  LuFlame,
  LuPlay,
  LuRotateCw,
  LuTarget,
} from "react-icons/lu";
import {
  getErrorMessage,
  useGetSessions,
  useGetStatsOverview,
  useGetTodayPlan,
  useGetGoal,
  useRebuildPlan,
  useSession,
  useUpdatePlanItem,
  type PlanItem,
} from "@/api";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import { ProgressBar } from "@/components/ui/Progress";
import StatCard from "@/components/ui/StatCard";
import { Empty, ErrorState, Skeleton } from "@/components/ui/StateView";
import { pickTitle, useT } from "@/i18n";
import { formatDate, formatNumber, formatPercent, toRatio } from "@/i18n/format";
import { useSettings } from "@/settings/SettingsProvider";
import { useOpenPractice } from "./actions";
import layout from "./layout.module.scss";
import scss from "./Kabinet.module.scss";
import PredictionCard from "./widgets/PredictionCard";
import SkillsCard from "./widgets/SkillsCard";
import TrajectoryCard from "./widgets/TrajectoryCard";
import WeakSkillCard from "./widgets/WeakSkillCard";

const KIND_ICON = {
  practice: <LuTarget />,
  review: <LuRotateCw />,
  mock: <LuFileText />,
} as const;

/** Кабинет ученика (макет: стр. 2) */
const Kabinet = () => {
  const t = useT();
  const { locale } = useSettings();
  const { user } = useSession();
  const overview = useGetStatsOverview();
  const today = useGetTodayPlan();
  const goal = useGetGoal({ retry: false });
  const sessions = useGetSessions({ limit: 5 });

  const inProgress = sessions.data?.find((s) => !s.submitted_at);
  const lastFinished = sessions.data?.find((s) => s.submitted_at);

  const subtitle = [
    today.data ? t.cabinet.tasksToday(today.data.total - today.data.done) : null,
    goal.data ? t.topbar.daysLeft(goal.data.days_left) : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const o = overview.data;

  return (
    <>
      <PageHeader
        title={t.cabinet.greeting(user?.display_name)}
        subtitle={subtitle || t.cabinet.subtitle}
        actions={
          <>
            <Button href="/dashboard/analytics" variant="secondary" icon={<LuChartNoAxesColumn />}>
              {t.cabinet.fullAnalytics}
            </Button>
            <Button
              href={inProgress ? `/dashboard/tester/${inProgress.id}` : "/dashboard/tester"}
              icon={<LuPlay />}
            >
              {inProgress ? t.cabinet.continueTest : t.cabinet.startTest}
            </Button>
          </>
        }
      />

      <div className={layout.stats}>
        <StatCard
          icon={<LuFlame />}
          tone="warning"
          label={t.stats.streak}
          value={o ? t.common.days(o.streak) : "—"}
          hint={o ? t.stats.longestStreak(o.longest_streak) : undefined}
          loading={overview.isPending}
        />
        <StatCard
          icon={<LuCheck />}
          tone="success"
          label={t.stats.solved}
          value={o ? formatNumber(o.solved, locale) : "—"}
          hint={o ? t.stats.inDays(o.period_days) : undefined}
          loading={overview.isPending}
        />
        <StatCard
          icon={<LuTarget />}
          tone="info"
          label={t.stats.accuracy}
          value={formatPercent(toRatio(o?.accuracy))}
          hint={o && o.accuracy === null ? t.stats.noAnswersYet : undefined}
          loading={overview.isPending}
        />
        <StatCard
          icon={<LuRotateCw />}
          tone="danger"
          label={t.stats.reviewToday}
          value={o ? t.common.cards(o.due_cards) : "—"}
          hint={<Link href="/dashboard/smart">{t.stats.goReview}</Link>}
          loading={overview.isPending}
        />
      </div>

      <div className={layout.columns}>
        <div className={layout.stack}>
          <TodayPlanCard />
          <TrajectoryCard />
          <SkillsCard limit={5} />
        </div>

        <div className={layout.stack}>
          <PredictionCard />

          <Card
            title={t.cabinet.lastTest}
            action={
              lastFinished?.scaled_score != null ? (
                <Badge tone="success">{t.common.points}</Badge>
              ) : undefined
            }
          >
            {sessions.isPending ? (
              <Skeleton height={90} />
            ) : sessions.isError ? (
              <ErrorState error={sessions.error} onRetry={() => sessions.refetch()} />
            ) : lastFinished ? (
              <div className={scss.lastTest}>
                <div className={scss.lastHead}>
                  <div>
                    <p className={scss.lastTitle}>{pickTitle(lastFinished, locale)}</p>
                    <p className={layout.muted}>{formatDate(lastFinished.submitted_at, locale)}</p>
                  </div>
                  <p className={scss.score}>
                    {lastFinished.raw_score ?? "—"}
                    <span>/{lastFinished.max_score ?? "—"}</span>
                  </p>
                </div>
                {lastFinished.raw_score != null && lastFinished.max_score ? (
                  <ProgressBar value={lastFinished.raw_score / lastFinished.max_score} />
                ) : null}
                {lastFinished.scaled_score != null && (
                  <p className={layout.muted}>
                    {t.result.scaled}: <strong>{Math.round(lastFinished.scaled_score)}</strong>{" "}
                    <span className={layout.estimated}>({t.common.estimated})</span>
                  </p>
                )}
                <Button
                  href={`/dashboard/tester/${lastFinished.id}/result`}
                  variant="soft"
                  fullWidth
                  iconRight={<LuArrowRight />}
                >
                  {t.cabinet.analyzeMistakes}
                </Button>
              </div>
            ) : (
              <Empty
                icon={<LuFileText />}
                title={t.cabinet.noTestsTitle}
                text={t.cabinet.noTestsText}
                action={
                  <Button href="/dashboard/tester" size="sm">
                    {t.cabinet.chooseTest}
                  </Button>
                }
              />
            )}
          </Card>

          <WeakSkillCard />
        </div>
      </div>
    </>
  );
};

/** «Бүгүнкү план» — задачи на сегодня с отметкой выполнения (ТЗ 4.9) */
const TodayPlanCard = () => {
  const t = useT();
  const { locale } = useSettings();
  const today = useGetTodayPlan();
  const updateItem = useUpdatePlanItem();
  const rebuild = useRebuildPlan();
  const practice = useOpenPractice();

  const toggle = (item: PlanItem) =>
    updateItem.mutate({
      itemId: item.id,
      data: { status: item.status === "done" ? "pending" : "done" },
    });

  const open = (item: PlanItem) => {
    if (item.kind === "practice")
      practice.open({ skillId: item.skill_id, planItemId: item.id });
  };

  const content = () => {
    if (today.isPending)
      return (
        <div className={scss.planList}>
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} height={68} />
          ))}
        </div>
      );
    if (today.isError) return <ErrorState error={today.error} onRetry={() => today.refetch()} />;

    // null — плана нет, пока не поставлена цель: объясняем, а не показываем ошибку
    if (today.data === null)
      return (
        <Empty
          icon={<LuTarget />}
          title={t.plan.noPlanTitle}
          text={t.plan.noPlanText}
          action={
            <Button href="/dashboard/settings#goal" size="sm">
              {t.plan.setGoal}
            </Button>
          }
        />
      );

    if (today.data.items.length === 0)
      return <Empty icon={<LuCircleCheck />} title={t.plan.emptyToday} />;

    return (
      <ul className={scss.planList}>
        {today.data.items.map((item) => {
          const done = item.status === "done";
          const title = item.skill_id
            ? pickTitle({ title_ky: item.skill_title_ky ?? "", title_ru: item.skill_title_ru ?? "" }, locale)
            : "";
          return (
            <li key={item.id} className={[scss.planItem, done ? scss.done : ""].join(" ")}>
              <span className={[scss.kindIcon, scss[item.kind]].join(" ")} aria-hidden>
                {KIND_ICON[item.kind]}
              </span>
              <div className={scss.planText}>
                {item.kind === "practice" ? (
                  <button type="button" className={scss.planTitle} onClick={() => open(item)}>
                    {t.plan.kind[item.kind]}
                    {title && ` · ${title}`}
                  </button>
                ) : (
                  <Link
                    className={scss.planTitle}
                    href={item.kind === "review" ? "/dashboard/smart" : "/dashboard/tester?kind=mock"}
                  >
                    {t.plan.kind[item.kind]}
                    {title && ` · ${title}`}
                  </Link>
                )}
                <p className={layout.muted}>
                  {t.common.minutes(item.minutes)}
                  {item.expected_gain > 0 && ` · ${t.plan.gain(Math.round(item.expected_gain * 10) / 10)}`}
                  {item.status === "skipped" && ` · ${t.plan.skipped}`}
                </p>
              </div>
              <button
                type="button"
                className={scss.check}
                aria-pressed={done}
                aria-label={done ? t.plan.markUndone : t.plan.markDone}
                disabled={updateItem.isPending && updateItem.variables?.itemId === item.id}
                onClick={() => toggle(item)}
              >
                {done && <LuCheck />}
              </button>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <Card
      title={t.plan.today}
      badge={
        today.data ? (
          <Badge tone="primary">
            {today.data.done} / {today.data.total}
          </Badge>
        ) : undefined
      }
      action={
        today.data ? (
          <button
            type="button"
            className={layout.link}
            onClick={() => rebuild.mutate()}
            disabled={rebuild.isPending}
          >
            {rebuild.isPending ? t.common.loading : t.plan.rebuild}
          </button>
        ) : undefined
      }
    >
      {content()}
      {(updateItem.isError || rebuild.isError || practice.mutation.isError) && (
        <p className={scss.error} role="alert">
          {getErrorMessage(updateItem.error ?? rebuild.error ?? practice.mutation.error, t.errors)}
        </p>
      )}
    </Card>
  );
};

export default Kabinet;
