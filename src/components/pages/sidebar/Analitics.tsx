"use client";
import { useState } from "react";
import { LuCheck, LuClock, LuFlame, LuTarget, LuTrophy, LuTrendingUp } from "react-icons/lu";
import {
  getErrorMessage,
  useGetAchievements,
  useGetGoalProgress,
  useGetSkillsRoi,
  useGetStatsOverview,
} from "@/api";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import { ProgressBar } from "@/components/ui/Progress";
import Segmented from "@/components/ui/Segmented";
import StatCard from "@/components/ui/StatCard";
import { Empty, ErrorState, Skeleton } from "@/components/ui/StateView";
import { pickTitle, useT } from "@/i18n";
import { formatClock, formatDate, formatNumber, formatPercent, toRatio } from "@/i18n/format";
import { useSettings } from "@/settings/SettingsProvider";
import { useOpenPractice } from "./actions";
import layout from "./layout.module.scss";
import scss from "./Analitics.module.scss";
import PredictionCard from "./widgets/PredictionCard";
import SkillsCard from "./widgets/SkillsCard";
import TrajectoryCard from "./widgets/TrajectoryCard";

const PERIODS = [7, 30, 90];

/** Аналитика (макет: стр. 9; ТЗ 4.8, 4.11, 4.12) */
const Analitics = () => {
  const t = useT();
  const { locale } = useSettings();
  const [period, setPeriod] = useState(30);
  const overview = useGetStatsOverview({ period_days: period });
  const o = overview.data;

  return (
    <>
      <PageHeader
        title={t.analytics.title}
        subtitle={t.analytics.subtitle(period)}
        actions={
          <Segmented
            variant="switch"
            ariaLabel={t.analytics.period}
            value={period}
            onChange={setPeriod}
            options={PERIODS.map((p) => ({ value: p, label: t.common.days(p) }))}
          />
        }
      />

      {overview.isError ? (
        <Card className={scss.mb}>
          <ErrorState error={overview.error} onRetry={() => overview.refetch()} />
        </Card>
      ) : (
        <div className={layout.stats}>
          <StatCard
            icon={<LuTarget />}
            tone="info"
            label={t.stats.accuracy}
            value={formatPercent(toRatio(o?.accuracy))}
            hint={o ? t.analytics.solvedIn(o.solved, period) : undefined}
            loading={overview.isPending}
          />
          <StatCard
            icon={<LuCheck />}
            tone="success"
            label={t.stats.solved}
            value={o ? formatNumber(o.solved, locale) : "—"}
            hint={o ? t.analytics.activeDays(o.active_days) : undefined}
            loading={overview.isPending}
          />
          <StatCard
            icon={<LuClock />}
            tone="warning"
            label={t.analytics.avgTime}
            value={o?.avg_time_sec != null ? formatClock(o.avg_time_sec) : "—"}
            hint={t.analytics.perQuestion}
            loading={overview.isPending}
          />
          <StatCard
            icon={<LuFlame />}
            tone="danger"
            label={t.stats.streak}
            value={o ? t.common.days(o.streak) : "—"}
            hint={o ? t.stats.longestStreak(o.longest_streak) : undefined}
            loading={overview.isPending}
          />
        </div>
      )}

      <div className={layout.columns}>
        <div className={layout.stack}>
          <TrajectoryCard />
          <RoiCard />
          <SkillsCard limit={12} />
        </div>
        <div className={layout.stack}>
          <PredictionCard />
          <GoalProgressCard />
          <AchievementsCard />
        </div>
      </div>
    </>
  );
};

