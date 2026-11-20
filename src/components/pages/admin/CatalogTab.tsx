"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LuPlus } from "react-icons/lu";
import {
  useCreateSkill,
  useCreateSubject,
  useCreateTopic,
  useGetAdminSubjects,
  useGetAdminSubjectTopics,
  useUpdateSkill,
  useUpdateSubject,
  useUpdateTopic,
  type TopicNode,
} from "@/api";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Empty, ErrorState, Skeleton } from "@/components/ui/StateView";
import { pickTitle, useT } from "@/i18n";
import { useSettings } from "@/settings/SettingsProvider";
import layout from "../sidebar/layout.module.scss";
import { Field, MutationStatus } from "./shared";
import scss from "./admin.module.scss";

interface TitleForm {
  code: string;
  title_ky: string;
  title_ru: string;
  order: string;
  parent: string; // для темы: id родительской темы; для навыка: id темы
}

const flatTopics = (nodes: TopicNode[], depth = 0): { node: TopicNode; depth: number }[] =>
  nodes.flatMap((n) => [{ node: n, depth }, ...flatTopics(n.children ?? [], depth + 1)]);

/** Каталог: предметы → темы → навыки (ТЗ 7.1 Topics & Skills) */
const CatalogTab = () => {
  const t = useT();
  const { locale } = useSettings();
  const subjects = useGetAdminSubjects();
  const createSubject = useCreateSubject();
  const updateSubject = useUpdateSubject();
  const [selected, setSelected] = useState<string | null>(null);
  const active = selected ?? subjects.data?.[0]?.id ?? null;
  const form = useForm<TitleForm>({ defaultValues: { order: "0" } });

  return (
    <div className={layout.columnsWide}>
      <div className={scss.stack}>
        <Card title={t.subjects.title}>
          {subjects.isPending ? (
            <Skeleton height={120} />
          ) : subjects.isError ? (
            <ErrorState error={subjects.error} onRetry={() => subjects.refetch()} />
          ) : subjects.data.length === 0 ? (
            <p className={scss.muted}>{t.practice.noSubjects}</p>
          ) : (
            subjects.data.map((s) => (
              <div key={s.id} className={`${scss.treeItem} ${s.active ? "" : scss.inactive}`}>
                <span>
                  <button
                    type="button"
                    className={layout.link}
                    aria-pressed={s.id === active}
                    onClick={() => setSelected(s.id)}
                  >
                    {pickTitle(s, locale)}
                  </button>{" "}
                  <Badge>{s.code}</Badge>
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={updateSubject.isPending}
                  onClick={() => updateSubject.mutate({ subjectId: s.id, data: { active: !s.active } })}
                >
                  {s.active ? t.adm.disable : t.adm.enable}
                </Button>
              </div>
            ))
          )}
          <MutationStatus error={updateSubject.error} />
        </Card>

        <Card title={t.adm.newSubject}>
          <form
            className={scss.form}
            onSubmit={form.handleSubmit((v) =>
              createSubject.mutate(
                { code: v.code.trim(), title_ky: v.title_ky.trim(), title_ru: v.title_ru.trim(), order: Number(v.order) || 0 },
                { onSuccess: (s) => { form.reset({ order: "0" }); setSelected(s.id); } },
              ),
            )}
          >
            <Field label={t.adm.code}>
              <input required maxLength={32} {...form.register("code", { required: true })} />
            </Field>
            <Field label={t.adm.order}>
              <input type="number" min={0} {...form.register("order")} />
            </Field>
            <Field label={t.adm.titleKy} wide>
              <input required maxLength={120} {...form.register("title_ky", { required: true })} />
            </Field>
            <Field label={t.adm.titleRu} wide>
              <input required maxLength={120} {...form.register("title_ru", { required: true })} />
            </Field>
            <div className={scss.full}>
              <Button type="submit" icon={<LuPlus />} loading={createSubject.isPending}>
                {t.adm.add}
              </Button>
            </div>
          </form>
          <MutationStatus error={createSubject.error} success={createSubject.isSuccess} />
        </Card>
      </div>

      {active ? <TopicsEditor key={active} subjectId={active} /> : (
        <Card>
          <Empty title={t.adm.pickSubject} />
        </Card>
      )}
    </div>
  );
};

