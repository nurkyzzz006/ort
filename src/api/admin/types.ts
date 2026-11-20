// Модели admin-API (CMS, пользователи, экзамены). Имена схем Swagger — в комментариях.
import type { Locale, Page, ScaleKind, TestKind } from "../shared/types";

/** Swagger: UserStatus */
export type UserStatus = "active" | "blocked" | "deleted";

/** Swagger: QuestionStatus — workflow контента (ТЗ 7.2) */
export type QuestionStatus =
  | "draft"
  | "editorial_review"
  | "expert_review"
  | "approved"
  | "published"
  | "retired";

/** Swagger: PublishStatus — форматы, шкалы, тесты */
export type PublishStatus = "draft" | "published" | "retired";

// ─── Каталог ──────────────────────────────────────────────────────────────

/** Swagger: SubjectCreateIn */
export interface SubjectCreateIn {
  code: string; // 1…32
  title_ky: string; // 1…120
  title_ru: string; // 1…120
  order?: number; // 0…100000, default 0
  active?: boolean; // default true
}

/** Swagger: SubjectUpdateIn */
export interface SubjectUpdateIn {
  title_ky?: string | null;
  title_ru?: string | null;
  order?: number | null;
  active?: boolean | null;
}

/** Swagger: TopicCreateIn */
export interface TopicCreateIn {
  subject_id: string; // uuid
  parent_id?: string | null;
  title_ky: string; // 1…160
  title_ru: string; // 1…160
  order?: number;
  active?: boolean;
}

/** Swagger: TopicUpdateIn */
export interface TopicUpdateIn {
  parent_id?: string | null;
  title_ky?: string | null;
  title_ru?: string | null;
  order?: number | null;
  active?: boolean | null;
}

/** Swagger: TopicOut */
export interface TopicOut {
  id: string;
  subject_id: string;
  parent_id: string | null;
  title_ky: string;
  title_ru: string;
  order: number;
  active: boolean;
}

/** Swagger: SkillCreateIn */
export interface SkillCreateIn {
  topic_id: string; // uuid
  code: string; // 1…64
  title_ky: string; // 1…160
  title_ru: string; // 1…160
  order?: number;
  active?: boolean;
}

/** Swagger: SkillUpdateIn */
export interface SkillUpdateIn {
  topic_id?: string | null;
  title_ky?: string | null;
  title_ru?: string | null;
  order?: number | null;
  active?: boolean | null;
}

// ─── Пользователи ─────────────────────────────────────────────────────────

/** Swagger: AdminUserOut */
export interface AdminUser {
  id: string;
  email: string | null;
  display_name: string | null;
  status: UserStatus;
  roles: string[];
  created_at: string;
}

/** Swagger: AdminUserPage */
export type AdminUserPage = Page<AdminUser>;

// ─── Вопросы ──────────────────────────────────────────────────────────────

/** Swagger: OptionAdminOut — вариант с признаком правильности */
export interface OptionAdmin {
  id: string;
  key: string;
  text: string;
  is_correct: boolean;
}

/** Swagger: OptionIn */
export interface OptionIn {
  key: string;
  text: string; // 1…2000
  is_correct?: boolean; // default false
}

/** Swagger: QuestionAdminOut — версия вопроса */
export interface QuestionAdmin {
  id: string; // id версии
  group_id: string;
  code: string;
  skill_id: string;
  version: number;
  language: Locale;
  stem: string;
  options: OptionAdmin[];
  solution: string | null;
  difficulty: number;
  estimated_time_sec: number | null;
  source: string | null;
  license: string | null;
  status: QuestionStatus;
  author_id: string | null;
  created_at: string;
  published_at: string | null;
}

/** Swagger: QuestionPage */
export type QuestionPage = Page<QuestionAdmin>;

/** Swagger: QuestionCreateIn */
export interface QuestionCreateIn {
  skill_id?: string | null;
  group_id?: string | null; // языковая пара существующего вопроса
  language: Locale;
  stem: string; // 1…10000
  options: OptionIn[];
  solution?: string | null;
  difficulty?: number; // 1…5, default 3
  estimated_time_sec?: number | null;
  source?: string | null;
  license?: string | null;
}

