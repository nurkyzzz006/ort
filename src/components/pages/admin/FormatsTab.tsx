"use client";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { LuPlus, LuX } from "react-icons/lu";
import {
  useCreateExamFormat,
  useCreateScoreScale,
  useGetExamFormats,
  usePublishExamFormat,
  usePublishScoreScale,
  useSetSkillWeights,
  type ExamFormatVersion,
  type ScaleKind,
  type ScalePointIn,
  type ScoreScale,
  type SectionIn,
  type SkillWeightIn,
} from "@/api";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Empty, ErrorState, Skeleton } from "@/components/ui/StateView";
import { pickTitle, useT } from "@/i18n";
import { toMinutes } from "@/i18n/format";
import { useSettings } from "@/settings/SettingsProvider";
import layout from "../sidebar/layout.module.scss";
import { Field, JsonView, MutationStatus } from "./shared";
import SkillSelect from "./SkillSelect";
import { PUBLISH_TONE } from "./TestsTab";
import scss from "./admin.module.scss";

/** Форматы экзамена (blueprint), шкалы raw → балл и веса навыков (ТЗ 4.10, 4.12, 13.4) */
const FormatsTab = () => {
  const t = useT();
  const { locale } = useSettings();
  const formats = useGetExamFormats();
  const publish = usePublishExamFormat();
  const [selected, setSelected] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const active = formats.data?.find((f) => f.id === (selected ?? formats.data?.[0]?.id));

  return (
    <div className={scss.stack}>
      {creating ? (
        <FormatEditor onDone={() => setCreating(false)} />
      ) : (
        <div className={scss.actions}>
          <Button icon={<LuPlus />} onClick={() => setCreating(true)}>
            {t.adm.newFormat}
          </Button>
        </div>
      )}

      <div className={layout.columns}>
        <Card title={t.adm.formats}>
          {formats.isPending ? (
            <Skeleton height={120} />
          ) : formats.isError ? (
            <ErrorState error={formats.error} onRetry={() => formats.refetch()} />
          ) : formats.data.length === 0 ? (
            <Empty title={t.adm.noFormats} />
          ) : (
            formats.data.map((f) => (
              <div key={f.id} className={scss.treeItem}>
                <span>
                  <button type="button" className={layout.link} onClick={() => setSelected(f.id)}>
                    {f.code} v{f.version}
                  </button>{" "}
                  · {pickTitle(f, locale)} · {t.tests.sections(f.sections.length)}
                </span>
                <Badge tone={PUBLISH_TONE[f.status]}>{t.adm.publish[f.status]}</Badge>
                {f.status === "draft" && (
                  <Button
                    size="sm"
                    loading={publish.isPending && publish.variables?.formatVersionId === f.id}
                    onClick={() => publish.mutate({ formatVersionId: f.id })}
                  >
                    {t.adm.doPublish}
                  </Button>
                )}
              </div>
            ))
          )}
          <MutationStatus error={publish.error} />
        </Card>

        {active && (
          <div className={scss.stack}>
            <Card title={`${active.code} v${active.version} · ${t.result.sections}`}>
              {active.sections.map((s) => (
                <div key={s.id} className={scss.treeItem}>
                  <span>
                    <strong>{s.code}</strong> · {pickTitle(s, locale)}
                  </span>
                  <span className={scss.muted}>
                    {t.common.questions(s.question_count)} · {t.common.minutes(toMinutes(s.time_limit_sec))}
                  </span>
                </div>
              ))}
            </Card>
            <ScaleEditor format={active} />
            <WeightsEditor format={active} />
          </div>
        )}
      </div>
    </div>
  );
};

