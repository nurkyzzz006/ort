import type { Subject } from "../../../catalog/types";
import type { SubjectUpdateIn } from "../../types";

export type UpdateSubjectBody = SubjectUpdateIn;

/** Параметры PATCH /admin/subjects/{subject_id} */
export interface UpdateSubjectRequest {
  subjectId: string; // uuid
  data: UpdateSubjectBody;
}

/** Swagger: PATCH /admin/subjects/{subject_id} */
export type UpdateSubjectResponse = Subject;
