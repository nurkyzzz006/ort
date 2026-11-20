"use client";
import { LuTarget } from "react-icons/lu";
import { useGetStatsSkills } from "@/api";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { ProgressBar, toneByRatio } from "@/components/ui/Progress";
import { Empty, ErrorState, Skeleton } from "@/components/ui/StateView";
import { pickTitle, useT } from "@/i18n";
import { toRatio } from "@/i18n/format";
import { useSettings } from "@/settings/SettingsProvider";
import scss from "./widgets.module.scss";

interface SkillsCardProps {
  limit?: number;
  title?: string;
}

/** Уровень освоения навыков (ТЗ 13.3: «уровень освоения», а не вероятность) */
const SkillsCard = ({ limit = 6, title }: SkillsCardProps) => {
  const t = useT();
  const { locale } = useSettings();
  const skills = useGetStatsSkills();

  const content = () => {
    if (skills.isPending)
      return (
        <div className={scss.list}>
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} height={22} />
          ))}
        </div>
      );
    if (skills.isError) return <ErrorState error={skills.error} onRetry={() => skills.refetch()} />;

    const rows = skills.data.filter((s) => s.answers > 0).slice(0, limit);
    if (rows.length === 0)
      return (
        <Empty
          icon={<LuTarget />}
          title={t.skills.emptyTitle}
          text={t.skills.emptyText}
          action={
            <Button href="/dashboard/practice" size="sm">
              {t.skills.goPractice}
            </Button>
          }
        />
      );

    return (
      <ul className={scss.skillList}>
        {rows.map((s) => {
          const mastery = toRatio(s.mastery) ?? 0;
          return (
            <li key={s.skill_id}>
              <span className={scss.skillName}>{pickTitle(s, locale)}</span>
              <ProgressBar value={mastery} tone={toneByRatio(mastery)} label={pickTitle(s, locale)} />
              <strong>{Math.round(mastery * 100)}%</strong>
              <span className={scss.skillMeta}>{t.skills.answers(s.answers)}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  return <Card title={title ?? t.skills.title}>{content()}</Card>;
};

export default SkillsCard;
