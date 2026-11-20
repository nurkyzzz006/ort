"use client";
import { useState } from "react";
import { LuCopyPlus, LuPencil, LuPlus } from "react-icons/lu";
import {
  useCreateQuestion,
  useCreateQuestionVersion,
  useGetAdminQuestions,
  useGetQuestionReviews,
  useGetQuestionVersion,
  useTransitionQuestion,
  useUpdateQuestionVersion,
  type Locale,
  type QuestionStatus,
} from "@/api";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Empty, ErrorState, Skeleton } from "@/components/ui/StateView";
import { useT } from "@/i18n";
import { formatDate } from "@/i18n/format";
import { useSettings } from "@/settings/SettingsProvider";
import roles from "../roles/roles.module.scss";
import layout from "../sidebar/layout.module.scss";
import QuestionForm, { toCreateIn, toUpdateIn } from "./QuestionForm";
import { MutationStatus, NEXT_STATUSES, QUESTION_STATUSES, QUESTION_TONE } from "./shared";
import scss from "./admin.module.scss";

const PAGE = 20;

/** Банк вопросов (ТЗ 7: Question Bank + workflow) */
const QuestionsTab = () => {
  const t = useT();
  const { locale } = useSettings();
  const [status, setStatus] = useState<QuestionStatus | "">("");
  const [language, setLanguage] = useState<Locale | "">("");
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const create = useCreateQuestion();

  const list = useGetAdminQuestions({
    status: status || null,
    language: language || null,
    limit: PAGE,
    offset,
  });

  return (
    <div className={scss.stack}>
      {creating ? (
        <Card title={t.adminPanel.newQuestion}>
          <QuestionForm
            submitLabel={t.adm.createDraft}
            loading={create.isPending}
            onCancel={() => setCreating(false)}
            onSubmit={(v) =>
              create.mutate(toCreateIn(v), {
                onSuccess: (q) => {
                  setCreating(false);
                  setSelected(q.id);
                },
              })
            }
          />
          <MutationStatus error={create.error} />
        </Card>
      ) : (
        <div className={scss.actions}>
          <Button icon={<LuPlus />} onClick={() => setCreating(true)}>
            {t.adminPanel.newQuestion}
          </Button>
        </div>
      )}

      <div className={layout.columns}>
        <Card title={t.adminPanel.bankTitle} padding="none">
          <div className={scss.filters}>
            <select
              aria-label={t.mistakes.filterStatus}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as QuestionStatus | "");
                setOffset(0);
              }}
            >
              <option value="">{t.mistakes.allStatuses}</option>
              {QUESTION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {t.adm.status[s]}
                </option>
              ))}
            </select>
            <select
              aria-label={t.tutor.language}
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value as Locale | "");
                setOffset(0);
              }}
            >
              <option value="">{t.adm.allLanguages}</option>
              <option value="ky">KY</option>
              <option value="ru">RU</option>
            </select>
          </div>

          {list.isPending ? (
            <div className={layout.row}>
              <Skeleton height={200} />
            </div>
          ) : list.isError ? (
            <ErrorState error={list.error} onRetry={() => list.refetch()} />
          ) : list.data.items.length === 0 ? (
            <Empty title={t.adm.noQuestions} />
          ) : (
            <>
              <div className={roles.tableWrap}>
                <table className={roles.table}>
                  <thead>
                    <tr>
                      <th>{t.adm.code}</th>
                      <th>{t.mistakes.columns.question}</th>
                      <th>{t.tutor.language}</th>
                      <th>{t.adm.difficulty}</th>
                      <th>{t.mistakes.columns.status}</th>
                      <th>{t.tests.columns.date}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.data.items.map((q) => (
                      <tr
                        key={q.id}
                        className={`${scss.clickable} ${q.id === selected ? scss.rowActive : ""}`}
                        onClick={() => setSelected(q.id)}
                      >
                        <td className={roles.strong}>
                          {q.code} <small>v{q.version}</small>
                        </td>
                        <td>{q.stem.slice(0, 70)}</td>
                        <td>
                          <Badge>{q.language.toUpperCase()}</Badge>
                        </td>
                        <td>{q.difficulty}</td>
                        <td>
                          <Badge tone={QUESTION_TONE[q.status]}>{t.adm.status[q.status]}</Badge>
                        </td>
                        <td>{formatDate(q.created_at, locale)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={scss.filters}>
                <span className={scss.muted}>
                  {offset + 1}–{offset + list.data.items.length} / {list.data.total}
                </span>
                <Button size="sm" variant="secondary" disabled={offset === 0} onClick={() => setOffset((o) => Math.max(0, o - PAGE))}>
                  {t.common.prev}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={offset + PAGE >= list.data.total}
                  onClick={() => setOffset((o) => o + PAGE)}
                >
                  {t.common.next}
                </Button>
              </div>
            </>
          )}
        </Card>

        {selected ? (
          <QuestionDetail key={selected} versionId={selected} onOpenVersion={setSelected} />
        ) : (
          <Card>
            <Empty title={t.adm.pickQuestion} />
          </Card>
        )}
      </div>
    </div>
  );
};

/** Карточка вопроса: содержимое, переходы workflow, история, правка, новая версия */
const QuestionDetail = ({ versionId, onOpenVersion }: { versionId: string; onOpenVersion: (id: string) => void }) => {
  const t = useT();
  const { locale } = useSettings();
  const q = useGetQuestionVersion(versionId);
  const reviews = useGetQuestionReviews(versionId);
  const transition = useTransitionQuestion();
  const update = useUpdateQuestionVersion();
  const newVersion = useCreateQuestionVersion();
  const [comment, setComment] = useState("");
  const [editing, setEditing] = useState(false);

  if (q.isPending) return <Skeleton height={320} />;
  if (q.isError)
    return (
      <Card>
        <ErrorState error={q.error} onRetry={() => q.refetch()} />
      </Card>
    );

  const v = q.data;
  const canEdit = v.status === "draft";

  return (
    <div className={scss.stack}>
      <Card
        title={`${v.code} · v${v.version}`}
        action={<Badge tone={QUESTION_TONE[v.status]}>{t.adm.status[v.status]}</Badge>}
      >
        {editing ? (
          <>
            <QuestionForm
              initial={v}
              edit
              submitLabel={t.common.save}
              loading={update.isPending}
              onCancel={() => setEditing(false)}
              onSubmit={(values) =>
                update.mutate(
                  { versionId: v.id, data: toUpdateIn(values) },
                  { onSuccess: () => setEditing(false) },
                )
              }
            />
            <MutationStatus error={update.error} />
          </>
        ) : (
          <>
            <p className={scss.stem}>{v.stem}</p>
            <ul className={scss.options}>
              {v.options.map((o) => (
                <li key={o.id} className={o.is_correct ? scss.optCorrect : ""}>
                  <b>{o.key}</b>
                  {o.text}
                </li>
              ))}
            </ul>
            {v.solution && (
              <p className={scss.muted}>
                <strong>{t.result.solution}:</strong> {v.solution}
              </p>
            )}
            <p className={scss.muted}>
              {v.language.toUpperCase()} · {t.adm.difficulty}: {v.difficulty}
              {v.source && ` · ${t.adm.source}: ${v.source}`}
              {v.license && ` · ${v.license}`}
            </p>
            <div className={scss.actions}>
              {canEdit && (
                <Button size="sm" variant="secondary" icon={<LuPencil />} onClick={() => setEditing(true)}>
                  {t.adm.edit}
                </Button>
              )}
              {!canEdit && (
                <Button
                  size="sm"
                  variant="secondary"
                  icon={<LuCopyPlus />}
                  loading={newVersion.isPending}
                  onClick={() => newVersion.mutate({ versionId: v.id }, { onSuccess: (nv) => onOpenVersion(nv.id) })}
                >
                  {t.adm.newVersion}
                </Button>
              )}
            </div>
            <MutationStatus error={newVersion.error} />
            {v.status === "published" && <p className={scss.muted}>{t.adm.publishedImmutable}</p>}
          </>
        )}
      </Card>

      {NEXT_STATUSES[v.status].length > 0 && (
        <Card title={t.adm.workflow}>
          <label className={scss.fieldWide}>
            <span>{t.adm.comment}</span>
            <input value={comment} onChange={(e) => setComment(e.target.value)} />
          </label>
          <div className={`${scss.actions} ${roles.mt}`}>
            {NEXT_STATUSES[v.status].map((to) => (
              <Button
                key={to}
                size="sm"
                variant={to === "draft" || to === "retired" ? "danger" : "primary"}
                loading={transition.isPending && transition.variables?.data.to === to}
                disabled={transition.isPending}
                onClick={() =>
                  transition.mutate(
                    { versionId: v.id, data: { to, comment: comment.trim() || null } },
                    { onSuccess: () => setComment("") },
                  )
                }
              >
                {to === "draft" ? t.adm.returnToDraft : `→ ${t.adm.status[to]}`}
              </Button>
            ))}
          </div>
          <MutationStatus error={transition.error} success={transition.isSuccess} />
          <p className={scss.muted}>{t.adminPanel.auditNote}</p>
        </Card>
      )}

      <Card title={t.adm.history}>
        {reviews.isPending ? (
          <Skeleton height={60} />
        ) : reviews.isError ? (
          <ErrorState error={reviews.error} onRetry={() => reviews.refetch()} />
        ) : reviews.data.length === 0 ? (
          <p className={scss.muted}>{t.adm.noHistory}</p>
        ) : (
          <ul className={scss.history}>
            {reviews.data.map((r, i) => (
              <li key={i}>
                <strong>
                  {r.from_status} → {r.to_status}
                </strong>{" "}
                · {formatDate(r.created_at, locale)}
                {r.comment && <p className={scss.muted}>{r.comment}</p>}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default QuestionsTab;
