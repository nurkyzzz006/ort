"use client";
import { useRouter } from "next/navigation";
import { useStartPractice, useStartTest } from "@/api";

/** Начать практику (по навыку, теме или пункту плана) и открыть её */
export const useOpenPractice = () => {
  const router = useRouter();
  const mutation = useStartPractice();

  const open = (params: {
    skillId?: string | null;
    topicId?: string | null;
    planItemId?: string;
    /** 1…30, по умолчанию на сервере — 10 */
    count?: number;
  }) =>
    mutation.mutate(
      {
        skill_id: params.skillId ?? null,
        topic_id: params.topicId ?? null,
        plan_item_id: params.planItemId ?? null,
        ...(params.count ? { count: params.count } : {}),
      },
      { onSuccess: (practice) => router.push(`/dashboard/practice?session=${practice.id}`) },
    );

  return { open, mutation };
};

/** Начать тест (или вернуться в незавершённую сессию) и открыть экран экзамена */
export const useOpenTest = () => {
  const router = useRouter();
  const mutation = useStartTest();

  const open = (testId: string) =>
    mutation.mutate(
      { testId },
      { onSuccess: (session) => router.push(`/dashboard/tester/${session.id}`) },
    );

  return { open, mutation };
};
