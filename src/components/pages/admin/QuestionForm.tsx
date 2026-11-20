"use client";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { LuPlus, LuX } from "react-icons/lu";
import type { Locale, OptionIn, QuestionAdmin, QuestionCreateIn, QuestionUpdateIn } from "@/api";
import Button from "@/components/ui/Button";
import { useT } from "@/i18n";
import { Field } from "./shared";
import SkillSelect from "./SkillSelect";
import scss from "./admin.module.scss";

export interface QuestionFormValues {
  language: Locale;
  skill_id: string;
  stem: string;
  options: OptionIn[];
  correct: number; // индекс правильного варианта
  solution: string;
  difficulty: number;
  estimated_time_sec: string;
  source: string;
  license: string;
}

const KEYS = ["A", "B", "C", "D", "E", "F"];

export const toFormValues = (q?: QuestionAdmin): QuestionFormValues => ({
  language: q?.language ?? "ky",
  skill_id: q?.skill_id ?? "",
  stem: q?.stem ?? "",
  options: q?.options.map((o) => ({ key: o.key, text: o.text })) ?? KEYS.slice(0, 4).map((key) => ({ key, text: "" })),
  correct: Math.max(0, q?.options.findIndex((o) => o.is_correct) ?? 0),
  solution: q?.solution ?? "",
  difficulty: q?.difficulty ?? 3,
  estimated_time_sec: q?.estimated_time_sec ? String(q.estimated_time_sec) : "",
  source: q?.source ?? "",
  license: q?.license ?? "",
});

const options = (v: QuestionFormValues): OptionIn[] =>
  v.options.map((o, i) => ({ key: o.key, text: o.text.trim(), is_correct: i === Number(v.correct) }));

const optional = (s: string) => (s.trim() ? s.trim() : null);

export const toCreateIn = (v: QuestionFormValues): QuestionCreateIn => ({
  language: v.language,
  skill_id: v.skill_id || null,
  stem: v.stem.trim(),
  options: options(v),
  solution: optional(v.solution),
  difficulty: Number(v.difficulty),
  estimated_time_sec: v.estimated_time_sec ? Number(v.estimated_time_sec) : null,
  source: optional(v.source),
  license: optional(v.license),
});

/** QuestionUpdateIn: язык и навык при правке не передаются */
export const toUpdateIn = (v: QuestionFormValues): QuestionUpdateIn => {
  const c = toCreateIn(v);
  return {
    stem: c.stem,
    options: c.options,
    solution: c.solution,
    difficulty: c.difficulty,
    estimated_time_sec: c.estimated_time_sec,
    source: c.source,
    license: c.license,
  };
};

interface QuestionFormProps {
  initial?: QuestionAdmin;
  /** Режим правки: язык и навык не меняются (их нет в QuestionUpdateIn) */
  edit?: boolean;
  submitLabel: string;
  loading: boolean;
  onSubmit: (values: QuestionFormValues) => void;
  onCancel?: () => void;
}

/** Форма вопроса: текст, варианты с правильным ответом, решение (ТЗ 8) */
const QuestionForm = ({ initial, edit, submitLabel, loading, onSubmit, onCancel }: QuestionFormProps) => {
  const t = useT();
  const { register, control, handleSubmit, setValue } = useForm<QuestionFormValues>({
    defaultValues: toFormValues(initial),
  });
  const { fields, append, remove } = useFieldArray({ control, name: "options" });
  const skillId = useWatch({ control, name: "skill_id" });

  return (
    <form className={scss.form} onSubmit={handleSubmit(onSubmit)}>
      {!edit && (
        <>
          <Field label={t.tutor.language}>
            <select {...register("language")}>
              <option value="ky">Кыргызча</option>
              <option value="ru">Русский</option>
            </select>
          </Field>
          <div />
          <SkillSelect value={skillId} onChange={(id) => setValue("skill_id", id)} required />
        </>
      )}

      <Field label={t.adm.stem} wide>
        <textarea required maxLength={10000} {...register("stem", { required: true })} />
      </Field>

      <div className={`${scss.fieldWide}`}>
        <span>{t.adm.options}</span>
        <div className={scss.rows}>
          {fields.map((f, i) => (
            <div key={f.id} className={scss.rowLine}>
              <label className={scss.correct} title={t.adm.correctOption}>
                <input type="radio" value={i} {...register("correct")} />
                {f.key}
              </label>
              <input required maxLength={2000} {...register(`options.${i}.text`, { required: true })} />
              <button
                type="button"
                className={scss.iconBtn}
                aria-label={t.adm.removeOption}
                disabled={fields.length <= 2}
                onClick={() => remove(i)}
              >
                <LuX />
              </button>
            </div>
          ))}
        </div>
        {fields.length < KEYS.length && (
          <Button
            size="sm"
            variant="ghost"
            icon={<LuPlus />}
            onClick={() => append({ key: KEYS[fields.length], text: "" })}
          >
            {t.adm.addOption}
          </Button>
        )}
        <p className={scss.muted}>{t.adm.correctHint}</p>
      </div>

      <Field label={t.result.solution} wide>
        <textarea {...register("solution")} />
      </Field>
      <Field label={t.adm.difficulty}>
        <select {...register("difficulty")}>
          {[1, 2, 3, 4, 5].map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </Field>
      <Field label={t.adm.timeSec}>
        <input type="number" min={1} {...register("estimated_time_sec")} />
      </Field>
      <Field label={t.adm.source}>
        <input {...register("source")} />
      </Field>
      <Field label={t.adm.license}>
        <input {...register("license")} />
      </Field>

      <div className={`${scss.actions} ${scss.full}`}>
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
        {onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            {t.common.cancel}
          </Button>
        )}
      </div>
    </form>
  );
};

export default QuestionForm;
