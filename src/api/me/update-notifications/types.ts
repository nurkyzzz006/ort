import type { NotificationSettings } from "../types";

/** Swagger: NotificationsIn — передавайте только изменяемые поля */
export interface UpdateNotificationsRequest {
  telegram_enabled?: boolean | null;
  reminder_hour?: number | null;
  quiet_start?: number | null;
  quiet_end?: number | null;
  weekly_report?: boolean | null;
}

/** Swagger: NotificationsOut */
export type UpdateNotificationsResponse = NotificationSettings;
