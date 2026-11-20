"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LuCheck, LuPencil, LuPlus } from "react-icons/lu";
import {
  useCreateTest,
  useGetAdminSubjects,
  useGetAdminTests,
  useGetExamFormats,
  usePublishTest,
  useReplaceTest,
  useRetireTest,
  useValidateTest,
  type Locale,
  type PublishStatus,
  type TestAdmin,
  type TestIn,
  type TestKind,
} from "@/api";
import Badge, { type BadgeTone } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Empty, ErrorState, Skeleton } from "@/components/ui/StateView";
import { pickTitle, useT } from "@/i18n";
import { toMinutes } from "@/i18n/format";
import { useSettings } from "@/settings/SettingsProvider";
import roles from "../roles/roles.module.scss";
import { Field, MutationStatus } from "./shared";
import scss from "./admin.module.scss";

export const PUBLISH_TONE: Record<PublishStatus, BadgeTone> = {
  draft: "warning",
  published: "success",
  retired: "neutral",
};

const KINDS: TestKind[] = ["mock", "section", "diagnostic", "mini", "subject"];

interface TestForm {
  code: string;
  title_ky: string;
  title_ru: string;
  kind: TestKind;
  language: Locale;
  subject_id: string;
  format_version_id: string;
  minutes: string;
  questions: string; // «id» или «id;раздел;баллы» по строке
}

const parseQuestions = (text: string): TestIn["questions"] =>
  text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [id, section, points] = line.split(";").map((p) => p.trim());
      return {
        question_version_id: id,
        section_code: section || null,
        ...(points ? { points: Number(points) } : {}),
      };
    });

