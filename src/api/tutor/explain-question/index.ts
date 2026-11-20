import { useMutation } from "@tanstack/react-query";
import { api, type ApiError } from "../../axios";
import type { ExplainQuestionRequest, ExplainQuestionResponse } from "./types";

// POST /api/v1/tutor/explain — AI-мугалим
export const explainQuestion = async (data: ExplainQuestionRequest) => {
  const res = await api.post<ExplainQuestionResponse>("/tutor/explain", data);
  return res.data;
};

/** Каждый вызов расходует дневной лимит — поэтому mutation, а не авто-запрос */
export const useExplainQuestion = () =>
  useMutation<ExplainQuestionResponse, ApiError, ExplainQuestionRequest>({
    mutationFn: explainQuestion,
  });

export type * from "./types";
