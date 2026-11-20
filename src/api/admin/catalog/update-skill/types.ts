import type { Skill } from "../../../shared/types";
import type { SkillUpdateIn } from "../../types";

export type UpdateSkillBody = SkillUpdateIn;

/** Параметры PATCH /admin/skills/{skill_id} */
export interface UpdateSkillRequest {
  skillId: string; // uuid
  data: UpdateSkillBody;
}

/** Swagger: PATCH /admin/skills/{skill_id} */
export type UpdateSkillResponse = Skill;
