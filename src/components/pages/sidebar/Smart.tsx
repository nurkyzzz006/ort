"use client";
import { useEffect, useRef, useState } from "react";
import {
  LuArrowRight,
  LuCheck,
  LuCircleCheck,
  LuCircleX,
  LuClock,
  LuFlame,
  LuRotateCw,
  LuTarget,
} from "react-icons/lu";
import {
  createIdempotencyKey,
  getErrorMessage,
  useAnswerReview,
  useGetMistakes,
  useGetReviewQueue,
  useGetStatsOverview,
  useGetWeeklyReport,
  useSnoozeReview,
  type AnswerReviewResponse,
  type ReviewCard,
} from "@/api";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import { ProgressBar } from "@/components/ui/Progress";
import StatCard from "@/components/ui/StatCard";
import { Empty, ErrorState, Skeleton } from "@/components/ui/StateView";
import { useT } from "@/i18n";
import { formatDate } from "@/i18n/format";
import { isOverdue, nowMs, secondsSince } from "@/i18n/time";
import { useSettings } from "@/settings/SettingsProvider";
import layout from "./layout.module.scss";
import scss from "./Smart.module.scss";

/** Стартовая политика интервалов (ТЗ 4.7) — продуктовая гипотеза, показывается как справка */
const INTERVALS = [1, 3, 7, 14, 30];

/** Интервальное повторение (макет: стр. 7) */
const Smart = () => {
  const t = useT();
  const queue = useGetReviewQueue();
  const overview = useGetStatsOverview();
  const mastered = useGetMistakes({ status: "mastered", limit: 1 });

  // Карточки, на которые уже ответили в этом заходе
  const [done, setDone] = useState<string[]>([]);
  const items = queue.data?.items.filter((c) => !done.includes(c.card_id)) ?? [];
  const current = items[0] ?? null;

  return (
    <>
      <PageHeader
        title={t.review.title}
        subtitle={t.review.subtitle}
        actions={
          queue.data && (
            <>
              <Badge tone="neutral">{t.review.cardsToday(queue.data.due)}</Badge>
              <Badge tone="primary" icon={<LuClock />}>
                ~{t.common.minutes(queue.data.estimated_minutes)}
              </Badge>
            </>
          )
        }
      />

      <div className={layout.stats}>
        <StatCard
          icon={<LuRotateCw />}
          label={t.review.dueToday}
          value={queue.data?.due ?? "—"}
          loading={queue.isPending}
        />
        <StatCard icon={<LuCheck />} tone="success" label={t.review.doneNow} value={done.length} />
        <StatCard
          icon={<LuFlame />}
          tone="warning"
          label={t.stats.streak}
          value={overview.data ? t.common.days(overview.data.streak) : "—"}
          loading={overview.isPending}
        />
        <StatCard
          icon={<LuTarget />}
          tone="info"
          label={t.review.mastered}
          value={mastered.data?.total ?? "—"}
          loading={mastered.isPending}
        />
      </div>

      <Card title={t.review.cycle} action={<span className={layout.muted}>{t.review.policy}</span>}>
        <ol className={scss.cycle}>
          {INTERVALS.map((d) => {
            const active = current?.interval_days === d;
            const passed = current ? current.interval_days > d : false;
            return (
              <li key={d} className={[active ? scss.active : "", passed ? scss.passed : ""].join(" ")}>
                <span>{passed ? <LuCheck aria-hidden /> : d}</span>
                <small>{t.common.days(d)}</small>
              </li>
            );
          })}
        </ol>
      </Card>

      <div className={`${layout.columns} ${scss.main}`}>
        {queue.isPending ? (
          <Skeleton height={420} />
        ) : queue.isError ? (
          <Card>
            <ErrorState error={queue.error} onRetry={() => queue.refetch()} />
          </Card>
        ) : current ? (
          <ReviewCardView
            key={current.card_id}
            card={current}
            onDone={() => setDone((d) => [...d, current.card_id])}
          />
        ) : (
          <Card>
            <Empty
              icon={<LuCircleCheck />}
              title={t.review.allDone}
              text={t.review.allDoneText}
              action={
                done.length > 0 ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<LuRotateCw />}
                    onClick={() => {
                      setDone([]);
                      void queue.refetch();
                    }}
                  >
                    {t.review.refresh}
                  </Button>
                ) : undefined
              }
            />
          </Card>
        )}

        <div className={layout.stack}>
          <Card title={t.review.queue} badge={<Badge tone="primary">{items.length}</Badge>}>
            {items.length === 0 ? (
              <p className={layout.muted}>{t.review.queueEmpty}</p>
            ) : (
              <ol className={scss.queue}>
                {items.slice(0, 8).map((c, i) => (
                  <li key={c.card_id} className={i === 0 ? scss.queueCurrent : ""}>
                    <span className={scss.queueNum}>{i + 1}</span>
                    <span className={scss.queueText}>
                      <strong>{c.stem}</strong>
                      <QueueDue iso={c.due_at} />
                    </span>
                    <Badge tone="neutral">{t.common.days(c.interval_days)}</Badge>
                  </li>
                ))}
              </ol>
            )}
          </Card>
          <WeekCard />
        </div>
      </div>
    </>
  );
};

