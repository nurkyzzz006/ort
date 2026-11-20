/** Swagger: SkillStatOut — статистика по навыку */
export interface SkillStat {
  skill_id: string; // uuid
  skill_code: string;
  title_ky: string;
  title_ru: string;
  answers: number;
  accuracy: number;
  mastery: number;
  mastered: boolean;
  avg_time_sec: number;
  last_answer_at: string | null;
}

/** Swagger: SkillStatOut[] */
export type GetStatsSkillsResponse = SkillStat[];
