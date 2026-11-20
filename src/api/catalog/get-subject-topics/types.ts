import type { TopicNode } from "../types";

/** Swagger: GET /subjects/{subject_id}/topics → TopicNode[] (только активные) */
export type GetSubjectTopicsResponse = TopicNode[];
