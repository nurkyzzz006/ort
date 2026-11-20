"use client";
import { useMemo, useState } from "react";
import { LuBookOpen, LuTarget } from "react-icons/lu";
import { getErrorMessage, useGetStatsSkills, useGetSubjects, useGetSubjectTopics, type TopicNode } from "@/api";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import { ProgressBar, toneByRatio } from "@/components/ui/Progress";
import { Empty, ErrorState, Skeleton } from "@/components/ui/StateView";
import { pickTitle, useT } from "@/i18n";
import { toRatio } from "@/i18n/format";
import { useSettings } from "@/settings/SettingsProvider";
import { useOpenPractice } from "../sidebar/actions";
import scss from "./roles.module.scss";

/** Предметы → темы → навыки (реальный API: /subjects, /subjects/{id}/topics) */
const Subjects = () => {
  const t = useT();
  const { locale } = useSettings();
  const subjects = useGetSubjects();
  const [selected, setSelected] = useState<string | null>(null);
  const active = selected ?? subjects.data?.[0]?.id;

  return (
    <>
      <PageHeader title={t.subjects.title} subtitle={t.subjects.subtitle} />

      {subjects.isPending ? (
        <Skeleton height={160} />
      ) : subjects.isError ? (
        <Card>
          <ErrorState error={subjects.error} onRetry={() => subjects.refetch()} />
        </Card>
      ) : subjects.data.length === 0 ? (
        <Card>
          <Empty icon={<LuBookOpen />} title={t.practice.noSubjects} text={t.subjects.emptyText} />
        </Card>
      ) : (
        <>
          <ul className={scss.grid3}>
            {subjects.data.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  className={[scss.tileButton, s.id === active ? scss.tileActive : ""].join(" ")}
                  aria-pressed={s.id === active}
                  onClick={() => setSelected(s.id)}
                >
                  <div className={scss.tileTop}>
                    <Badge tone="primary">{s.code}</Badge>
                    {!s.active && <Badge>{t.subjects.inactive}</Badge>}
                  </div>
                  <h3>{pickTitle(s, locale)}</h3>
                </button>
              </li>
            ))}
          </ul>
          {active && <TopicsTree subjectId={active} allowPractice />}
        </>
      )}
    </>
  );
};

const TopicsTree = ({ subjectId, allowPractice }: { subjectId: string; allowPractice: boolean }) => {
  const t = useT();
  const { locale } = useSettings();
  const topics = useGetSubjectTopics(subjectId);
  const stats = useGetStatsSkills({ enabled: allowPractice });
  const practice = useOpenPractice();
  const mastery = useMemo(
    () => new Map(stats.data?.map((s) => [s.skill_id, toRatio(s.mastery) ?? 0]) ?? []),
    [stats.data],
  );

  const renderNode = (node: TopicNode) => (
    <li key={node.id}>
      <div className={scss.grow}>
        <strong>{pickTitle(node, locale)}</strong>
        <span>{t.subjects.skillsCount(node.skills?.length ?? 0)}</span>
      </div>
      {(node.skills ?? []).length > 0 && (
        <ul className={scss.list}>
          {node.skills?.map((s) => {
            const m = mastery.get(s.id);
            return (
              <li key={s.id}>
                <LuTarget aria-hidden />
                <div className={scss.grow}>
                  <strong>{pickTitle(s, locale)}</strong>
                  {m !== undefined && <ProgressBar value={m} tone={toneByRatio(m)} size="sm" />}
                </div>
                {allowPractice && (
                  <Button
                    size="sm"
                    variant="soft"
                    disabled={practice.mutation.isPending}
                    onClick={() => practice.open({ skillId: s.id })}
                  >
                    {t.analytics.train}
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {(node.children ?? []).length > 0 && <ul className={scss.tree}>{node.children?.map(renderNode)}</ul>}
    </li>
  );

  return (
    <Card title={t.subjects.topics} className={scss.mt}>
      {topics.isPending ? (
        <Skeleton height={140} />
      ) : topics.isError ? (
        <ErrorState error={topics.error} onRetry={() => topics.refetch()} />
      ) : topics.data.length === 0 ? (
        <p className={scss.muted}>{t.practice.noTopics}</p>
      ) : (
        <ul className={scss.tree}>{topics.data.map(renderNode)}</ul>
      )}
      {practice.mutation.isError && (
        <p className={scss.muted}>{getErrorMessage(practice.mutation.error, t.errors)}</p>
      )}
    </Card>
  );
};

export default Subjects;
