"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  LuArrowRight,
  LuBookOpen,
  LuCheck,
  LuCircleCheck,
  LuCircleX,
  LuSparkles,
  LuTarget,
} from "react-icons/lu";
import {
  getErrorMessage,
  useAnswerPractice,
  useFinishPractice,
  useGetPractice,
  useGetStatsSkills,
  useGetSubjects,
  useGetSubjectTopics,
  type PracticeSession,
  type TopicNode,
} from "@/api";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import { ProgressBar } from "@/components/ui/Progress";
import Segmented from "@/components/ui/Segmented";
import { Empty, ErrorState, Loader, Skeleton } from "@/components/ui/StateView";
import { pickTitle, useT } from "@/i18n";
import { toRatio } from "@/i18n/format";
import { nowMs, secondsSince } from "@/i18n/time";
import { useSettings } from "@/settings/SettingsProvider";
import { useOpenPractice } from "./actions";
import layout from "./layout.module.scss";
import scss from "./Practice.module.scss";

const COUNTS = [5, 10, 20, 30];

/** Swagger описывает status как string без перечня — проверяем явные признаки завершения */
const isFinished = (status: string) => /finish|complet|done|closed/i.test(status);

/** Тематическая практика (макет: стр. 5; ТЗ 4.3) */
const Practice = () => {
  const t = useT();
  const sessionId = useSearchParams().get("session");
  const [count, setCount] = useState(10);

  return (
    <>
      <PageHeader
        title={t.practice.title}
        subtitle={t.practice.subtitle}
        actions={
          <label className={scss.countPicker}>
            {t.practice.count}
            <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
              {COUNTS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        }
      />

      <div className={layout.columnsWide}>
        <div className={layout.stack}>
          <TopicsCard count={count} />
          {sessionId && <SessionStatsCard sessionId={sessionId} />}
        </div>
        {sessionId ? (
          <PracticeSessionView key={sessionId} sessionId={sessionId} count={count} />
        ) : (
          <Card>
            <Empty icon={<LuTarget />} title={t.practice.pickTitle} text={t.practice.pickText} />
          </Card>
        )}
      </div>
    </>
  );
};

/** Дерево «предмет → тема → навык» с уровнем освоения */
const TopicsCard = ({ count }: { count: number }) => {
  const t = useT();
  const { locale } = useSettings();
  const subjects = useGetSubjects();
  const [subjectId, setSubjectId] = useState<string | undefined>();
  const activeSubject = subjectId ?? subjects.data?.[0]?.id;
  const topics = useGetSubjectTopics(activeSubject);
  const stats = useGetStatsSkills();
  const practice = useOpenPractice();

  const mastery = useMemo(
    () => new Map(stats.data?.map((s) => [s.skill_id, toRatio(s.mastery)]) ?? []),
    [stats.data],
  );

  const open = (skillId: string) => practice.open({ skillId, count });

  // Вложенность задаётся CSS (ul ul), без inline-отступов
  const renderTopic = (node: TopicNode) => (
    <li key={node.id}>
      <p className={scss.topic}>{pickTitle(node, locale)}</p>
      {(node.skills ?? []).length > 0 && (
        <ul>
          {node.skills?.map((s) => {
            const m = mastery.get(s.id);
            return (
              <li key={s.id}>
                <button
                  type="button"
                  className={scss.skill}
                  disabled={practice.mutation.isPending}
                  onClick={() => open(s.id)}
                >
                  <LuTarget aria-hidden />
                  <span>{pickTitle(s, locale)}</span>
                  <small>{m != null ? `${Math.round(m * 100)}%` : t.practice.new}</small>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {(node.children ?? []).length > 0 && <ul>{node.children?.map((c) => renderTopic(c))}</ul>}
    </li>
  );

  return (
    <Card title={t.practice.topics}>
      {subjects.isPending ? (
        <Skeleton height={160} />
      ) : subjects.isError ? (
        <ErrorState error={subjects.error} onRetry={() => subjects.refetch()} />
      ) : subjects.data.length === 0 ? (
        <Empty icon={<LuBookOpen />} title={t.practice.noSubjects} />
      ) : (
        <>
          {subjects.data.length > 1 && (
            <div className={scss.subjects}>
              <Segmented
                variant="pills"
                ariaLabel={t.practice.subject}
                value={activeSubject ?? ""}
                onChange={setSubjectId}
                options={subjects.data.map((s) => ({ value: s.id, label: pickTitle(s, locale) }))}
              />
            </div>
          )}
          {topics.isPending ? (
            <Skeleton height={160} />
          ) : topics.isError ? (
            <ErrorState error={topics.error} onRetry={() => topics.refetch()} />
          ) : topics.data.length === 0 ? (
            <p className={layout.muted}>{t.practice.noTopics}</p>
          ) : (
            <ul className={scss.tree}>{topics.data.map((n) => renderTopic(n))}</ul>
          )}
        </>
      )}
      {practice.mutation.isError && (
        <p className={scss.error} role="alert">
          {getErrorMessage(practice.mutation.error, t.errors)}
        </p>
      )}
    </Card>
  );
};

/** Сводка сессии: прогресс, правильные, ошибки, завершение */
const SessionStatsCard = ({ sessionId }: { sessionId: string }) => {
  const t = useT();
  const practice = useGetPractice(sessionId);
  const finish = useFinishPractice();
  const p = practice.data;
  if (!p) return null;
  const finished = isFinished(p.status);

  return (
    <Card title={t.practice.session}>
      <div className={layout.row}>
        <span>{t.practice.questions}</span>
        <strong>
          {p.answered} / {p.total}
        </strong>
      </div>
      <ProgressBar value={p.total ? p.answered / p.total : 0} />
      <div className={layout.row}>
        <span>{t.practice.correct}</span>
        <strong className={scss.good}>{p.correct}</strong>
      </div>
      <div className={layout.row}>
        <span>{t.practice.wrong}</span>
        <strong className={scss.bad}>{p.answered - p.correct}</strong>
      </div>
      {!finished && (
        <Button
          variant="secondary"
          fullWidth
          className={scss.mt}
          loading={finish.isPending}
          onClick={() => finish.mutate({ sessionId })}
        >
          {t.practice.finish}
        </Button>
      )}
      {finish.isError && <p className={scss.error}>{getErrorMessage(finish.error, t.errors)}</p>}
    </Card>
  );
};

/** Вопрос практики с мгновенной проверкой */
const PracticeSessionView = ({ sessionId, count }: { sessionId: string; count: number }) => {
  const t = useT();
  const router = useRouter();
  const practice = useGetPractice(sessionId);
  const answer = useAnswerPractice();
  const finish = useFinishPractice();
  const again = useOpenPractice();

  // Первый неотвеченный вопрос; после ответа остаёмся на нём, пока не нажмут «Кийинки»
  const [index, setIndex] = useState<number | null>(null);
  const shownAt = useRef(0);

  const questions = practice.data?.questions ?? [];
  const firstOpen = questions.findIndex((q) => q.feedback === null);
  const current = questions[index ?? (firstOpen === -1 ? questions.length - 1 : firstOpen)];

  useEffect(() => {
    shownAt.current = nowMs();
  }, [current?.id]);

  if (practice.isPending) return <Loader />;
  if (practice.isError)
    return (
      <Card>
        <ErrorState error={practice.error} onRetry={() => practice.refetch()} />
      </Card>
    );

  const p: PracticeSession = practice.data;
  if (!current || firstOpen === -1) {
    return (
      <PracticeSummary
        practice={p}
        onAgain={() => again.open({ skillId: p.skill_id, topicId: p.topic_id, count })}
      />
    );
  }

  const fb = current.feedback;
  const pos = questions.indexOf(current);

  const choose = (optionId: string) => {
    if (fb || answer.isPending) return;
    setIndex(pos); // фиксируем вопрос, чтобы показать проверку
    answer.mutate({
      sessionId,
      questionId: current.id,
      data: { option_id: optionId, time_spent_sec: secondsSince(shownAt.current) },
    });
  };

  const next = () => {
    const nextOpen = questions.findIndex((q, i) => i > pos && q.feedback === null);
    setIndex(nextOpen === -1 ? null : nextOpen);
  };

  return (
    <Card className={scss.question}>
      <div className={scss.qTop}>
        <p className={layout.muted}>
          {pos + 1} / {p.total}
        </p>
        {fb && (
          <Badge tone={fb.is_correct ? "success" : "danger"}>
            {fb.is_correct ? t.practice.right : t.practice.notRight}
          </Badge>
        )}
      </div>

      <p className={scss.stem}>{current.stem}</p>

      <div className={scss.options} role="radiogroup" aria-label={t.exam.options}>
        {current.options.map((o) => {
          const isCorrect = fb?.correct_option_id === o.id;
          const isWrongPick = fb && fb.selected_option_id === o.id && !fb.is_correct;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={fb?.selected_option_id === o.id}
              disabled={Boolean(fb) || answer.isPending}
              className={[scss.option, isCorrect ? scss.optCorrect : "", isWrongPick ? scss.optWrong : ""].join(" ")}
              onClick={() => choose(o.id)}
            >
              <span className={scss.key}>{o.key}</span>
              <span className={scss.optionText}>{o.text}</span>
              {isCorrect && <span className={scss.tagGood}>{t.practice.right}</span>}
              {isWrongPick && <span className={scss.tagBad}>{t.practice.yourAnswer}</span>}
            </button>
          );
        })}
      </div>

      {answer.isError && (
        <p className={scss.error} role="alert">
          {getErrorMessage(answer.error, t.errors)}
        </p>
      )}

      {fb && (
        <>
          <div className={[scss.feedback, fb.is_correct ? scss.fbGood : scss.fbBad].join(" ")}>
            {fb.is_correct ? <LuCircleCheck aria-hidden /> : <LuCircleX aria-hidden />}
            <p>{fb.is_correct ? t.practice.wellDone : t.practice.mistakeLogged}</p>
          </div>
          {fb.solution && (
            <div className={scss.solution}>
              <strong>{t.result.solution}:</strong>
              <p>{fb.solution}</p>
            </div>
          )}
          <div className={scss.actions}>
            <Button
              icon={<LuSparkles />}
              onClick={() =>
                router.push(
                  `/dashboard/aiteacher?q=${encodeURIComponent(current.question_version_id)}&session=${encodeURIComponent(sessionId)}`,
                )
              }
            >
              {t.practice.askTutor}
            </Button>
            <Button
              variant="secondary"
              loading={again.mutation.isPending}
              onClick={() => again.open({ skillId: current.skill_id, count })}
            >
              {t.practice.similar}
            </Button>
            <span className={scss.spacer} />
            <Button variant="dark" iconRight={<LuArrowRight />} onClick={next}>
              {questions.some((q, i) => i > pos && q.feedback === null)
                ? t.exam.next
                : t.practice.toSummary}
            </Button>
          </div>
        </>
      )}

      {finish.isError && <p className={scss.error}>{getErrorMessage(finish.error, t.errors)}</p>}
    </Card>
  );
};

/** Итог сессии практики (ТЗ 4.3: сводка после завершения) */
const PracticeSummary = ({ practice, onAgain }: { practice: PracticeSession; onAgain: () => void }) => {
  const t = useT();
  const finish = useFinishPractice();
  const finished = isFinished(practice.status);
  const accuracy = practice.answered ? practice.correct / practice.answered : 0;

  return (
    <Card>
      <div className={scss.summary}>
        <span className={scss.summaryIcon} aria-hidden>
          <LuCheck />
        </span>
        <h2>{t.practice.summaryTitle}</h2>
        <p className={layout.muted}>
          {t.practice.summaryText(practice.correct, practice.answered, Math.round(accuracy * 100))}
        </p>
        <div className={scss.summaryActions}>
          {!finished && (
            <Button
              variant="secondary"
              loading={finish.isPending}
              onClick={() => finish.mutate({ sessionId: practice.id })}
            >
              {t.practice.finish}
            </Button>
          )}
          <Button onClick={onAgain}>{t.practice.again}</Button>
          <Button href="/dashboard/wrongs" variant="soft">
            {t.practice.toMistakes}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Practice;
