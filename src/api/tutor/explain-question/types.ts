/** Swagger: TutorMode */
export type TutorMode = "short" | "detailed" | "example";

/** Swagger: TutorIn — объяснить вопрос, на который ученик уже ответил */
export interface ExplainQuestionRequest {
  question_version_id: string; // uuid
  mode?: TutorMode; // default: "short"
}

/** Swagger: TutorOut */
export interface ExplainQuestionResponse {
  content: string;
  /** Кто автор текста: ИИ или проверенное решение */
  source: string;
  mode: TutorMode;
  cached: boolean;
  /** Сколько объяснений осталось на сегодня */
  remaining_today: number;
}
