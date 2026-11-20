"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  LuArrowLeft,
  LuArrowRight,
  LuBookmark,
  LuCheck,
  LuClock,
  LuLoaderCircle,
  LuRefreshCw,
  LuTriangleAlert,
  LuWifiOff,
} from "react-icons/lu";
import {
  ApiError,
  getErrorMessage,
  useCloseSection,
  useGetSession,
  useSubmitSession,
  type Session,
} from "@/api";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/Progress";
import { ErrorState, Loader } from "@/components/ui/StateView";
import { pickTitle, useT } from "@/i18n";
import { formatClock } from "@/i18n/format";
import { useSettings } from "@/settings/SettingsProvider";
import { useAutosave, type SaveStatus } from "./useAutosave";
import scss from "./Exam.module.scss";

interface AnswerState {
  option_id: string | null;
  marked: boolean;
  seq: number;
}

/** Экран экзамена (макет: стр. 4) */
const Exam = ({ sessionId }: { sessionId: string }) => {
  const router = useRouter();
  const session = useGetSession(sessionId);

  // Завершённую сессию сразу открываем на результатах (ответы неизменяемы)
  const finished = Boolean(session.data?.submitted_at);
  useEffect(() => {
    if (finished) router.replace(`/dashboard/tester/${sessionId}/result`);
  }, [finished, router, sessionId]);

  if (session.isPending || finished) return <Loader />;
  if (session.isError)
    return (
      <Card>
        <ErrorState error={session.error} onRetry={() => session.refetch()} />
      </Card>
    );

  return (
    <ExamView
      key={session.data.id}
      session={session.data}
      fetchedAt={session.dataUpdatedAt}
      refetch={() => void session.refetch()}
    />
  );
};

interface ExamViewProps {
  session: Session;
  fetchedAt: number;
  refetch: () => void;
}

