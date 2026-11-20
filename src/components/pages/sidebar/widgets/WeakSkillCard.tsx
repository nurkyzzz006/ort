"use client";
import { LuTriangleAlert } from "react-icons/lu";
import { getErrorMessage, useGetStatsSkills } from "@/api";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { pickTitle, useT } from "@/i18n";
import { toRatio } from "@/i18n/format";
import { useSettings } from "@/settings/SettingsProvider";
import { useOpenPractice } from "../actions";
import scss from "./widgets.module.scss";

/** «Алсыз тема»: навык с самым низким освоением + запуск практики по нему */
const WeakSkillCard = () => {
  const t = useT();
  const { locale } = useSettings();
  const skills = useGetStatsSkills();
  const practice = useOpenPractice();

  const weakest = skills.data
    ?.filter((s) => s.answers > 0 && !s.mastered)
    .sort((a, b) => a.mastery - b.mastery)[0];

  if (!weakest) return null;
  const accuracy = toRatio(weakest.accuracy) ?? 0;

  return (
    <Card tone="warning">
      <p className={scss.weakTitle}>
        <LuTriangleAlert aria-hidden /> {t.weak.title}
      </p>
      <h3 className={scss.weakSkill}>{pickTitle(weakest, locale)}</h3>
      <p className={scss.muted}>{t.weak.text(weakest.answers, Math.round(accuracy * 100))}</p>
      {practice.mutation.isError && (
        <p className={scss.error} role="alert">
          {getErrorMessage(practice.mutation.error, t.errors)}
        </p>
      )}
      <Button
        size="sm"
        className={scss.weakButton}
        loading={practice.mutation.isPending}
        onClick={() => practice.open({ skillId: weakest.skill_id })}
      >
        {t.weak.start}
      </Button>
    </Card>
  );
};

export default WeakSkillCard;
