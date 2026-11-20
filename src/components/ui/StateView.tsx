"use client";
import type { ReactNode } from "react";
import { LuInbox, LuLoaderCircle, LuRefreshCw, LuTriangleAlert } from "react-icons/lu";
import { getErrorMessage } from "@/api";
import { useT } from "@/i18n";
import Button from "./Button";
import scss from "./StateView.module.scss";

export const Loader = ({ label }: { label?: string }) => {
  const t = useT();
  return (
    <div className={scss.state} role="status" aria-live="polite">
      <LuLoaderCircle className={scss.spin} aria-hidden />
      <p>{label ?? t.common.loading}</p>
    </div>
  );
};

interface EmptyProps {
  title: string;
  text?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

/** Пустое состояние: объясняем, почему данных нет (ТЗ 4.8) */
export const Empty = ({ title, text, icon, action }: EmptyProps) => (
  <div className={scss.state}>
    <span className={scss.icon} aria-hidden>
      {icon ?? <LuInbox />}
    </span>
    <p className={scss.title}>{title}</p>
    {text && <p className={scss.text}>{text}</p>}
    {action}
  </div>
);

interface ErrorProps {
  error: unknown;
  onRetry?: () => void;
}

export const ErrorState = ({ error, onRetry }: ErrorProps) => {
  const t = useT();
  return (
    <div className={[scss.state, scss.error].join(" ")} role="alert">
      <span className={scss.icon} aria-hidden>
        <LuTriangleAlert />
      </span>
      <p className={scss.title}>{getErrorMessage(error, t.errors)}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" icon={<LuRefreshCw />} onClick={onRetry}>
          {t.common.retry}
        </Button>
      )}
    </div>
  );
};

export const Skeleton = ({ height = 16, width = "100%" }: { height?: number; width?: string }) => (
  <span className={scss.skeleton} style={{ height, width }} aria-hidden />
);