/** Swagger: QuestionUpdateIn */
export interface QuestionUpdateIn {
  stem?: string | null;
  options?: OptionIn[] | null;
  solution?: string | null;
  difficulty?: number | null;
  estimated_time_sec?: number | null;
  source?: string | null;
  license?: string | null;
}

/** Swagger: TransitionIn — перевод по workflow */
export interface TransitionIn {
  to: QuestionStatus;
  comment?: string | null;
}

/** Swagger: ReviewOut — история переходов */
export interface QuestionReview {
  from_status: string;
  to_status: string;
  actor_id: string | null;
  comment: string | null;
  created_at: string;
}

// ─── Форматы экзамена и шкалы ─────────────────────────────────────────────

/** Swagger: SectionIn */
export interface SectionIn {
  code: string; // 1…32
  title_ky: string;
  title_ru: string;
  question_count: number; // 1…300
  time_limit_sec: number; // 60…21600
}

/** Swagger: SectionOut */
export interface SectionOut extends SectionIn {
  id: string;
  order: number;
}

/** Swagger: ExamFormatIn */
export interface ExamFormatIn {
  code: string;
  title_ky: string;
  title_ru: string;
  rules?: Record<string, unknown>; // default {}
  sections: SectionIn[];
}

/** Swagger: ExamFormatVersionOut */
export interface ExamFormatVersion {
  id: string;
  code: string;
  title_ky: string;
  title_ru: string;
  version: number;
  status: PublishStatus;
  rules: Record<string, unknown>;
  sections: SectionOut[];
}

/** Swagger: ScalePointIn — raw → балл */
export interface ScalePointIn {
  section_code: string;
  raw: number; // 0…300
  scaled: number; // 0…1000
}

/** Swagger: ScoreScaleIn */
export interface ScoreScaleIn {
  kind?: ScaleKind; // default "estimated"
  source?: string | null;
  points: ScalePointIn[];
}

/** Swagger: ScoreScaleOut */
export interface ScoreScale {
  id: string;
  format_version_id: string;
  version: number;
  kind: ScaleKind;
  status: PublishStatus;
  source: string | null;
}

/** Swagger: SkillWeightIn */
export interface SkillWeightIn {
  skill_id: string;
  section_code: string;
  expected_questions: number; // ≤ 300
}

// ─── Тесты ────────────────────────────────────────────────────────────────

/** Swagger: TestQuestionIn */
export interface TestQuestionIn {
  question_version_id: string;
  section_code?: string | null;
  points?: number; // 1…10, default 1
}

/** Swagger: TestIn */
export interface TestIn {
  code: string; // 1…32
  title_ky: string; // 1…160
  title_ru: string; // 1…160
  kind: TestKind;
  language: Locale;
  subject_id?: string | null;
  format_version_id?: string | null;
  time_limit_sec?: number | null;
  questions?: TestQuestionIn[]; // default []
}

/** Swagger: TestAdminOut */
export interface TestAdmin {
  id: string;
  code: string;
  version: number;
  title_ky: string;
  title_ru: string;
  kind: TestKind;
  language: Locale;
  subject_id: string | null;
  format_version_id: string | null;
  time_limit_sec: number | null;
  status: PublishStatus;
  question_count: number;
}

/** Swagger: ValidationOut */
export interface TestValidation {
  valid: boolean;
  problems: string[];
}

// ─── Вузы ─────────────────────────────────────────────────────────────────

/** Swagger: UniversityIn */
export interface UniversityIn {
  code: string; // 1…32
  title_ky: string; // 1…200
  title_ru: string;
  city?: string | null;
  active?: boolean;
}

/** Swagger: ProgramIn */
export interface ProgramIn {
  code: string;
  title_ky: string;
  title_ru: string;
  year: number; // 2000…2100
  threshold_score: number; // 0…1000
  source: string; // 3…255
  active?: boolean;
}

/** Swagger: ProgramUpdateIn */
export interface ProgramUpdateIn {
  threshold_score?: number | null;
  source?: string | null;
  active?: boolean | null;
}
