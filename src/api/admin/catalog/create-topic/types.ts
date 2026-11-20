import type { TopicCreateIn, TopicOut } from "../../types";

export type CreateTopicBody = TopicCreateIn;

export type CreateTopicRequest = CreateTopicBody;

/** Swagger: POST /admin/topics */
export type CreateTopicResponse = TopicOut;
