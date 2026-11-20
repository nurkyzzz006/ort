"use client";
import { useState } from "react";
import {
  LuArchive,
  LuArrowRight,
  LuCheck,
  LuClock,
  LuRotateCw,
  LuTriangleAlert,
} from "react-icons/lu";
import {
  getErrorMessage,
  useGetMistakes,
  useGetReviewQueue,
  useUpdateMistake,
  type AttemptSource,
  type CardStatus,
  type MistakeCard,
  type MistakeReason,
} from "@/api";
import Badge, { type BadgeTone } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import { Empty, ErrorState, Skeleton } from "@/components/ui/StateView";
import { useT } from "@/i18n";
import { formatDate } from "@/i18n/format";
import { useSettings } from "@/settings/SettingsProvider";
import layout from "./layout.module.scss";
import scss from "./Wrongs.module.scss";

const PAGE_SIZE = 20;
const STATUSES: CardStatus[] = ["new", "learning", "mastered", "suspended"];
const SOURCES: AttemptSource[] = ["test", "practice", "review"];
const REASONS: MistakeReason[] = [
  "unknown_topic",
  "calculation",
  "inattention",
  "misread",
  "no_time",
  "guessed",
  "other",
];

export const STATUS_TONE: Record<CardStatus, BadgeTone> = {
  new: "danger",
  learning: "warning",
  mastered: "success",
  suspended: "neutral",
};

const optionKey = (card: MistakeCard, id: string | null) =>
  card.options.find((o) => o.id === id)?.key ?? "—";