/** Темы и навыки выбранного предмета */
const TopicsEditor = ({ subjectId }: { subjectId: string }) => {
  const t = useT();
  const { locale } = useSettings();
  const topics = useGetAdminSubjectTopics(subjectId);
  const createTopic = useCreateTopic();
  const updateTopic = useUpdateTopic();
  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();
  const topicForm = useForm<TitleForm>({ defaultValues: { order: "0", parent: "" } });
  const skillForm = useForm<TitleForm>({ defaultValues: { order: "0", parent: "" } });
  const flat = topics.data ? flatTopics(topics.data) : [];

  return (
    <div className={scss.stack}>
      <Card title={t.subjects.topics}>
        {topics.isPending ? (
          <Skeleton height={160} />
        ) : topics.isError ? (
          <ErrorState error={topics.error} onRetry={() => topics.refetch()} />
        ) : flat.length === 0 ? (
          <p className={scss.muted}>{t.practice.noTopics}</p>
        ) : (
          flat.map(({ node, depth }) => (
            <div key={node.id} className={depth ? scss.nested : ""}>
              <div className={`${scss.treeItem} ${node.active ? "" : scss.inactive}`}>
                <span>
                  <strong>{pickTitle(node, locale)}</strong>
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={updateTopic.isPending}
                  onClick={() => updateTopic.mutate({ topicId: node.id, data: { active: !node.active } })}
                >
                  {node.active ? t.adm.disable : t.adm.enable}
                </Button>
              </div>
              <div className={scss.nested}>
                {(node.skills ?? []).map((s) => (
                  <div key={s.id} className={`${scss.treeItem} ${s.active ? "" : scss.inactive}`}>
                    <span>
                      {pickTitle(s, locale)} <Badge>{s.code}</Badge>
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={updateSkill.isPending}
                      onClick={() => updateSkill.mutate({ skillId: s.id, data: { active: !s.active } })}
                    >
                      {s.active ? t.adm.disable : t.adm.enable}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
        <MutationStatus error={updateTopic.error ?? updateSkill.error} />
      </Card>

      <div className={scss.form}>
        <Card title={t.adm.newTopic}>
          <form
            className={scss.stack}
            onSubmit={topicForm.handleSubmit((v) =>
              createTopic.mutate(
                {
                  subject_id: subjectId,
                  parent_id: v.parent || null,
                  title_ky: v.title_ky.trim(),
                  title_ru: v.title_ru.trim(),
                  order: Number(v.order) || 0,
                },
                { onSuccess: () => topicForm.reset({ order: "0", parent: "" }) },
              ),
            )}
          >
            <Field label={t.adm.parentTopic}>
              <select {...topicForm.register("parent")}>
                <option value="">{t.adm.root}</option>
                {flat.map(({ node, depth }) => (
                  <option key={node.id} value={node.id}>
                    {"— ".repeat(depth)}
                    {pickTitle(node, locale)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t.adm.titleKy}>
              <input required maxLength={160} {...topicForm.register("title_ky", { required: true })} />
            </Field>
            <Field label={t.adm.titleRu}>
              <input required maxLength={160} {...topicForm.register("title_ru", { required: true })} />
            </Field>
            <Button type="submit" icon={<LuPlus />} loading={createTopic.isPending}>
              {t.adm.add}
            </Button>
            <MutationStatus error={createTopic.error} success={createTopic.isSuccess} />
          </form>
        </Card>

        <Card title={t.adm.newSkill}>
          <form
            className={scss.stack}
            onSubmit={skillForm.handleSubmit((v) =>
              createSkill.mutate(
                {
                  topic_id: v.parent,
                  code: v.code.trim(),
                  title_ky: v.title_ky.trim(),
                  title_ru: v.title_ru.trim(),
                  order: Number(v.order) || 0,
                },
                { onSuccess: () => skillForm.reset({ order: "0", parent: v.parent }) },
              ),
            )}
          >
            <Field label={t.adm.topic}>
              <select required {...skillForm.register("parent", { required: true })}>
                <option value="">—</option>
                {flat.map(({ node, depth }) => (
                  <option key={node.id} value={node.id}>
                    {"— ".repeat(depth)}
                    {pickTitle(node, locale)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t.adm.code}>
              <input required maxLength={64} {...skillForm.register("code", { required: true })} />
            </Field>
            <Field label={t.adm.titleKy}>
              <input required maxLength={160} {...skillForm.register("title_ky", { required: true })} />
            </Field>
            <Field label={t.adm.titleRu}>
              <input required maxLength={160} {...skillForm.register("title_ru", { required: true })} />
            </Field>
            <Button type="submit" icon={<LuPlus />} loading={createSkill.isPending}>
              {t.adm.add}
            </Button>
            <MutationStatus error={createSkill.error} success={createSkill.isSuccess} />
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CatalogTab;
