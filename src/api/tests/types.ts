// Модели, общие для endpoint-ов модуля tests
import type { Locale, ScaleKind, TestKind } from "../shared/types";

/** Swagger: TestSectionOut */
export interface TestSection {
  code: string;
  title_ky: string;
  title_ru: string;
  question_count: number;
  time_limit_sec: number;
}

/** Swagger: TestOut — опубликованный тест */
export interface Test {
  id: string; // uuid
  code: string;
  title_ky: string;
  title_ru: string;
  kind: TestKind;
  language: Locale;
  subject_id: string | null;
  question_count: number;
  time_limit_sec: number;
  sections: TestSection[];
  scale_kind: ScaleKind | null;
}
