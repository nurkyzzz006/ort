import type { TopicOut, TopicUpdateIn } from "../../types";

export type UpdateTopicBody = TopicUpdateIn;

/** Параметры PATCH /admin/topics/{topic_id} */
export interface UpdateTopicRequest {
  topicId: string; // uuid
  data: UpdateTopicBody;
}

/** Swagger: PATCH /admin/topics/{topic_id} */
export type UpdateTopicResponse = TopicOut;
