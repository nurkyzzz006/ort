import type { ReactNode } from "react";
import scss from "./Card.module.scss";

interface CardProps {
  title?: ReactNode;
  /** Счётчик или бейдж рядом с заголовком */
  badge?: ReactNode;
  /** Действие справа в шапке карточки */
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
  padding?: "md" | "lg" | "none";
  tone?: "default" | "warning" | "primary";
  as?: "section" | "div" | "article";
}

const Card = ({
  title,
  badge,
  action,
  children,
  className,
  padding = "md",
  tone = "default",
  as: Tag = "section",
}: CardProps) => (
  <Tag className={[scss.card, scss[`pad_${padding}`], scss[tone], className ?? ""].join(" ")}>
    {(title || action) && (
      <header className={scss.header}>
        <div className={scss.titleRow}>
          {title && <h2 className={scss.title}>{title}</h2>}
          {badge}
        </div>
        {action && <div className={scss.action}>{action}</div>}
      </header>
    )}
    {children}
  </Tag>
);

export default Card;
