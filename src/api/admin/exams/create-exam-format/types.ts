import type { ExamFormatIn, ExamFormatVersion } from "../../types";

export type CreateExamFormatBody = ExamFormatIn;

export type CreateExamFormatRequest = CreateExamFormatBody;

/** Swagger: POST /admin/exam-formats */
export type CreateExamFormatResponse = ExamFormatVersion;
