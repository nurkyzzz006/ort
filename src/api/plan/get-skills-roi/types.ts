/** Swagger: RoiItem — навык и сколько баллов он даёт за час практики */
export interface SkillRoi {
  skill_id: string; // uuid
  skill_code: string;
  title_ky: string;
  title_ru: string;
  section_code: string;
  mastery: number;
  answers: number;
  expected_questions: number;
  potential_gain: number;
  minutes: number;
  roi: number;
}

/** Swagger: RoiItem[] — «где больше всего баллов», по убыванию ROI */
export type GetSkillsRoiResponse = SkillRoi[];