/** Тесты: конструктор, проверка по blueprint, публикация (ТЗ 7.1 Test Builder) */
const TestsTab = () => {
  const t = useT();
  const { locale } = useSettings();
  const tests = useGetAdminTests();
  const publish = usePublishTest();
  const retire = useRetireTest();
  const [editing, setEditing] = useState<TestAdmin | "new" | null>(null);
  const [validating, setValidating] = useState<string | null>(null);

  return (
    <div className={scss.stack}>
      {editing ? (
        <TestEditor test={editing === "new" ? null : editing} onDone={() => setEditing(null)} />
      ) : (
        <div className={scss.actions}>
          <Button icon={<LuPlus />} onClick={() => setEditing("new")}>
            {t.adm.newTest}
          </Button>
        </div>
      )}

      <Card title={t.tests.title} padding="none">
        {tests.isPending ? (
          <Skeleton height={160} />
        ) : tests.isError ? (
          <ErrorState error={tests.error} onRetry={() => tests.refetch()} />
        ) : tests.data.length === 0 ? (
          <Empty title={t.tests.emptyTitle} />
        ) : (
          <div className={roles.tableWrap}>
            <table className={roles.table}>
              <thead>
                <tr>
                  <th>{t.adm.code}</th>
                  <th>{t.tests.columns.test}</th>
                  <th>{t.adm.kind}</th>
                  <th>{t.tutor.language}</th>
                  <th>{t.practice.questions}</th>
                  <th>{t.mistakes.columns.status}</th>
                  <th>
                    <span className="sr-only">{t.tests.columns.action}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {tests.data.map((x) => (
                  <tr key={x.id}>
                    <td className={roles.strong}>
                      {x.code} <small>v{x.version}</small>
                    </td>
                    <td>
                      {pickTitle(x, locale)}
                      {x.time_limit_sec && <small> · {t.common.minutes(toMinutes(x.time_limit_sec))}</small>}
                    </td>
                    <td>{t.tests.kinds[x.kind]}</td>
                    <td>{x.language.toUpperCase()}</td>
                    <td>{x.question_count}</td>
                    <td>
                      <Badge tone={PUBLISH_TONE[x.status]}>{t.adm.publish[x.status]}</Badge>
                    </td>
                    <td>
                      <div className={scss.actions}>
                        <Button size="sm" variant="ghost" icon={<LuCheck />} onClick={() => setValidating(x.id)}>
                          {t.adm.validate}
                        </Button>
                        {x.status === "draft" && (
                          <>
                            <Button size="sm" variant="ghost" icon={<LuPencil />} onClick={() => setEditing(x)}>
                              {t.adm.edit}
                            </Button>
                            <Button
                              size="sm"
                              loading={publish.isPending && publish.variables?.testId === x.id}
                              onClick={() => publish.mutate({ testId: x.id })}
                            >
                              {t.adm.doPublish}
                            </Button>
                          </>
                        )}
                        {x.status === "published" && (
                          <Button
                            size="sm"
                            variant="danger"
                            loading={retire.isPending && retire.variables?.testId === x.id}
                            onClick={() => retire.mutate({ testId: x.id })}
                          >
                            {t.adm.retire}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className={scss.filters}>
          <MutationStatus error={publish.error ?? retire.error} />
        </div>
      </Card>

      {validating && <ValidationCard testId={validating} />}
    </div>
  );
};

/** Проверка теста перед публикацией: разделы, количество, покрытие (ТЗ 7.2) */
const ValidationCard = ({ testId }: { testId: string }) => {
  const t = useT();
  const v = useValidateTest(testId, { staleTime: 0 });
  return (
    <Card title={t.adm.validation}>
      {v.isPending ? (
        <Skeleton height={60} />
      ) : v.isError ? (
        <ErrorState error={v.error} onRetry={() => v.refetch()} />
      ) : v.data.valid ? (
        <p className={scss.ok}>{t.adm.valid}</p>
      ) : (
        <>
          <p className={scss.error}>{t.adm.invalid}</p>
          <ul className={scss.problems}>
            {v.data.problems.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
};

/** Создание (POST) или полная замена (PUT) теста */
const TestEditor = ({ test, onDone }: { test: TestAdmin | null; onDone: () => void }) => {
  const t = useT();
  const { locale } = useSettings();
  const subjects = useGetAdminSubjects();
  const formats = useGetExamFormats();
  const create = useCreateTest();
  const replace = useReplaceTest();
  const { register, handleSubmit } = useForm<TestForm>({
    defaultValues: {
      code: test?.code ?? "",
      title_ky: test?.title_ky ?? "",
      title_ru: test?.title_ru ?? "",
      kind: test?.kind ?? "mock",
      language: test?.language ?? "ky",
      subject_id: test?.subject_id ?? "",
      format_version_id: test?.format_version_id ?? "",
      minutes: test?.time_limit_sec ? String(toMinutes(test.time_limit_sec)) : "",
      questions: "",
    },
  });

  const onSubmit = (v: TestForm) => {
    const data: TestIn = {
      code: v.code.trim(),
      title_ky: v.title_ky.trim(),
      title_ru: v.title_ru.trim(),
      kind: v.kind,
      language: v.language,
      subject_id: v.subject_id || null,
      format_version_id: v.format_version_id || null,
      time_limit_sec: v.minutes ? Number(v.minutes) * 60 : null,
      questions: parseQuestions(v.questions),
    };
    if (test) replace.mutate({ testId: test.id, data }, { onSuccess: onDone });
    else create.mutate(data, { onSuccess: onDone });
  };

  return (
    <Card title={test ? `${t.adm.edit}: ${test.code}` : t.adm.newTest}>
      <form className={scss.form} onSubmit={handleSubmit(onSubmit)}>
        <Field label={t.adm.code}>
          <input required maxLength={32} {...register("code", { required: true })} />
        </Field>
        <Field label={t.adm.kind}>
          <select {...register("kind")}>
            {KINDS.map((k) => (
              <option key={k} value={k}>
                {t.tests.kinds[k]}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t.adm.titleKy}>
          <input required maxLength={160} {...register("title_ky", { required: true })} />
        </Field>
        <Field label={t.adm.titleRu}>
          <input required maxLength={160} {...register("title_ru", { required: true })} />
        </Field>
        <Field label={t.tutor.language}>
          <select {...register("language")}>
            <option value="ky">Кыргызча</option>
            <option value="ru">Русский</option>
          </select>
        </Field>
        <Field label={t.adm.minutes}>
          <input type="number" min={1} {...register("minutes")} />
        </Field>
        <Field label={t.practice.subject}>
          <select {...register("subject_id")}>
            <option value="">— ({t.tests.mainExam})</option>
            {subjects.data?.map((s) => (
              <option key={s.id} value={s.id}>
                {pickTitle(s, locale)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t.adm.format}>
          <select {...register("format_version_id")}>
            <option value="">—</option>
            {formats.data?.map((f) => (
              <option key={f.id} value={f.id}>
                {f.code} v{f.version} · {t.adm.publish[f.status]}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t.adm.testQuestions} wide>
          <textarea placeholder={t.adm.testQuestionsPlaceholder} {...register("questions")} />
        </Field>
        <p className={`${scss.muted} ${scss.full}`}>
          {t.adm.testQuestionsHint}
          {test && ` ${t.adm.replaceWarning}`}
        </p>
        <div className={`${scss.actions} ${scss.full}`}>
          <Button type="submit" loading={create.isPending || replace.isPending}>
            {test ? t.common.save : t.adm.add}
          </Button>
          <Button variant="secondary" onClick={onDone}>
            {t.common.cancel}
          </Button>
        </div>
      </form>
      <MutationStatus error={create.error ?? replace.error} />
    </Card>
  );
};

export default TestsTab;
