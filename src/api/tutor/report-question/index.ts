import { useMutation } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import type { ReportQuestionRequest, ReportQuestionResponse } from "./types";

// POST /api/v1/question-reports → 201 (уходит команде контента)
export const reportQuestion = async (data: ReportQuestionRequest) => {
  const res = await api.post<ReportQuestionResponse>("/question-reports", data);
  return res.data;
};

export const useReportQuestion = () =>
  useMutation<ReportQuestionResponse, ApiError, ReportQuestionRequest>({
    mutationFn: reportQuestion,
  });

export type * from "./types";