const ExamView = ({ session, fetchedAt, refetch }: ExamViewProps) => {
  const t = useT();
  const { locale } = useSettings();
  const router = useRouter();
  const autosave = useAutosave(session.id);
  const submit = useSubmitSession();
  const closeSection = useCloseSection();

  // ── Ответы: данные сервера + несохранённые изменения из офлайн-очереди ──
  const [answers, setAnswers] = useState<Record<string, AnswerState>>(() => {
    const queued = autosave.queued();
    return Object.fromEntries(
      session.questions.map((q) => {
        const local = queued[q.id];
        const useLocal = local && local.seq > q.seq;
        return [
          q.id,
          {
            option_id: useLocal ? (local.option_id ?? null) : q.selected_option_id,
            marked: useLocal ? Boolean(local.marked) : q.marked,
            seq: useLocal ? local.seq : q.seq,
          },
        ];
      }),
    );
  });

  // ── Текущий раздел и его вопросы ──
  const section = session.sections.find((s) => s.code === session.current_section_code) ?? null;
  const questions = useMemo(
    () =>
      session.current_section_code
        ? session.questions.filter((q) => q.section_code === session.current_section_code)
        : session.questions,
    [session.questions, session.current_section_code],
  );
  const [index, setIndex] = useState(0);
  const current = questions[Math.min(index, questions.length - 1)];

  // ── Серверный таймер (ТЗ 4.2): смещение часов браузера относительно сервера ──
  const offset = useMemo(() => Date.parse(session.server_time) - fetchedAt, [session.server_time, fetchedAt]);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const serverNow = now + offset;
  const examLeft = (Date.parse(session.deadline_at) - serverNow) / 1000;
  const sectionLeft = section?.deadline_at ? (Date.parse(section.deadline_at) - serverNow) / 1000 : null;
  const left = Math.max(0, sectionLeft !== null ? Math.min(sectionLeft, examLeft) : examLeft);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  const finish = async () => {
    setSubmitError(null);
    await autosave.flush();
    // Не завершаем, пока есть несохранённые ответы — иначе они потеряются
    if (Object.keys(autosave.queued()).length > 0) {
      setSubmitError(t.exam.unsavedBlock);
      return;
    }
    submit.mutate(
      { sessionId: session.id },
      {
        onSuccess: () => router.replace(`/dashboard/tester/${session.id}/result`),
        onError: (error) => {
          // Повторный submit / сервер уже закрыл сессию по дедлайну
          if (error instanceof ApiError && error.status === 409)
            router.replace(`/dashboard/tester/${session.id}/result`);
          else setSubmitError(getErrorMessage(error, t.errors));
        },
      },
    );
  };

  // ── Истечение времени: раздел → обновить сессию; весь тест → завершить ──
  // Проверяется в колбэке таймера (не в эффекте рендера): актуальные значения — через ref.
  const expiryRef = useRef({ examLeft, sectionCode: section?.code ?? null, left });
  const onExpireRef = useRef<(kind: "exam" | "section") => void>(() => undefined);
  useEffect(() => {
    expiryRef.current = { examLeft, sectionCode: section?.code ?? null, left };
    onExpireRef.current = (kind) => (kind === "exam" ? void finish() : refetch());
  });
  const handledRef = useRef<string | null>(null);
  useEffect(() => {
    const id = window.setInterval(() => {
      const { examLeft: e, left: l, sectionCode } = expiryRef.current;
      if (l > 0) return;
      const marker = e <= 0 ? "exam" : `section-${sectionCode}`;
      if (handledRef.current === marker) return;
      handledRef.current = marker;
      // весь тест → завершить; раздел → сервер сам закрыл его, обновляем сессию
      onExpireRef.current(e <= 0 ? "exam" : "section");
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!current) return <Loader />;

  const state = answers[current.id];
  const update = (patch: Partial<Omit<AnswerState, "seq">>) => {
    const next: AnswerState = { ...state, ...patch, seq: state.seq + 1 };
    setAnswers((prev) => ({ ...prev, [current.id]: next }));
    autosave.save(current.id, {
      option_id: next.option_id,
      marked: next.marked,
      seq: next.seq,
    });
  };

  const answeredCount = questions.filter((q) => answers[q.id]?.option_id).length;
  const totalAnswered = session.questions.filter((q) => answers[q.id]?.option_id).length;
  const unanswered = session.questions.length - totalAnswered;
  const hasNextSection =
    session.sections.length > 1 &&
    session.sections.findIndex((s) => s.code === session.current_section_code) <
      session.sections.length - 1;

  return (
    <div className={scss.exam}>
      {/* ── Шапка экзамена ── */}
      <Card className={scss.head}>
        <div className={scss.headText}>
          <h1>{pickTitle(session, locale)}</h1>
          <p>
            {t.common.questions(session.questions.length)}
            {section && ` · ${pickTitle(section, locale)}`}
          </p>
        </div>
        <SaveBadge status={autosave.status} pending={autosave.pending} lastSavedAt={autosave.lastSavedAt} />
        <div
          className={[scss.timer, left < 300 ? scss.timerLow : ""].join(" ")}
          role="timer"
          aria-label={t.exam.timeLeft}
        >
          <LuClock aria-hidden />
          {formatClock(left)}
        </div>
      </Card>

      <div className={scss.columns}>
        {/* ── Вопрос ── */}
        <Card className={scss.question}>
          <div className={scss.questionTop}>
            <p className={scss.position}>
              {index + 1} / {questions.length}
            </p>
            {state.marked && (
              <Badge tone="warning" icon={<LuBookmark />}>
                {t.exam.marked}
              </Badge>
            )}
          </div>

          {/* Текст вопроса из CMS; переносы строк сохраняются */}
          <p className={scss.stem}>{current.stem}</p>

          <div className={scss.options} role="radiogroup" aria-label={t.exam.options}>
            {current.options.map((o) => {
              const selected = state.option_id === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={[scss.option, selected ? scss.selected : ""].join(" ")}
                  onClick={() => update({ option_id: selected ? null : o.id })}
                >
                  <span className={scss.key}>{o.key}</span>
                  <span className={scss.optionText}>{o.text}</span>
                  {selected && <span className={scss.chosen}>{t.exam.chosen}</span>}
                </button>
              );
            })}
          </div>

          <div className={scss.actions}>
            <Button
              variant="secondary"
              size="sm"
              icon={<LuBookmark />}
              aria-pressed={state.marked}
              onClick={() => update({ marked: !state.marked })}
            >
              {state.marked ? t.exam.unmark : t.exam.mark}
            </Button>
            <div className={scss.navButtons}>
              <Button
                variant="secondary"
                size="sm"
                icon={<LuArrowLeft />}
                disabled={index === 0}
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
              >
                {t.exam.prev}
              </Button>
              <Button
                size="sm"
                iconRight={<LuArrowRight />}
                disabled={index >= questions.length - 1}
                onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
              >
                {t.exam.next}
              </Button>
            </div>
          </div>
        </Card>

        <div className={scss.side}>
          {/* ── Навигация ── */}
          <Card title={t.exam.navigation} action={<span className={scss.counter}>{t.exam.answeredOf(answeredCount, questions.length)}</span>}>
            <ProgressBar value={questions.length ? answeredCount / questions.length : 0} />
            <div className={scss.grid}>
              {questions.map((q, i) => {
                const a = answers[q.id];
                const cls = [
                  scss.cell,
                  i === index ? scss.cellCurrent : a?.marked ? scss.cellMarked : a?.option_id ? scss.cellAnswered : "",
                ].join(" ");
                return (
                  <button
                    key={q.id}
                    type="button"
                    className={cls}
                    aria-current={i === index ? "step" : undefined}
                    aria-label={t.exam.goTo(i + 1)}
                    onClick={() => setIndex(i)}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            <ul className={scss.legend}>
              <li className={scss.lCurrent}>{t.exam.legend.current}</li>
              <li className={scss.lAnswered}>{t.exam.legend.answered}</li>
              <li className={scss.lMarked}>{t.exam.legend.marked}</li>
              <li className={scss.lEmpty}>{t.exam.legend.empty}</li>
            </ul>
          </Card>

          {/* ── Раздел / завершение ── */}
          {hasNextSection && (
            <Card title={t.exam.sectionTitle}>
              <p className={scss.muted}>{t.exam.sectionText}</p>
              <Button
                variant="secondary"
                fullWidth
                className={scss.mt}
                loading={closeSection.isPending}
                onClick={() =>
                  closeSection.mutate(
                    { sessionId: session.id, sectionCode: session.current_section_code as string },
                    { onSuccess: () => setIndex(0) },
                  )
                }
              >
                {t.exam.closeSection}
              </Button>
              {closeSection.isError && (
                <p className={scss.error} role="alert">
                  {getErrorMessage(closeSection.error, t.errors)}
                </p>
              )}
            </Card>
          )}

          <Card title={t.exam.finishTitle}>
            <p className={scss.muted}>{t.exam.finishText(unanswered)}</p>
            {confirming ? (
              <div className={scss.confirm}>
                <p>{t.exam.confirm}</p>
                <div>
                  <Button variant="secondary" size="sm" onClick={() => setConfirming(false)}>
                    {t.common.cancel}
                  </Button>
                  <Button size="sm" loading={submit.isPending} onClick={() => void finish()}>
                    {t.exam.confirmYes}
                  </Button>
                </div>
              </div>
            ) : (
              <Button fullWidth size="lg" className={scss.mt} onClick={() => setConfirming(true)}>
                {t.exam.finish}
              </Button>
            )}
            {submitError && (
              <p className={scss.error} role="alert">
                {submitError}
              </p>
            )}
            <p className={scss.note}>{t.exam.serverTimerNote}</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

/** Индикатор автосохранения: сохранено / сохраняется / офлайн / ошибка (ТЗ 4.2) */
const SaveBadge = ({
  status,
  pending,
  lastSavedAt,
}: {
  status: SaveStatus;
  pending: number;
  lastSavedAt: Date | null;
}) => {
  const t = useT();
  const time = lastSavedAt
    ? `${String(lastSavedAt.getHours()).padStart(2, "0")}:${String(lastSavedAt.getMinutes()).padStart(2, "0")}`
    : "";

  return (
    <div aria-live="polite">
      {status === "saving" ? (
        <Badge tone="primary" icon={<LuLoaderCircle />}>
          {t.exam.save.saving}
        </Badge>
      ) : status === "offline" ? (
        <Badge tone="warning" icon={<LuWifiOff />}>
          {t.exam.save.offline(pending)}
        </Badge>
      ) : status === "error" ? (
        <Badge tone="danger" icon={<LuTriangleAlert />}>
          {t.exam.save.error}
        </Badge>
      ) : status === "saved" ? (
        <Badge tone="success" icon={<LuCheck />}>
          {t.exam.save.saved} {time && `· ${time}`}
        </Badge>
      ) : (
        <Badge tone="neutral" icon={<LuRefreshCw />}>
          {t.exam.save.auto}
        </Badge>
      )}
    </div>
  );
};

export default Exam;
