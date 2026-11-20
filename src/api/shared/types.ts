// Общие типы, которые используются в нескольких endpoint-ах.
// Типы, нужные только одному endpoint-у, лежат в его собственном types.ts.
// В комментариях указано имя схемы в Swagger.

import type { UseQueryOptions } from "@tanstack/react-query";
import type { ApiError } from "../axios";

/** Swagger: Locale — язык контента на бэкенде */
export type Locale = "ky" | "ru";

/** Swagger: RoleCode */
export type RoleCode = "student" | "editor" | "expert" | "admin";

/** Swagger: GradeStatus */
export type GradeStatus = "grade_10" | "grade_11" | "graduate" | "other";

/** Swagger: UserOut */
export interface User {
  id: string; // uuid
  email: string | null;
  display_name: string | null;
  locale: Locale;
  timezone: string;
  grade_status: GradeStatus | null;
  /** Swagger описывает как string[]; ожидаемые значения — RoleCode */
  roles: string[];
  created_at: string; // date-time
}

/** Ответ BFF на login/register: токены остаются в HttpOnly cookie */
export interface AuthUserResponse {
  user: User;
}

/** Параметры пагинации, общие для списков */
export interface PaginationParams {
  limit?: number;
  offset?: number;
}

/** Ответ, структура которого не описана в Swagger */
export type UntypedResponse = Record<string, unknown>;

/** Дополнительные опции, которые можно передать в query-хук */
export type QueryOptions<TData> = Omit<
  UseQueryOptions<TData, ApiError>,
  "queryKey" | "queryFn"
>;

// ─── Модели, общие для нескольких модулей ─────────────────────────────────

/** Swagger: TestKind */
export type TestKind = "mock" | "section" | "mini" | "diagnostic" | "subject";

/** Swagger: ScaleKind */
export type ScaleKind = "estimated" | "official";

/** Swagger: CardStatus — статус карточки ошибки */
export type CardStatus = "new" | "learning" | "mastered" | "suspended";

/** Swagger: MistakeReason */
export type MistakeReason =
  | "unknown_topic"
  | "calculation"
  | "inattention"
  | "misread"
  | "no_time"
  | "guessed"
  | "other";

/** Swagger: SnapshotOption — вариант ответа без признака правильности */
export interface SnapshotOption {
  id: string; // uuid
  key: string;
  text: string;
}

/** Swagger: MilestoneOut */
export interface Milestone {
  score: number;
  reached_at: string | null;
}

/** Swagger: PredictionOut */
export interface Prediction {
  available: boolean;
  reason?: string | null;
  low?: number | null;
  point?: number | null;
  high?: number | null;
  confidence?: string | null;
  is_estimated_scale?: boolean; // default: false
  based_on_checkpoint_at?: string | null;
  algorithm_version?: number | null;
}

/** Swagger: CheckpointOut — результат пробного экзамена */
export interface Checkpoint {
  id: string; // uuid
  kind: string;
  session_id: string | null;
  total_raw: number;
  max_raw: number;
  total_scaled: number | null;
  sections: Record<string, unknown>[];
  taken_at: string; // date-time
}

/** Swagger: SkillOut */
export interface Skill {
  id: string; // uuid
  topic_id: string; // uuid
  code: string;
  title_ky: string;
  title_ru: string;
  order: number;
  active: boolean;
}

/** Страница списка: CardPage и др. */
export interface Page<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

/** Ответ GET-запроса, отдающего файл (export, media) */
export type FileResponse = Blob;
