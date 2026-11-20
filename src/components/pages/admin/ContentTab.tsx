"use client";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { LuUpload } from "react-icons/lu";
import {
  useAddUniversityProgram,
  useImportQuestions,
  useUpdateUniversityProgram,
  useUploadMedia,
  useUpsertUniversity,
  type ProgramIn,
  type UniversityIn,
} from "@/api";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useT } from "@/i18n";
import roles from "../roles/roles.module.scss";
import { Field, JsonView, MutationStatus, str } from "./shared";
import scss from "./admin.module.scss";

/** Импорт, медиа, справочник вузов (ТЗ 7.1 Import/Export, University Thresholds) */
const ContentTab = () => (
  <div className={roles.grid2}>
    <ImportCard />
    <MediaCard />
    <UniversityCard />
    <ProgramCard />
  </div>
);

/** Импорт CSV/JSON: сначала dry-run (ТЗ 7.2), затем реальный импорт того же файла */
const ImportCard = () => {
  const t = useT();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const imp = useImportQuestions();
  const checked = imp.isSuccess && imp.variables?.dryRun !== false;

  return (
    <Card title={t.adm.import}>
      <div className={scss.stack}>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.json,text/csv,application/json"
          onChange={(e) => {
            setFile(e.target.files?.[0] ?? null);
            imp.reset();
          }}
        />
        <div className={scss.actions}>
          <Button
            variant="secondary"
            disabled={!file}
            loading={imp.isPending && imp.variables?.dryRun !== false}
            onClick={() => file && imp.mutate({ file, dryRun: true })}
          >
            {t.adm.dryRun}
          </Button>
          <Button
            icon={<LuUpload />}
            disabled={!file || !checked}
            loading={imp.isPending && imp.variables?.dryRun === false}
            onClick={() => file && imp.mutate({ file, dryRun: false })}
          >
            {t.adm.importNow}
          </Button>
        </div>
        <p className={scss.muted}>{t.adm.importNote}</p>
        {imp.data && <JsonView value={imp.data} />}
        <MutationStatus
          error={imp.error}
          success={imp.isSuccess && imp.variables?.dryRun === false}
          text={t.adm.imported}
        />
      </div>
    </Card>
  );
};

/** Загрузка картинки для вопроса → markdown для вставки в текст */
const MediaCard = () => {
  const t = useT();
  const upload = useUploadMedia();
  const markdown = upload.data ? str(upload.data, "markdown") : null;

  return (
    <Card title={t.adm.media}>
      <div className={scss.stack}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload.mutate({ file: f });
          }}
        />
        {upload.isPending && <p className={scss.muted}>{t.common.loading}</p>}
        {markdown && (
          <Field label={t.adm.markdown} wide>
            <input readOnly value={markdown} onFocus={(e) => e.currentTarget.select()} />
          </Field>
        )}
        {upload.data && !markdown && <JsonView value={upload.data} />}
        <p className={scss.muted}>{t.adm.mediaNote}</p>
        <MutationStatus error={upload.error} />
      </div>
    </Card>
  );
};

/** Вуз: создать или обновить по коду (PUT — upsert) */
const UniversityCard = () => {
  const t = useT();
  const upsert = useUpsertUniversity();
  const { register, handleSubmit } = useForm<UniversityIn>({ defaultValues: { active: true } });

  return (
    <Card title={t.adm.university}>
      <form
        className={scss.form}
        onSubmit={handleSubmit((v) =>
          upsert.mutate({ ...v, city: v.city?.trim() || null }),
        )}
      >
        <Field label={t.adm.code}>
          <input required maxLength={32} {...register("code", { required: true })} />
        </Field>
        <Field label={t.adm.city}>
          <input {...register("city")} />
        </Field>
        <Field label={t.adm.titleKy} wide>
          <input required maxLength={200} {...register("title_ky", { required: true })} />
        </Field>
        <Field label={t.adm.titleRu} wide>
          <input required maxLength={200} {...register("title_ru", { required: true })} />
        </Field>
        <div className={`${scss.actions} ${scss.full}`}>
          <Button type="submit" loading={upsert.isPending}>
            {t.common.save}
          </Button>
        </div>
      </form>
      {upsert.data && <JsonView value={upsert.data} />}
      <MutationStatus error={upsert.error} success={upsert.isSuccess} />
    </Card>
  );
};

/** Программа вуза с порогом: добавить (по id вуза) или обновить (по id программы) */
const ProgramCard = () => {
  const t = useT();
  const add = useAddUniversityProgram();
  const update = useUpdateUniversityProgram();
  const [mode, setMode] = useState<"add" | "update">("add");
  const form = useForm<ProgramIn & { universityId: string; programId: string }>({
    defaultValues: { active: true, year: 2026 },
  });

  const onSubmit = form.handleSubmit((v) => {
    if (mode === "add")
      add.mutate({
        universityId: v.universityId.trim(),
        data: {
          code: v.code.trim(),
          title_ky: v.title_ky.trim(),
          title_ru: v.title_ru.trim(),
          year: Number(v.year),
          threshold_score: Number(v.threshold_score),
          source: v.source.trim(),
          active: v.active,
        },
      });
    else
      update.mutate({
        programId: v.programId.trim(),
        data: {
          threshold_score: v.threshold_score ? Number(v.threshold_score) : null,
          source: v.source?.trim() || null,
          active: v.active,
        },
      });
  });

  return (
    <Card
      title={t.adm.program}
      action={
        <select className={scss.select} value={mode} onChange={(e) => setMode(e.target.value as "add" | "update")}>
          <option value="add">{t.adm.add}</option>
          <option value="update">{t.adm.edit}</option>
        </select>
      }
    >
      <form className={scss.form} onSubmit={onSubmit}>
        {mode === "add" ? (
          <>
            <Field label={t.adm.universityId} wide>
              <input required {...form.register("universityId", { required: true })} />
            </Field>
            <Field label={t.adm.code}>
              <input required maxLength={32} {...form.register("code", { required: mode === "add" })} />
            </Field>
            <Field label={t.adm.year}>
              <input type="number" min={2000} max={2100} {...form.register("year")} />
            </Field>
            <Field label={t.adm.titleKy} wide>
              <input required maxLength={200} {...form.register("title_ky", { required: mode === "add" })} />
            </Field>
            <Field label={t.adm.titleRu} wide>
              <input required maxLength={200} {...form.register("title_ru", { required: mode === "add" })} />
            </Field>
          </>
        ) : (
          <Field label={t.adm.programId} wide>
            <input required {...form.register("programId", { required: true })} />
          </Field>
        )}
        <Field label={t.adm.threshold}>
          <input type="number" min={0} max={1000} required={mode === "add"} {...form.register("threshold_score")} />
        </Field>
        <Field label={t.adm.source}>
          <input minLength={3} maxLength={255} required={mode === "add"} {...form.register("source")} />
        </Field>
        <label className={scss.correct}>
          <input type="checkbox" {...form.register("active")} /> {t.adm.active}
        </label>
        <div className={`${scss.actions} ${scss.full}`}>
          <Button type="submit" loading={add.isPending || update.isPending}>
            {t.common.save}
          </Button>
        </div>
      </form>
      {(add.data ?? update.data) && <JsonView value={add.data ?? update.data} />}
      <MutationStatus error={add.error ?? update.error} success={add.isSuccess || update.isSuccess} />
      <p className={scss.muted}>{t.adm.programNote}</p>
    </Card>
  );
};

export default ContentTab;