/** «Где больше всего баллов» — навыки по ожидаемому приросту за час (ТЗ 4.12) */
const RoiCard = () => {
  const t = useT();
  const { locale } = useSettings();
  const roi = useGetSkillsRoi();
  const practice = useOpenPractice();

  return (
    <Card title={t.analytics.roiTitle} action={<span className={layout.muted}>{t.analytics.roiHint}</span>}>
      {roi.isPending ? (
        <Skeleton height={160} />
      ) : roi.isError && roi.error.status !== 422 ? (
        <ErrorState error={roi.error} onRetry={() => roi.refetch()} />
      ) : roi.isError || roi.data.length === 0 ? (
        // 422 — для расчёта ещё не хватает данных (нет пробника/цели): это не ошибка
        <Empty icon={<LuTrendingUp />} title={t.analytics.roiEmpty} text={t.analytics.roiEmptyText} />
      ) : (
        <ol className={scss.roi}>
          {roi.data.slice(0, 5).map((s, i) => (
            <li key={s.skill_id}>
              <span className={scss.rank}>{i + 1}</span>
              <div className={scss.roiText}>
                <strong>{pickTitle(s, locale)}</strong>
                <span>
                  {t.analytics.roiLine(Math.round(s.potential_gain * 10) / 10, s.minutes)} ·{" "}
                  {t.analytics.mastery}: {Math.round((toRatio(s.mastery) ?? 0) * 100)}%
                </span>
              </div>
              <Button
                size="sm"
                variant="soft"
                disabled={practice.mutation.isPending}
                onClick={() => practice.open({ skillId: s.skill_id })}
              >
                {t.analytics.train}
              </Button>
            </li>
          ))}
        </ol>
      )}
      {practice.mutation.isError && (
        <p className={scss.error}>{getErrorMessage(practice.mutation.error, t.errors)}</p>
      )}
    </Card>
  );
};

/** Прогресс к цели: разрыв, веха, реалистичность (ТЗ 4.11) */
const GoalProgressCard = () => {
  const t = useT();
  const { locale } = useSettings();
  const progress = useGetGoalProgress({ retry: false });

  if (progress.isPending) return <Skeleton height={180} />;
  if (progress.isError)
    return (
      <Card title={t.goal.title}>
        <ErrorState error={progress.error} onRetry={() => progress.refetch()} />
      </Card>
    );
  // null — цели ещё нет
  if (progress.data === null)
    return (
      <Card title={t.goal.title}>
        <Empty
          icon={<LuTarget />}
          title={t.goal.noGoal}
          text={t.goal.noGoalText}
          action={
            <Button href="/dashboard/settings#goal" size="sm">
              {t.goal.set}
            </Button>
          }
        />
      </Card>
    );

  const p = progress.data;
  const g = p.goal;
  const span = g.target_score - g.start_score;
  const ratio = span > 0 && p.current_score != null ? (p.current_score - g.start_score) / span : 0;

  return (
    <Card
      title={t.goal.title}
      action={
        <Badge tone={p.feasible ? "success" : "warning"}>
          {p.feasible ? t.goal.feasible : t.goal.notFeasible}
        </Badge>
      }
    >
      <p className={scss.goalLine}>
        {g.start_score} → <strong>{p.current_score != null ? Math.round(p.current_score) : "—"}</strong> →{" "}
        {g.target_score}
      </p>
      <ProgressBar value={ratio} tone={p.feasible ? "primary" : "warning"} />
      <div className={layout.row}>
        <span>{t.goal.gap}</span>
        <strong>{p.gap != null ? Math.round(p.gap) : "—"}</strong>
      </div>
      <div className={layout.row}>
        <span>{t.goal.nextMilestone}</span>
        <strong>{p.next_milestone ?? "—"}</strong>
      </div>
      <div className={layout.row}>
        <span>{t.goal.examDate}</span>
        <strong>
          {formatDate(g.exam_date, locale)} · {t.topbar.daysLeft(g.days_left)}
        </strong>
      </div>
      <div className={layout.row}>
        <span>{t.goal.minutes}</span>
        <strong>
          {t.common.minutes(p.minutes_available)} / {t.common.minutes(p.minutes_needed)}
        </strong>
      </div>
      {!p.feasible && <p className={scss.warn}>{t.goal.notFeasibleText(Math.round(p.max_reachable))}</p>}
      <p className={layout.estimated}>{t.common.estimated}</p>
    </Card>
  );
};

/** Награды за освоенные навыки и вехи (ТЗ 4.15) */
const AchievementsCard = () => {
  const t = useT();
  const { locale } = useSettings();
  const achievements = useGetAchievements();
  if (achievements.isError || !achievements.data?.length) return null;

  return (
    <Card title={t.analytics.achievements}>
      <ul className={scss.achievements}>
        {achievements.data.slice(0, 6).map((a) => (
          <li key={`${a.code}-${a.ref}`}>
            <span className={scss.trophy} aria-hidden>
              <LuTrophy />
            </span>
            <div>
              <strong>{a.code}</strong>
              <span>{formatDate(a.earned_at, locale)}</span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default Analitics;