/** Новый формат: разделы экзамена */
const FormatEditor = ({ onDone }: { onDone: () => void }) => {
  const t = useT();
  const create = useCreateExamFormat();
  const { register, control, handleSubmit } = useForm<{
    code: string;
    title_ky: string;
    title_ru: string;
    sections: (Omit<SectionIn, "time_limit_sec"> & { minutes: number })[];
  }>({
    defaultValues: { sections: [{ code: "", title_ky: "", title_ru: "", question_count: 30, minutes: 60 }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "sections" });

  return (
    <Card title={t.adm.newFormat}>
      <form
        className={scss.form}
        onSubmit={handleSubmit((v) =>
          create.mutate(
            {
              code: v.code.trim(),
              title_ky: v.title_ky.trim(),
              title_ru: v.title_ru.trim(),
              sections: v.sections.map((s) => ({
                code: s.code.trim(),
                title_ky: s.title_ky.trim(),
                title_ru: s.title_ru.trim(),
                question_count: Number(s.question_count),
                time_limit_sec: Number(s.minutes) * 60,
              })),
            },
            { onSuccess: onDone },
          ),
        )}
      >
        <Field label={t.adm.code}>
          <input required maxLength={32} placeholder="ort_main" {...register("code", { required: true })} />
        </Field>
        <div />
        <Field label={t.adm.titleKy}>
          <input required maxLength={120} {...register("title_ky", { required: true })} />
        </Field>
        <Field label={t.adm.titleRu}>
          <input required maxLength={120} {...register("title_ru", { required: true })} />
        </Field>

        <div className={scss.fieldWide}>
          <span>{t.result.sections}</span>
          <div className={scss.rows}>
            {fields.map((f, i) => (
              <div key={f.id} className={scss.rowLineWide}>
                <input placeholder={t.adm.code} required {...register(`sections.${i}.code`, { required: true })} />
                <input placeholder={t.adm.titleKy} required {...register(`sections.${i}.title_ky`, { required: true })} />
                <input placeholder={t.adm.titleRu} required {...register(`sections.${i}.title_ru`, { required: true })} />
                <input type="number" min={1} max={300} title={t.practice.questions} {...register(`sections.${i}.question_count`)} />
                <input type="number" min={1} max={360} title={t.adm.minutes} {...register(`sections.${i}.minutes`)} />
                <button type="button" className={scss.iconBtn} aria-label={t.adm.remove} disabled={fields.length <= 1} onClick={() => remove(i)}>
                  <LuX />
                </button>
              </div>
            ))}
          </div>
          <p className={scss.muted}>{t.adm.sectionColumns}</p>
          <Button
            size="sm"
            variant="ghost"
            icon={<LuPlus />}
            onClick={() => append({ code: "", title_ky: "", title_ru: "", question_count: 30, minutes: 60 })}
          >
            {t.adm.addSection}
          </Button>
        </div>

        <div className={`${scss.actions} ${scss.full}`}>
          <Button type="submit" loading={create.isPending}>
            {t.adm.add}
          </Button>
          <Button variant="secondary" onClick={onDone}>
            {t.common.cancel}
          </Button>
        </div>
      </form>
      <MutationStatus error={create.error} />
    </Card>
  );
};

/** Шкала raw → балл по разделам. Список шкал API не отдаёт — публикуем созданную в этой сессии */
const ScaleEditor = ({ format }: { format: ExamFormatVersion }) => {
  const t = useT();
  const create = useCreateScoreScale();
  const publish = usePublishScoreScale();
  const [created, setCreated] = useState<ScoreScale | null>(null);
  const { register, control, handleSubmit } = useForm<{ kind: ScaleKind; source: string; points: ScalePointIn[] }>({
    defaultValues: {
      kind: "estimated",
      source: "",
      points: format.sections.map((s) => ({ section_code: s.code, raw: 0, scaled: 0 })),
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "points" });

  return (
    <Card title={t.adm.scale}>
      <form
        className={scss.form}
        onSubmit={handleSubmit((v) =>
          create.mutate(
            {
              formatVersionId: format.id,
              data: {
                kind: v.kind,
                source: v.source.trim() || null,
                points: v.points.map((p) => ({ section_code: p.section_code, raw: Number(p.raw), scaled: Number(p.scaled) })),
              },
            },
            { onSuccess: setCreated },
          ),
        )}
      >
        <Field label={t.adm.scaleKind}>
          <select {...register("kind")}>
            <option value="estimated">{t.adm.estimatedScale}</option>
            <option value="official">{t.adm.officialScale}</option>
          </select>
        </Field>
        <Field label={t.adm.source}>
          <input {...register("source")} />
        </Field>
        <div className={scss.fieldWide}>
          <span>{t.adm.points}</span>
          <div className={scss.rows}>
            {fields.map((f, i) => (
              <div key={f.id} className={scss.rowLineWide}>
                <select {...register(`points.${i}.section_code`)}>
                  {format.sections.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.code}
                    </option>
                  ))}
                </select>
                <input type="number" min={0} max={300} title="raw" {...register(`points.${i}.raw`)} />
                <input type="number" min={0} max={1000} title={t.common.points} {...register(`points.${i}.scaled`)} />
                <button type="button" className={scss.iconBtn} aria-label={t.adm.remove} onClick={() => remove(i)}>
                  <LuX />
                </button>
              </div>
            ))}
          </div>
          <p className={scss.muted}>{t.adm.pointsHint}</p>
          <Button
            size="sm"
            variant="ghost"
            icon={<LuPlus />}
            onClick={() => append({ section_code: format.sections[0]?.code ?? "", raw: 0, scaled: 0 })}
          >
            {t.adm.addPoint}
          </Button>
        </div>
        <div className={`${scss.actions} ${scss.full}`}>
          <Button type="submit" loading={create.isPending}>
            {t.adm.createScale}
          </Button>
          {created && created.status === "draft" && (
            <Button
              variant="secondary"
              loading={publish.isPending}
              onClick={() => publish.mutate({ scaleId: created.id }, { onSuccess: setCreated })}
            >
              {t.adm.publishScale(created.version)}
            </Button>
          )}
          {created && created.status === "published" && <Badge tone="success">{t.adm.publish.published}</Badge>}
        </div>
      </form>
      <MutationStatus error={create.error ?? publish.error} />
      <p className={scss.muted}>{t.adm.scaleNote}</p>
    </Card>
  );
};