const QueueDue = ({ iso }: { iso: string }) => {
  const t = useT();
  const { locale } = useSettings();
  const overdue = isOverdue(iso);
  return (
    <small className={overdue ? scss.overdue : ""}>
      {overdue ? `${t.review.overdue} · ${formatDate(iso, locale)}` : t.mistakes.today}
    </small>
  );
};

/** Одна карточка: ответ → проверка сервером → решение → следующая */
const ReviewCardView = ({ card, onDone }: { card: ReviewCard; onDone: () => void }) => {
  const t = useT();
  const answer = useAnswerReview();
  const snooze = useSnoozeReview();
  const shownAt = useRef(0);
  useEffect(() => {
    shownAt.current = nowMs();
  }, []);
  // Один ключ идемпотентности на карточку: повторная отправка не сдвинет её дважды
  const [idempotencyKey] = useState(createIdempotencyKey);
  const [result, setResult] = useState<AnswerReviewResponse | null>(null);

  const choose = (optionId: string) => {
    if (result || answer.isPending) return;
    answer.mutate(
      {
        cardId: card.card_id,
        idempotencyKey,
        data: { option_id: optionId, time_spent_sec: secondsSince(shownAt.current) },
      },
      { onSuccess: setResult },
    );
  };

  return (
    <Card>
      <div className={scss.cardTop}>
        <p className={layout.muted}>{t.review.errorsBefore(card.error_count)}</p>
        <Badge tone="neutral">{t.review.interval(card.interval_days)}</Badge>
      </div>
      <p className={scss.stem}>{card.stem}</p>

      <div className={scss.options} role="radiogroup" aria-label={t.exam.options}>
        {card.options.map((o) => {
          const correct = result?.correct_option_id === o.id;
          const wrong = result && result.selected_option_id === o.id && !result.is_correct;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={result?.selected_option_id === o.id}
              disabled={Boolean(result) || answer.isPending}
              className={[scss.option, correct ? scss.optCorrect : "", wrong ? scss.optWrong : ""].join(" ")}
              onClick={() => choose(o.id)}
            >
              <span className={scss.key}>{o.key}</span>
              <span>{o.text}</span>
            </button>
          );
        })}
      </div>

      {(answer.isError || snooze.isError) && (
        <p className={scss.error} role="alert">
          {getErrorMessage(answer.error ?? snooze.error, t.errors)}
        </p>
      )}

      {result ? (
        <>
          <div className={[scss.feedback, result.is_correct ? scss.fbGood : scss.fbBad].join(" ")}>
            {result.is_correct ? <LuCircleCheck aria-hidden /> : <LuCircleX aria-hidden />}
            <p>
              {result.is_correct
                ? t.review.correctNext(result.interval_days)
                : t.review.wrongReset(result.interval_days)}
            </p>
          </div>
          {result.solution && (
            <div className={scss.solution}>
              <strong>{t.result.solution}:</strong>
              <p>{result.solution}</p>
            </div>
          )}
          <div className={scss.actions}>
            <Button iconRight={<LuArrowRight />} onClick={onDone}>
              {t.review.nextCard}
            </Button>
          </div>
        </>
      ) : (
        <div className={scss.actions}>
          <p className={scss.hint}>{t.review.hint}</p>
          <Button
            variant="secondary"
            size="sm"
            loading={snooze.isPending}
            onClick={() => snooze.mutate({ cardId: card.card_id }, { onSuccess: onDone })}
          >
            {t.review.snooze}
          </Button>
        </div>
      )}
    </Card>
  );
};

/** «Бул жумада» — из еженедельного отчёта */
const WeekCard = () => {
  const t = useT();
  const report = useGetWeeklyReport();
  const r = report.data;
  if (report.isError) return null;

  return (
    <Card title={t.review.thisWeek}>
      {!r ? (
        <Skeleton height={100} />
      ) : (
        <>
          <div className={layout.row}>
            <span>{t.review.planDone}</span>
            <strong>
              {r.plan_done} / {r.plan_total}
            </strong>
          </div>
          <ProgressBar value={r.plan_total ? r.plan_done / r.plan_total : 0} tone="success" />
          <div className={layout.row}>
            <span>{t.review.solvedWeek}</span>
            <strong>{r.solved}</strong>
          </div>
          <div className={layout.row}>
            <span>{t.review.masteredWeek}</span>
            <strong>{r.cards_mastered}</strong>
          </div>
          <div className={layout.row}>
            <span>{t.review.activeDays}</span>
            <strong>{r.active_days} / 7</strong>
          </div>
        </>
      )}
    </Card>
  );
};

export default Smart;
