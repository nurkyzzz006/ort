import type { Subject } from "../../../catalog/types";
import type { SubjectCreateIn } from "../../types";

export type CreateSubjectBody = SubjectCreateIn;

export type CreateSubjectRequest = CreateSubjectBody;

/** Swagger: POST /admin/subjects */
export type CreateSubjectResponse = Subject;
