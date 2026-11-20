import type { ReactNode } from "react";
import scss from "./Badge.module.scss";

export type BadgeTone = "neutral" | "primary" | "success" | "warning" | "danger" | "info";

interface BadgeProps {
  tone?: BadgeTone;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

const Badge = ({ tone = "neutral", icon, children, className }: BadgeProps) => (
  <span className={[scss.badge, scss[tone], className ?? ""].join(" ")}>
    {icon}
    {children}
  </span>
);

export default Badge;
