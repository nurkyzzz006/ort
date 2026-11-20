"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LuPlus } from "react-icons/lu";
import { useGetSubjects } from "@/api";
import Badge, { type BadgeTone } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import { ProgressBar } from "@/components/ui/Progress";
import DemoNotice, { useL } from "@/demo/DemoNotice";
import { assignments as initial, classes, type DemoAssignment } from "@/demo/data";
import { pickTitle, useT } from "@/i18n";
import { formatDate } from "@/i18n/format";
import { useSettings } from "@/settings/SettingsProvider";
import scss from "./roles.module.scss";

const STATUS_TONE: Record<DemoAssignment["status"], BadgeTone> = {
  active: "primary",
  closed: "neutral",
  draft: "warning",
};

interface Form {
  title: string;
  classId: string;
  subjectId: string;
  due: string;
  questions: string;
}

/** Учитель: выдача и проверка домашних заданий (ДЕМО: API домашки ещё нет) */
const TeacherHomework = () => {
  const t = useT();
  const l = useL();
  const { locale } = useSettings();
  // Предметы — реальные данные каталога
  const subjects = useGetSubjects();
  // Список заданий — локальное состояние демо до появления POST /teacher/homework
  const [list, setList] = useState<DemoAssignment[]>(initial);
  const [created, setCreated] = useState(false);
  const { register, handleSubmit, reset } = useForm<Form>({
    defaultValues: { classId: classes[0].id, questions: "10" },
  });

  const onSubmit = (f: Form) => {
    const cls = classes.find((c) => c.id === f.classId) ?? classes[0];
    setList((prev) => [
      {
        id: `new-${prev.length + 1}`,
        title: { ky: f.title, ru: f.title },
        classId: cls.id,
        className: cls.name,
        due: new Date(f.due).toISOString(),
        submitted: 0,
        total: cls.students,
        avgScore: null,
        status: "active",
      },
      ...prev,
    ]);
    setCreated(true);
    reset({ classId: f.classId, questions: f.questions, title: "", due: "", subjectId: f.subjectId });
  };

  return (
    <>
      <PageHeader title={t.teacherHw.title} subtitle={t.teacherHw.subtitle} />
      <DemoNotice endpoints="POST /teacher/homework · GET /teacher/homework" />

      <Card title={t.teacherHw.create}>
        <form className={scss.form} onSubmit={handleSubmit(onSubmit)}>
          <label className={scss.fieldWide}>
            <span>{t.teacherHw.name}</span>
            <input required maxLength={120} placeholder={t.teacherHw.namePlaceholder} {...register("title", { required: true })} />
          </label>
          <label className={scss.field}>
            <span>{t.teacherHw.class}</span>
            <select {...register("classId")}>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} · {l(c.subject)}
                </option>
              ))}
            </select>
          </label>
          <label className={scss.field}>
            <span>{t.practice.subject}</span>
            <select {...register("subjectId")}>
              <option value="">—</option>
              {subjects.data?.map((s) => (
                <option key={s.id} value={s.id}>
                  {pickTitle(s, locale)}
                </option>
              ))}
            </select>
          </label>
          <label className={scss.field}>
            <span>{t.teacherHw.due}</span>
            <input type="date" required {...register("due", { required: true })} />
          </label>
          <label className={scss.field}>
            <span>{t.practice.count}</span>
            <input type="number" min={1} max={30} {...register("questions")} />
          </label>
          <div className={scss.buttons}>
            <Button type="submit" icon={<LuPlus />}>
              {t.teacherHw.give}
            </Button>
            {created && <span className={scss.ok}>{t.teacherHw.created}</span>}
          </div>
        </form>
      </Card>

      <Card title={t.teacherHw.list} padding="none" className={scss.mt}>
        <div className={scss.tableWrap}>
          <table className={scss.table}>
            <thead>
              <tr>
                <th>{t.teacherHw.name}</th>
                <th>{t.teacherHw.class}</th>
                <th>{t.teacherHw.due}</th>
                <th>{t.teacherHw.submitted}</th>
                <th>{t.teacherHw.avg}</th>
                <th>{t.mistakes.columns.status}</th>
              </tr>
            </thead>
            <tbody>
              {list.map((a) => (
                <tr key={a.id}>
                  <td className={scss.strong}>{l(a.title)}</td>
                  <td>{a.className}</td>
                  <td>{formatDate(a.due, locale)}</td>
                  <td>
                    {a.submitted}/{a.total}
                    <ProgressBar value={a.total ? a.submitted / a.total : 0} size="sm" />
                  </td>
                  <td>{a.avgScore !== null ? `${Math.round(a.avgScore * 100)}%` : "—"}</td>
                  <td>
                    <Badge tone={STATUS_TONE[a.status]}>{t.teacherHw.status[a.status]}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
};

export default TeacherHomework;