/** Журнал ошибок (макет: стр. 6; ТЗ 4.5–4.6) */
const Wrongs = () => {
  const t = useT();
  const [status, setStatus] = useState<CardStatus | "">("");
  const [source, setSource] = useState<AttemptSource | "">("");
  const [offset, setOffset] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const list = useGetMistakes({
    status: status || null,
    source: source || null,
    limit: PAGE_SIZE,
    offset,
  });
  // Счётчики по статусам — total из API
  const countNew = useGetMistakes({ status: "new", limit: 1 });
  const countLearning = useGetMistakes({ status: "learning", limit: 1 });
  const countMastered = useGetMistakes({ status: "mastered", limit: 1 });
  const queue = useGetReviewQueue();

  const selected = list.data?.items.find((c) => c.id === selectedId) ?? list.data?.items[0] ?? null;

  const resetPage = () => {
    setOffset(0);
    setSelectedId(null);
  };

  return (
    <>
      <PageHeader
        title={t.mistakes.title}
        subtitle={t.mistakes.subtitle}
        actions={
          <Button href="/dashboard/smart" icon={<LuRotateCw />}>
            {t.mistakes.startReview}
          </Button>
        }
      />

      <div className={layout.stats}>
        <StatCard
          icon={<LuTriangleAlert />}
          tone="danger"
          label={t.mistakes.status.new}
          value={countNew.data?.total ?? "—"}
          loading={countNew.isPending}
        />
        <StatCard
          icon={<LuRotateCw />}
          tone="warning"
          label={t.mistakes.status.learning}
          value={countLearning.data?.total ?? "—"}
          hint={t.mistakes.needsReview}
          loading={countLearning.isPending}
        />
        <StatCard
          icon={<LuCheck />}
          tone="success"
          label={t.mistakes.status.mastered}
          value={countMastered.data?.total ?? "—"}
          hint={t.mistakes.masteredHint}
          loading={countMastered.isPending}
        />
        <StatCard
          icon={<LuClock />}
          tone="info"
          label={t.mistakes.dueToday}
          value={queue.data?.due ?? "—"}
          hint={queue.data ? t.common.minutes(queue.data.estimated_minutes) : undefined}
          loading={queue.isPending}
        />
      </div>

      <div className={layout.columns}>
        <Card padding="none">
          <div className={scss.filters}>
            <select
              aria-label={t.mistakes.filterStatus}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as CardStatus | "");
                resetPage();
              }}
            >
              <option value="">{t.mistakes.allStatuses}</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {t.mistakes.status[s]}
                </option>
              ))}
            </select>
            <select
              aria-label={t.mistakes.filterSource}
              value={source}
              onChange={(e) => {
                setSource(e.target.value as AttemptSource | "");
                resetPage();
              }}
            >
              <option value="">{t.mistakes.allSources}</option>
              {SOURCES.map((s) => (
                <option key={s} value={s}>
                  {t.mistakes.source[s]}
                </option>
              ))}
            </select>
          </div>

          {list.isPending ? (
            <div className={scss.pad}>
              <Skeleton height={220} />
            </div>
          ) : list.isError ? (
            <ErrorState error={list.error} onRetry={() => list.refetch()} />
          ) : list.data.items.length === 0 ? (
            <Empty
              icon={<LuCheck />}
              title={t.mistakes.emptyTitle}
              text={status || source ? t.mistakes.emptyFiltered : t.mistakes.emptyText}
            />
          ) : (
            <>
              <div className={scss.tableWrap}>
                <table className={scss.table}>
                  <thead>
                    <tr>
                      <th>{t.mistakes.columns.question}</th>
                      <th>{t.mistakes.columns.answer}</th>
                      <th>{t.mistakes.columns.errors}</th>
                      <th>{t.mistakes.columns.status}</th>
                      <th>{t.mistakes.columns.due}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.data.items.map((card) => (
                      <tr
                        key={card.id}
                        className={card.id === selected?.id ? scss.rowActive : ""}
                        onClick={() => setSelectedId(card.id)}
                      >
                        <td>
                          <button type="button" className={scss.stemButton} onClick={() => setSelectedId(card.id)}>
                            {card.stem}
                          </button>
                          <span className={scss.meta}>
                            {card.question_code} · {t.mistakes.source[card.source as AttemptSource] ?? card.source}
                          </span>
                        </td>
                        <td>
                          <span className={scss.keys}>
                            <b className={scss.keyBad}>{optionKey(card, card.selected_option_id)}</b>
                            <LuArrowRight aria-hidden />
                            <b className={scss.keyGood}>{optionKey(card, card.correct_option_id)}</b>
                          </span>
                        </td>
                        <td>{t.mistakes.times(card.error_count)}</td>
                        <td>
                          <Badge tone={STATUS_TONE[card.status]}>{t.mistakes.status[card.status]}</Badge>
                        </td>
                        <td>
                          <DueDate iso={card.due_at} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={scss.pager}>
                <span>
                  {offset + 1}–{offset + list.data.items.length} / {list.data.total}
                </span>
                <div>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={offset === 0}
                    onClick={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
                  >
                    {t.common.prev}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={offset + PAGE_SIZE >= list.data.total}
                    onClick={() => setOffset((o) => o + PAGE_SIZE)}
                  >
                    {t.common.next}
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>

        {selected && <MistakeDetail card={selected} />}
      </div>
    </>
  );
};

const DueDate = ({ iso }: { iso: string | null }) => {
  const t = useT();
  const { locale } = useSettings();
  if (!iso) return <>—</>;
  const due = new Date(iso);
  const today = new Date();
  const sameDay = due.toDateString() === today.toDateString();
  return <>{sameDay || due < today ? t.mistakes.today : formatDate(iso, locale)}</>;
};

/** Карточка ошибки: ответы, решение, причина (ТЗ 4.6), архив */
const MistakeDetail = ({ card }: { card: MistakeCard }) => {
  const t = useT();
  const update = useUpdateMistake();
  const selected = card.options.find((o) => o.id === card.selected_option_id);
  const correct = card.options.find((o) => o.id === card.correct_option_id);

  return (
    <div className={layout.stack}>
      <Card>
        <div className={scss.detailTags}>
          <Badge tone={STATUS_TONE[card.status]}>{t.mistakes.status[card.status]}</Badge>
          <Badge>{card.question_code}</Badge>
        </div>
        <p className={scss.detailStem}>{card.stem}</p>

        <div className={layout.row}>
          <span>{t.mistakes.yourAnswer}</span>
          <strong className={scss.bad}>
            {selected ? `${selected.key} · ${selected.text}` : "—"}
          </strong>
        </div>
        <div className={layout.row}>
          <span>{t.mistakes.correctAnswer}</span>
          <strong className={scss.good}>{correct ? `${correct.key} · ${correct.text}` : "—"}</strong>
        </div>
        <div className={layout.row}>
          <span>{t.mistakes.errorCount}</span>
          <strong>{card.error_count}</strong>
        </div>
        <div className={layout.row}>
          <span>{t.mistakes.nextReview}</span>
          <strong>
            <DueDate iso={card.due_at} />
          </strong>
        </div>

        {card.solution && (
          <div className={scss.solution}>
            <strong>{t.result.solution}:</strong> {card.solution}
          </div>
        )}

        <Button
          variant="secondary"
          size="sm"
          icon={<LuArchive />}
          className={scss.archive}
          loading={update.isPending && update.variables?.data.archived !== undefined}
          onClick={() => update.mutate({ cardId: card.id, data: { archived: true } })}
        >
          {t.mistakes.archive}
        </Button>
      </Card>

      <Card title={t.mistakes.reasonTitle}>
        <p className={layout.muted}>{t.mistakes.reasonText}</p>
        <div className={scss.reasons} role="radiogroup" aria-label={t.mistakes.reasonTitle}>
          {REASONS.map((r) => (
            <button
              key={r}
              type="button"
              role="radio"
              aria-checked={card.reason === r}
              disabled={update.isPending}
              onClick={() =>
                update.mutate({ cardId: card.id, data: { reason: card.reason === r ? null : r } })
              }
            >
              {t.mistakes.reasons[r]}
            </button>
          ))}
        </div>
        {update.isError && (
          <p className={scss.error} role="alert">
            {getErrorMessage(update.error, t.errors)}
          </p>
        )}
      </Card>
    </div>
  );
};

export default Wrongs;
