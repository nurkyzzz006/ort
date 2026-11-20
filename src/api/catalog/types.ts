// Модели, общие для endpoint-ов модуля catalog
import type { Skill } from "../shared/types";

/** Swagger: SubjectOut */
export interface Subject {
  id: string; // uuid
  code: string;
  title_ky: string;
  title_ru: string;
  order: number;
  active: boolean;
}

/** Swagger: TopicNode — узел дерева тем с навыками */
export interface TopicNode {
  id: string; // uuid
  subject_id: string; // uuid
  parent_id: string | null;
  title_ky: string;
  title_ru: string;
  order: number;
  active: boolean;
  skills?: Skill[]; // default: []
  children?: TopicNode[]; // default: []
}
