import type { QueryClient, QueryKey } from "@tanstack/react-query";

// Все Query Keys в одном месте. Ключи иерархические:
// invalidateQueries({ queryKey: queryKeys.sessions.all }) сбросит
// и список сессий, и каждую сессию, и их результаты.

type Params = object | undefined;

export const queryKeys = {
  me: {
    all: ["me"] as const,
    profile: () => [...queryKeys.me.all, "profile"] as const,
    notifications: () => [...queryKeys.me.all, "notifications"] as const,
  },
  catalog: {
    all: ["catalog"] as const,
    subjects: () => [...queryKeys.catalog.all, "subjects"] as const,
    topics: (subjectId: string) =>
      [...queryKeys.catalog.all, "topics", subjectId] as const,
  },
  tests: {
    all: ["tests"] as const,
    list: (params?: Params) => [...queryKeys.tests.all, "list", params ?? {}] as const,
    detail: (testId: string) => [...queryKeys.tests.all, "detail", testId] as const,
  },
  sessions: {
    all: ["sessions"] as const,
    list: (params?: Params) =>
      [...queryKeys.sessions.all, "list", params ?? {}] as const,
    detail: (sessionId: string) =>
      [...queryKeys.sessions.all, "detail", sessionId] as const,
    result: (sessionId: string) =>
      [...queryKeys.sessions.all, "result", sessionId] as const,
    strategy: (sessionId: string) =>
      [...queryKeys.sessions.all, "strategy", sessionId] as const,
  },
  checkpoints: {
    all: ["checkpoints"] as const,
    list: () => [...queryKeys.checkpoints.all, "list"] as const,
  },
  practice: {
    all: ["practice"] as const,
    detail: (sessionId: string) =>
      [...queryKeys.practice.all, "detail", sessionId] as const,
  },
  mistakes: {
    all: ["mistakes"] as const,
    list: (params?: Params) =>
      [...queryKeys.mistakes.all, "list", params ?? {}] as const,
  },
  review: {
    all: ["review"] as const,
    queue: () => [...queryKeys.review.all, "queue"] as const,
  },
  goals: {
    all: ["goals"] as const,
    current: () => [...queryKeys.goals.all, "current"] as const,
    progress: () => [...queryKeys.goals.all, "progress"] as const,
  },
  plan: {
    all: ["plan"] as const,
    current: () => [...queryKeys.plan.all, "current"] as const,
    today: () => [...queryKeys.plan.all, "today"] as const,
    skillsRoi: () => [...queryKeys.plan.all, "skills-roi"] as const,
    prediction: () => [...queryKeys.plan.all, "prediction"] as const,
  },
  stats: {
    all: ["stats"] as const,
    overview: (periodDays?: number) =>
      [...queryKeys.stats.all, "overview", periodDays ?? null] as const,
    skills: () => [...queryKeys.stats.all, "skills"] as const,
    trajectory: () => [...queryKeys.stats.all, "trajectory"] as const,
    achievements: () => [...queryKeys.stats.all, "achievements"] as const,
    weeklyReport: () => [...queryKeys.stats.all, "weekly-report"] as const,
  },
  universities: {
    all: ["universities"] as const,
    programs: (params?: Params) =>
      [...queryKeys.universities.all, "programs", params ?? {}] as const,
  },
  media: {
    all: ["media"] as const,
    detail: (mediaId: string) => [...queryKeys.media.all, mediaId] as const,
  },
  admin: {
    all: ["admin"] as const,
    subjects: () => [...queryKeys.admin.all, "subjects"] as const,
    topicsAll: () => [...queryKeys.admin.all, "topics"] as const,
    topics: (subjectId: string) => [...queryKeys.admin.topicsAll(), subjectId] as const,
    usersAll: () => [...queryKeys.admin.all, "users"] as const,
    users: (params?: Params) => [...queryKeys.admin.usersAll(), params ?? {}] as const,
    questionsAll: () => [...queryKeys.admin.all, "questions"] as const,
    questions: (params?: Params) => [...queryKeys.admin.questionsAll(), "list", params ?? {}] as const,
    question: (versionId: string) => [...queryKeys.admin.questionsAll(), "version", versionId] as const,
    reviews: (versionId: string) => [...queryKeys.admin.questionsAll(), "reviews", versionId] as const,
    reportsAll: () => [...queryKeys.admin.all, "reports"] as const,
    reports: (params?: Params) => [...queryKeys.admin.reportsAll(), params ?? {}] as const,
    formats: () => [...queryKeys.admin.all, "exam-formats"] as const,
    testsAll: () => [...queryKeys.admin.all, "tests"] as const,
    tests: () => [...queryKeys.admin.testsAll(), "list"] as const,
    testValidation: (testId: string) => [...queryKeys.admin.testsAll(), "validate", testId] as const,
  },
} as const;

/**
 * Всё, что меняется, когда ученик решает задания (тест, практика, повторение):
 * статистика, прогноз, цель, план, журнал ошибок, очередь повторения.
 */
export const LEARNING_PROGRESS_KEYS: readonly QueryKey[] = [
  queryKeys.sessions.all,
  queryKeys.checkpoints.all,
  queryKeys.stats.all,
  queryKeys.goals.all,
  queryKeys.plan.all,
  queryKeys.mistakes.all,
  queryKeys.review.all,
];

/** Инвалидирует несколько групп ключей за один вызов */
export const invalidateKeys = (
  queryClient: QueryClient,
  keys: readonly QueryKey[],
) =>
  Promise.all(keys.map((queryKey) => queryClient.invalidateQueries({ queryKey })));
