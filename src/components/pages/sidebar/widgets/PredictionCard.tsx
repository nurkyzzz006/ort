"use client";
import { useGetGoal, useGetPrediction } from "@/api";
import Card from "@/components/ui/Card";
import { Ring } from "@/components/ui/Progress";
import { ErrorState, Skeleton } from "@/components/ui/StateView";
import { useT } from "@/i18n";
import scss from "./widgets.module.scss";

/**
 * «ЖРТга даярдык»: прогноз балла диапазоном и уверенностью (ТЗ 4.14).
 * Без пробника прогноз не показывается — объясняем, как его получить.
 */
const PredictionCard = () => {
  const t = useT();
  const prediction = useGetPrediction();
  const goal = useGetGoal({ retry: false });

  const body = () => {
    if (prediction.isPending) return <Skeleton height={150} />;
    if (prediction.isError)
      return <ErrorState error={prediction.error} onRetry={() => prediction.refetch()} />;

    const p = prediction.data;
    if (!p.available || p.point == null) {
      return (
        <div className={scss.predictionEmpty}>
          <Ring value={null} size={130}>
            <strong className={scss.ringValue}>—</strong>
          </Ring>
          <p>{t.prediction.unavailable}</p>
        </div>
      );
    }

    // Процент — доля от целевого балла, если цель поставлена
    const target = goal.data?.target_score;
    const ratio = target ? p.point / target : null;
    const levels: Record<string, string> = t.prediction.confidence;
    const confidence = p.confidence ? (levels[p.confidence] ?? p.confidence) : "—";

    return (
      <div className={scss.prediction}>
        <Ring value={ratio} size={140} label={t.prediction.title}>
          <strong className={scss.ringValue}>
            {ratio !== null ? `${Math.round(Math.min(ratio, 1) * 100)}%` : Math.round(p.point)}
          </strong>
        </Ring>
        <p className={scss.range}>
          {t.prediction.forecast}:{" "}
          <strong>
            {p.low != null && p.high != null
              ? `${Math.round(p.low)}–${Math.round(p.high)}`
              : Math.round(p.point)}
          </strong>{" "}
          {t.common.points}
        </p>
        <p className={scss.muted}>
          {t.prediction.confidenceLabel}: {confidence}
        </p>
        {target && (
          <p className={scss.muted}>
            {t.prediction.ofTarget(target)}
          </p>
        )}
        {/* ТЗ 4.14: прогноз не выдаётся за официальный результат */}
        <p className={scss.estimated}>
          {p.is_estimated_scale ? t.common.estimatedDouble : t.common.estimated}
        </p>
      </div>
    );
  };

  return (
    <Card>
      <p className={scss.overline}>{t.prediction.title}</p>
      {body()}
    </Card>
  );
};

export default PredictionCard;
