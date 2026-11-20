import type { TopicNode } from "../../../catalog/types";

/** Параметры GET /admin/subjects/{subject_id}/topics */
export interface GetAdminSubjectTopicsRequest {
  subjectId: string; // uuid
}

/** Swagger: GET /admin/subjects/{subject_id}/topics */
export type GetAdminSubjectTopicsResponse = TopicNode[];