/** Веса навыков по разделам — основа Score ROI (ТЗ 4.12) */
const WeightsEditor = ({ format }: { format: ExamFormatVersion }) => {
  const t = useT();
  const save = useSetSkillWeights();
  const [rows, setRows] = useState<SkillWeightIn[]>([]);
  const [skill, setSkill] = useState("");
  const [section, setSection] = useState(format.sections[0]?.code ?? "");
  const [expected, setExpected] = useState("1");

  return (
    <Card title={t.adm.weights}>
      <div className={scss.form}>
        <SkillSelect value={skill} onChange={setSkill} />
        <Field label={t.adm.section}>
          <select value={section} onChange={(e) => setSection(e.target.value)}>
            {format.sections.map((s) => (
              <option key={s.code} value={s.code}>
                {s.code}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t.adm.expectedQuestions}>
          <input type="number" min={0} max={300} step="0.1" value={expected} onChange={(e) => setExpected(e.target.value)} />
        </Field>
        <div className={`${scss.actions} ${scss.full}`}>
          <Button
            size="sm"
            variant="secondary"
            icon={<LuPlus />}
            disabled={!skill || !section}
            onClick={() =>
              setRows((r) => [
                ...r.filter((x) => !(x.skill_id === skill && x.section_code === section)),
                { skill_id: skill, section_code: section, expected_questions: Number(expected) },
              ])
            }
          >
            {t.adm.addWeight}
          </Button>
        </div>
      </div>
      {rows.length > 0 && <JsonView value={rows} />}
      <div className={scss.actions}>
        <Button
          disabled={rows.length === 0}
          loading={save.isPending}
          onClick={() => save.mutate({ formatVersionId: format.id, data: rows })}
        >
          {t.adm.saveWeights(rows.length)}
        </Button>
      </div>
      <MutationStatus error={save.error} success={save.isSuccess} />
      <p className={scss.muted}>{t.adm.weightsNote}</p>
    </Card>
  );
};

export default FormatsTab;
