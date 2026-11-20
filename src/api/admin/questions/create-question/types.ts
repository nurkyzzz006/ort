import type { QuestionAdmin, QuestionCreateIn } from "../../types";

export type CreateQuestionBody = QuestionCreateIn;

export type CreateQuestionRequest = CreateQuestionBody;

/** Swagger: POST /admin/questions */
export type CreateQuestionResponse = QuestionAdmin;
