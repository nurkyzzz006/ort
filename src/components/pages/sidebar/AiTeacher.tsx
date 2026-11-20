"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { LuFlag, LuShieldCheck, LuSparkles, LuTarget } from "react-icons/lu";
import {
  getErrorMessage,
  useExplainQuestion,
  useGetPractice,
  useReportQuestion,
  type ExplainQuestionResponse,
  type TutorMode,
} from "@/api";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import Segmented from "@/components/ui/Segmented";
import { Empty } from "@/components/ui/StateView";
import { useT } from "@/i18n";
import { useSettings } from "@/settings/SettingsProvider";
import layout from "./layout.module.scss";
import scss from "./AiTeacher.module.scss";

const MODES: TutorMode[] = ["short", "detailed", "example"];

/** Тип жалобы — свободная строка в Swagger; значения нужно согласовать с бэкендом */
const REPORT_KIND = "explanation_unclear";

interface Message {
  mode: TutorMode;
  response: ExplainQuestionResponse;
}

/** AI-мугалим (макет: стр. 8; ТЗ 5): объясняет проверенное решение */
const AiTeacher = () => {
  const t = useT();
  const params = useSearchParams();
  const questionVersionId = params.get("q");
  const sessionId = params.get("session");

  return (
    <>
      <PageHeader
        title={t.tutor.title}
        subtitle={t.tutor.subtitle}
        actions={
          <Badge tone="success" icon={<LuShieldCheck />}>
            {t.tutor.verified}
          </Badge>
        }
      />
      {questionVersionId ? (
        <TutorChat key={questionVersionId} questionVersionId={questionVersionId} sessionId={sessionId} />
      ) : (
        <Card>
          <Empty
            icon={<LuSparkles />}
            title={t.tutor.pickTitle}
            text={t.tutor.pickText}
            action={
              <Button href="/dashboard/practice" icon={<LuTarget />}>
                {t.tutor.goPractice}
              </Button>
            }
          />
        </Card>
      )}
    </>
  );
};

const TutorChat = ({
  questionVersionId,
  sessionId,
}: {
  questionVersionId: string;
  sessionId: string | null;
}) => {
  const t = useT();
  const { locale } = useSettings();
  const [mode, setMode] = useState<TutorMode>("short");
  const [messages, setMessages] = useState<Message[]>([]);
  const explain = useExplainQuestion();
  const report = useReportQuestion();

  // Контекст вопроса — из сессии практики, если она известна
  const practice = useGetPractice(sessionId ?? undefined);
  const question = practice.data?.questions.find((q) => q.question_version_id === questionVersionId);
  const last = messages[messages.length - 1]?.response;

  const ask = () =>
    explain.mutate(
      { question_version_id: questionVersionId, mode },
      { onSuccess: (response) => setMessages((m) => [...m, { mode, response }]) },
    );

  return (
    <div className={layout.columns}>
      <Card>
        <Segmented
          ariaLabel={t.tutor.mode}
          value={mode}
          onChange={setMode}
          options={MODES.map((m) => ({ value: m, label: t.tutor.modes[m] }))}
        />

        <div className={scss.chat} aria-live="polite">
          {question && (
            <div className={scss.userMsg}>
              <p>{t.tutor.explainThis}</p>
              <p className={scss.quote}>{question.stem}</p>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={scss.aiMsg}>
              <span className={scss.avatar} aria-hidden>
                AI
              </span>
              <div className={scss.bubble}>
                <p className={scss.modeTag}>{t.tutor.modes[m.mode]}</p>
                <p className={scss.content}>{m.response.content}</p>
                <span className={scss.source}>
                  <LuShieldCheck aria-hidden />
                  {/* ТЗ 5.1: source — проверенное решение или текст ИИ; значения в Swagger не перечислены */}
                  {t.tutor.source}: {m.response.source}
                  {m.response.cached && ` · ${t.tutor.fromCache}`}
                </span>
              </div>
            </div>
          ))}

          {messages.length === 0 && !explain.isPending && (
            <p className={layout.muted}>{t.tutor.hint}</p>
          )}
        </div>

        {explain.isError && (
          <p className={scss.error} role="alert">
            {getErrorMessage(explain.error, t.errors)}
          </p>
        )}

        <div className={scss.composer}>
          <Button icon={<LuSparkles />} loading={explain.isPending} onClick={ask}>
            {messages.length ? t.tutor.askAgain : t.tutor.ask}
          </Button>
          <button
            type="button"
            className={scss.report}
            disabled={report.isPending || report.isSuccess}
            onClick={() =>
              report.mutate({
                question_version_id: questionVersionId,
                kind: REPORT_KIND,
                comment: last ? `mode=${messages[messages.length - 1].mode}` : null,
              })
            }
          >
            <LuFlag aria-hidden />
            {report.isSuccess ? t.tutor.reported : t.tutor.reportWrong}
          </button>
        </div>
        {report.isError && <p className={scss.error}>{getErrorMessage(report.error, t.errors)}</p>}
        <p className={scss.disclaimer}>{t.tutor.disclaimer}</p>
      </Card>

      <div className={layout.stack}>
        <Card title={t.tutor.context}>
          <div className={layout.row}>
            <span>{t.tutor.question}</span>
            <strong>{question ? `№${question.position}` : questionVersionId.slice(0, 8)}</strong>
          </div>
          <div className={layout.row}>
            <span>{t.tutor.language}</span>
            <strong>{locale === "ru" ? "Русский" : "Кыргызча"}</strong>
          </div>
          <div className={layout.row}>
            <span>{t.tutor.mode}</span>
            <strong>{t.tutor.modes[mode]}</strong>
          </div>
          {question?.feedback && (
            <Badge tone={question.feedback.is_correct ? "success" : "danger"}>
              {question.feedback.is_correct ? t.practice.right : t.practice.notRight}
            </Badge>
          )}
        </Card>

        <Card title={t.tutor.limits}>
          <div className={layout.row}>
            <span>{t.tutor.remaining}</span>
            <strong>{last ? last.remaining_today : "—"}</strong>
          </div>
          <div className={layout.row}>
            <span>{t.tutor.cached}</span>
            <strong>{last ? (last.cached ? t.common.yes : t.common.no) : "—"}</strong>
          </div>
          <p className={layout.muted}>{t.tutor.limitsNote}</p>
        </Card>
      </div>
    </div>
  );
};

export default AiTeacher;
