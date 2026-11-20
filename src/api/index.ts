// Единая точка входа в API:  import { useLogin, useGetMe } from "@/api";
// Каждый endpoint лежит в своей папке: src/api/<модуль>/<endpoint>/{index,types}.ts

// ─── Ядро ──────────────────────────────────────────────────────────────────
export { api, ApiError, setSessionExpiredHandler } from "./axios";
export type { ApiErrorDetail, RefreshResult } from "./axios";
export { createQueryClient } from "./query-client";
export { queryKeys, invalidateKeys, LEARNING_PROGRESS_KEYS } from "./query-keys";
export { getErrorMessage, getFieldErrors } from "./shared/error-messages";
export type { ErrorMessages } from "./shared/error-messages";
export { createIdempotencyKey } from "./shared/url";
export type * from "./shared/types";

// ─── auth ──────────────────────────────────────────────────────────────────
export * from "./auth/login";
export * from "./auth/register";
export * from "./auth/logout";
export * from "./auth/logout-all";
export * from "./auth/refresh-token";
export * from "./auth/request-password-reset";
export * from "./auth/confirm-password-reset";
export { useSession } from "./auth/session";

// ─── me ────────────────────────────────────────────────────────────────────
export type * from "./me/types";
export * from "./me/get-me";
export * from "./me/update-me";
export * from "./me/get-notifications";
export * from "./me/update-notifications";

// ─── account ───────────────────────────────────────────────────────────────
export * from "./account/export-account";
export * from "./account/delete-account";

// ─── catalog ───────────────────────────────────────────────────────────────
export type * from "./catalog/types";
export * from "./catalog/get-subjects";
export * from "./catalog/get-subject-topics";

// ─── tests ─────────────────────────────────────────────────────────────────
export type * from "./tests/types";
export * from "./tests/get-tests";
export * from "./tests/get-test";
export * from "./tests/start-test";

// ─── sessions ──────────────────────────────────────────────────────────────
export type * from "./sessions/types";
export * from "./sessions/get-sessions";
export * from "./sessions/get-session";
export * from "./sessions/save-answer";
export * from "./sessions/close-section";
export * from "./sessions/submit-session";
export * from "./sessions/get-session-result";
export * from "./sessions/get-session-strategy";

// ─── checkpoints ───────────────────────────────────────────────────────────
export * from "./checkpoints/get-checkpoints";
export * from "./checkpoints/create-self-reported-checkpoint";

// ─── practice ──────────────────────────────────────────────────────────────
export type * from "./practice/types";
export * from "./practice/start-practice";
export * from "./practice/get-practice";
export * from "./practice/answer-practice";
export * from "./practice/finish-practice";

// ─── mistakes ──────────────────────────────────────────────────────────────
export type * from "./mistakes/types";
export * from "./mistakes/get-mistakes";
export * from "./mistakes/update-mistake";

// ─── review ────────────────────────────────────────────────────────────────
export * from "./review/get-review-queue";
export * from "./review/answer-review";
export * from "./review/snooze-review";

// ─── goals ─────────────────────────────────────────────────────────────────
export type * from "./goals/types";
export * from "./goals/get-goal";
export * from "./goals/set-goal";
export * from "./goals/archive-goal";
export * from "./goals/get-goal-progress";

// ─── plan ──────────────────────────────────────────────────────────────────
export type * from "./plan/types";
export * from "./plan/get-plan";
export * from "./plan/rebuild-plan";
export * from "./plan/get-today-plan";
export * from "./plan/update-plan-item";
export * from "./plan/get-skills-roi";
export * from "./plan/get-prediction";

// ─── stats ─────────────────────────────────────────────────────────────────
export * from "./stats/get-stats-overview";
export * from "./stats/get-stats-skills";
export * from "./stats/get-score-trajectory";
export * from "./stats/get-achievements";
export * from "./stats/get-weekly-report";

// ─── tutor ─────────────────────────────────────────────────────────────────
export * from "./tutor/explain-question";
export * from "./tutor/report-question";

// ─── telegram ──────────────────────────────────────────────────────────────
export * from "./telegram/create-link-token";
export * from "./telegram/unlink-telegram";

// ─── universities ──────────────────────────────────────────────────────────
export * from "./universities/get-university-programs";

// ─── media ─────────────────────────────────────────────────────────────────
export * from "./media/get-media";

// ─── admin (CMS, пользователи, экзамены, контент) ─────────────────────────
export * from "./admin";
