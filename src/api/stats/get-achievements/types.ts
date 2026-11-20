/** Swagger: AchievementOut */
export interface Achievement {
  code: string;
  ref: string;
  context: Record<string, unknown> | null;
  earned_at: string; // date-time
}

/** Swagger: AchievementOut[] */
export type GetAchievementsResponse = Achievement[];
