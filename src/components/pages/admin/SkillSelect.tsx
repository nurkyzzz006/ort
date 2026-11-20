"use client";
import { useState } from "react";
import { useGetAdminSubjects, useGetAdminSubjectTopics, type TopicNode } from "@/api";
import { pickTitle, useT } from "@/i18n";
import { useSettings } from "@/settings/SettingsProvider";
import scss from "./admin.module.scss";

/** Все навыки дерева тем в плоском списке «Тема › Навык» */
const flatten = (nodes: TopicNode[], locale: "ky" | "ru", prefix = ""): { id: string; label: string }[] =>
  nodes.flatMap((n) => {
    const path = prefix ? `${prefix} › ${pickTitle(n, locale)}` : pickTitle(n, locale);
    return [
      ...(n.skills ?? []).map((s) => ({ id: s.id, label: `${path} › ${pickTitle(s, locale)}` })),
      ...flatten(n.children ?? [], locale, path),
    ];
  });

interface SkillSelectProps {
  value: string;
  onChange: (skillId: string) => void;
  required?: boolean;
}

/** Выбор навыка: предмет → навык (реальный admin-каталог) */
const SkillSelect = ({ value, onChange, required }: SkillSelectProps) => {
  const t = useT();
  const { locale } = useSettings();
  const subjects = useGetAdminSubjects();
  const [subjectId, setSubjectId] = useState("");
  const active = subjectId || subjects.data?.[0]?.id;
  const topics = useGetAdminSubjectTopics(active);
  const skills = topics.data ? flatten(topics.data, locale) : [];

  return (
    <>
      <label className={scss.field}>
        <span>{t.practice.subject}</span>
        <select value={active ?? ""} onChange={(e) => setSubjectId(e.target.value)}>
          {subjects.data?.map((s) => (
            <option key={s.id} value={s.id}>
              {pickTitle(s, locale)}
            </option>
          ))}
        </select>
      </label>
      <label className={scss.field}>
        <span>{t.adm.skill}</span>
        <select value={value} required={required} onChange={(e) => onChange(e.target.value)}>
          <option value="">{skills.length ? "—" : t.adm.noSkills}</option>
          {skills.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
    </>
  );
};

export default SkillSelect;
