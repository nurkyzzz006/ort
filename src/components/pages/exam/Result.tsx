"use client";
import { useState } from "react";
import { LuCheck, LuChevronDown, LuMinus, LuTarget, LuX } from "react-icons/lu";
import { getErrorMessage, useGetSessionResult, type ResultQuestion } from "@/api";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import { ProgressBar } from "@/components/ui/Progress";
import StatCard from "@/components/ui/StatCard";
import { ErrorState, Loader } from "@/components/ui/StateView";
import { pickTitle, useT } from "@/i18n";
import { formatClock, formatDate } from "@/i18n/format";
import { useSettings } from "@/settings/SettingsProvider";
import { useOpenPractice } from "../sidebar/actions";
import layout from "../sidebar/layout.module.scss";
import scss from "./Result.module.scss";

/** Результат теста (ТЗ 4.4): raw + ориентировочный балл, разделы, разбор */
const Result = ({ sessionId }: { sessionId: string }) => {
  const t = useT();
  const { locale } = useSettings();
  const result = useGetSessionResult(sessionId);
  const [filter, setFilter] = useState<"all" | "wrong">("wrong");

  if (result.isPending) return <Loader />;
  if (result.isError)
    return (
      <Card>
        <ErrorState error={result.error} onRetry={() => result.refetch()} />
      </Card>
    );

  const r = result.data;
  const questions = filter === "wrong" ? r.questions.filter((q) => q.is_correct !== true) : r.questions;

  return (
    <>
      <PageHeader
        title={t.result.title}
        subtitle={`${r.test_code} · ${formatDate(r.submitted_at)} · ${formatClock(r.duration_sec)}`}
        actions={
          <>
            <Button href="/dashboard/tester" variant="secondary">
              {t.result.toTests}
            </Button>
            {r.kind === "mock" && <Button href="/dashboard/settings#goal">{t.result.setGoal}</Button>}
          </>
        }
      />

      <div className={layout.stats}>
        <StatCard
          icon={<LuTarget />}
          label={t.result.raw}
          value={`${r.raw_score} / ${r.max_score}`}
          hint={r.max_score ? `${Math.round((r.raw_score / r.max_score) * 100)}%` : undefined}
        />
        <StatCard
          icon={<LuTarget />}
          tone="info"
          label={t.result.scaled}
          value={r.scaled_score !== null ? Math.round(r.scaled_score) : "—"}
          // ТЗ 9.3: любой не официальный балл — «ориентировочно»
          hint={
            r.scaled_score !== null && (r.score_is_estimated || r.scale_kind === "estimated")
              ? t.common.estimated
              : r.scaled_score === null
                ? t.result.noScale
                : undefined
          }
        />
        <StatCard icon={<LuCheck />} tone="success" label={t.result.correct} value={r.correct} />
        <StatCard
          icon={<LuX />}
          tone="danger"
          label={t.result.wrongSkipped}
          value={`${r.wrong} / ${r.skipped}`}
        />
      </div>

      <div className={layout.columns}>
        <div className={layout.stack}>
          <Card
            title={t.result.review}
            action={
              <div className={scss.toggle}>
                <button
                  type="button"
                  aria-pressed={filter === "wrong"}
                  onClick={() => setFilter("wrong")}
                >
                  {t.result.onlyMistakes}
                </button>
                <button type="button" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
                  {t.result.all}
                </button>
              </div>
            }
          >
            {questions.length === 0 ? (
              <p className={layout.muted}>{t.result.noMistakes}</p>
            ) : (
              <ol className={scss.questions}>
                {questions.map((q) => (
                  <QuestionReview key={q.id} q={q} />
                ))}
              </ol>
            )}
          </Card>
        </div>

        <div className={layout.stack}>
          {r.sections.length > 0 && (
            <Card title={t.result.sections}>
              <ul className={scss.sections}>
                {r.sections.map((s) => (
                  <li key={s.code}>
                    <div className={scss.sectionHead}>
                      <strong>{pickTitle(s, locale)}</strong>
                      <span>
                        {s.raw_score} / {s.max_score}
                        {s.scaled_score !== null && ` · ≈ ${Math.round(s.scaled_score)}`}
                      </span>
                    </div>
                    <ProgressBar value={s.max_score ? s.raw_score / s.max_score : 0} />
                    <p className={layout.muted}>
                      {t.result.lost(s.max_score - s.raw_score)} · ✓ {s.correct} · ✕ {s.wrong} · — {s.skipped}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {r.checkpoint && (
            <Card tone="primary" title={t.result.checkpointTitle}>
              <p className={layout.muted}>{t.result.checkpointText}</p>
              <Button href="/dashboard/analytics" variant="soft" className={scss.mt}>
                {t.result.toTrajectory}
              </Button>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

/** Разбор одного вопроса: выбранный и правильный ответ, решение */
const QuestionReview = ({ q }: { q: ResultQuestion }) => {
  const t = useT();
  const [open, setOpen] = useState(false);
  const practice = useOpenPractice();
  const status = q.is_correct === true ? "correct" : q.is_correct === false ? "wrong" : "skipped";

  return (
    <li className={[scss.question, scss[status]].join(" ")}>
      <button type="button" className={scss.qHead} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span className={scss.qIcon} aria-hidden>
          {status === "correct" ? <LuCheck /> : status === "wrong" ? <LuX /> : <LuMinus />}
        </span>
        <span className={scss.qTitle}>
          {t.result.questionN(q.position)} · {q.stem}
        </span>
        <LuChevronDown className={open ? scss.rotated : ""} aria-hidden />
      </button>

      {open && (
        <div className={scss.qBody}>
          <p className={scss.stem}>{q.stem}</p>
          <ul className={scss.options}>
            {q.options.map((o) => {
              const correct = o.id === q.correct_option_id;
              const selected = o.id === q.selected_option_id;
              return (
                <li
                  key={o.id}
                  className={[correct ? scss.optCorrect : "", selected && !correct ? scss.optWrong : ""].join(" ")}
                >
                  <b>{o.key}</b>
                  <span>{o.text}</span>
                  {correct && <Badge tone="success">{t.result.correctAnswer}</Badge>}
                  {selected && !correct && <Badge tone="danger">{t.result.yourAnswer}</Badge>}
                </li>
              );
            })}
          </ul>
          {q.solution && (
            <div className={scss.solution}>
              <strong>{t.result.solution}:</strong>
              <p>{q.solution}</p>
            </div>
          )}
          <p className={layout.muted}>{t.result.timeSpent(Math.round(q.time_spent_sec))}</p>
          {status !== "correct" && (
            <Button
              size="sm"
              variant="soft"
              className={scss.mt}
              loading={practice.mutation.isPending}
              onClick={() => practice.open({ skillId: q.skill_id })}
            >
              {t.result.practiceSkill}
            </Button>
          )}
          {practice.mutation.isError && (
            <p className={scss.error}>{getErrorMessage(practice.mutation.error, t.errors)}</p>
          )}
        </div>
      )}
    </li>
  );
};

export default Result;
