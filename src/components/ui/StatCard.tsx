import type { ReactNode } from "react";
import type { BadgeTone } from "./Badge";
import scss from "./StatCard.module.scss";

interface StatCardProps {
  icon: ReactNode;
  tone?: BadgeTone;
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  loading?: boolean;
}

/** Карточка показателя: «Окуу сериясы · 12 күн» */
const StatCard = ({ icon, tone = "primary", label, value, hint, loading }: StatCardProps) => (
  <div className={scss.card}>
    <span className={[scss.icon, scss[tone]].join(" ")} aria-hidden>
      {icon}
    </span>
    <p className={scss.label}>{label}</p>
    {loading ? (
      <span className={scss.skeleton} aria-hidden />
    ) : (
      <p className={scss.value}>{value}</p>
    )}
    {hint && <p className={scss.hint}>{hint}</p>}
  </div>
);

export default StatCard;
