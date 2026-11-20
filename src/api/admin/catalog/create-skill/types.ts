import type { Skill } from "../../../shared/types";
import type { SkillCreateIn } from "../../types";

export type CreateSkillBody = SkillCreateIn;

export type CreateSkillRequest = CreateSkillBody;

/** Swagger: POST /admin/skills */
export type CreateSkillResponse = Skill;
