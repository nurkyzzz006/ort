"use client";
import { LuFileText } from "react-icons/lu";
import { useGetScoreTrajectory } from "@/api";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import LineChart, { type ChartPoint } from "@/components/ui/LineChart";
import { Empty, ErrorState, Skeleton } from "@/components/ui/StateView";
import { useT } from "@/i18n";
import { formatShortDate } from "@/i18n/format";
import { useSettings } from "@/settings/SettingsProvider";
import scss from "./widgets.module.scss";

/** Траектория балла: пробники + цель + диапазон прогноза (ТЗ 4.8, 9.4) */
const TrajectoryCard = () => {
  const t = useT();
  const { locale } = useSettings();
  const trajectory = useGetScoreTrajectory();

  const content = () => {
    if (trajectory.isPending) return <Skeleton height={240} />;
    if (trajectory.isError)
      return <ErrorState error={trajectory.error} onRetry={() => trajectory.refetch()} />;

    const data = trajectory.data;
    // Балл по шкале, если он есть; иначе — сырой балл (без смешивания шкал)
    const useScaled = data.points.some((p) => p.total_scaled !== null);
    const points: ChartPoint[] = data.points
      .filter((p) => !useScaled || p.total_scaled !== null)
      .map((p) => ({
        label: formatShortDate(p.taken_at, locale),
        value: useScaled ? (p.total_scaled as number) : p.total_raw,
        muted: p.kind === "self_reported",
      }));

    if (points.length === 0) {
      return (
        <Empty
          icon={<LuFileText />}
          title={t.trajectory.emptyTitle}
          text={t.trajectory.emptyText}
          action={
            <Button href="/dashboard/tester?kind=mock" size="sm">
              {t.trajectory.takeMock}
            </Button>
          }
        />
      );
    }

    const pr = data.prediction;
    const first = points[0].value;
    const last = points[points.length - 1].value;

    return (
      <>
        <LineChart
          points={points}
          target={useScaled ? data.target_score : null}
          band={pr.available && pr.low != null && pr.high != null ? { low: pr.low, high: pr.high } : null}
          ariaLabel={t.trajectory.title}
        />
        <div className={scss.legend}>
          <span className={scss.legendLine}>{t.trajectory.mocks}</span>
          {useScaled && data.target_score ? (
            <span className={scss.legendTarget}>
              {t.trajectory.target}: {data.target_score}
            </span>
          ) : null}
          {pr.available && <span className={scss.legendBand}>{t.trajectory.forecast}</span>}
        </div>
        <div className={scss.summary}>
          <div>
            <span>{t.trajectory.start}</span>
            <strong>{Math.round(first)}</strong>
          </div>
          <div>
            <span>{t.trajectory.now}</span>
            <strong>{Math.round(last)}</strong>
          </div>
          <div>
            <span>{t.trajectory.growth}</span>
            {/* ТЗ 4.15: рост только относительно себя */}
            <strong className={last - first >= 0 ? scss.positive : scss.negative}>
              {last - first >= 0 ? "+" : ""}
              {Math.round(last - first)}
            </strong>
          </div>
        </div>
        {!useScaled && <p className={scss.estimated}>{t.trajectory.rawOnly}</p>}
      </>
    );
  };

  return (
    <Card
      title={t.trajectory.title}
      action={
        trajectory.data?.prediction.is_estimated_scale ? (
          <Badge tone="warning">{t.common.estimated}</Badge>
        ) : undefined
      }
    >
      {content()}
    </Card>
  );
};

export default TrajectoryCard;
