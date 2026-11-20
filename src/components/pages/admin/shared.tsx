"use client";
import type { ReactNode } from "react";
import { getErrorMessage, type QuestionStatus } from "@/api";
import type { BadgeTone } from "@/components/ui/Badge";
import { useT } from "@/i18n";
import scss from "./admin.module.scss";

export const QUESTION_TONE: Record<QuestionStatus, BadgeTone> = {
  draft: "neutral",
  editorial_review: "warning",
  expert_review: "info",
  approved: "primary",
  published: "success",
  retired: "danger",
};

export const QUESTION_STATUSES: QuestionStatus[] = [
  "draft",
  "editorial_review",
  "expert_review",
  "approved",
  "published",
  "retired",
];

/**
 * Возможные переходы workflow (ТЗ 7.2: draft → editorial_review → expert_review →
 * approved → published → retired; возврат на доработку — в draft).
 * Окончательно допустимость перехода проверяет бэкенд.
 */
export const NEXT_STATUSES: Record<QuestionStatus, QuestionStatus[]> = {
  draft: ["editorial_review"],
  editorial_review: ["expert_review", "draft"],
  expert_review: ["approved", "draft"],
  approved: ["published", "draft"],
  published: ["retired"],
  retired: [],
};

/** Результат мутации под формой: успех или понятная ошибка */
export const MutationStatus = ({
  error,
  success,
  text,
}: {
  error: unknown;
  success?: boolean;
  text?: string;
}) => {
  const t = useT();
  if (error)
    return (
      <p className={scss.error} role="alert">
        {getErrorMessage(error, t.errors)}
      </p>
    );
  if (success)
    return (
      <p className={scss.ok} role="status">
        {text ?? t.common.saved}
      </p>
    );
  return null;
};

/** Поле формы с подписью */
export const Field = ({ label, children, wide }: { label: string; children: ReactNode; wide?: boolean }) => (
  <label className={wide ? scss.fieldWide : scss.field}>
    <span>{label}</span>
    {children}
  </label>
);

/** Ответ без схемы в Swagger — показываем как JSON */
export const JsonView = ({ value }: { value: unknown }) => (
  <pre className={scss.json}>{JSON.stringify(value, null, 2)}</pre>
);

/** Строковое поле из объекта без схемы */
export const str = (obj: Record<string, unknown>, key: string): string | null => {
  const v = obj[key];
  return typeof v === "string" || typeof v === "number" ? String(v) : null;
};
