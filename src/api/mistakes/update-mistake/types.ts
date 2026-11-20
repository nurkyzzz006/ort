import type { MistakeReason } from "../../shared/types";
import type { MistakeCard } from "../types";

/** Swagger: CardUpdateIn — причина ошибки или архивирование/восстановление */
export interface UpdateMistakeBody {
  reason?: MistakeReason | null;
  archived?: boolean | null;
}

/** Параметры PATCH /mistakes/{card_id} */
export interface UpdateMistakeRequest {
  cardId: string; // uuid
  data: UpdateMistakeBody;
}

/** Swagger: CardOut */
export type UpdateMistakeResponse = MistakeCard;
