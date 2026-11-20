// Модели, общие для endpoint-ов модуля me

/** Swagger: NotificationsOut */
export interface NotificationSettings {
  telegram_enabled: boolean;
  telegram_linked: boolean;
  /** Часы — в часовом поясе ученика */
  reminder_hour: number;
  quiet_start: number;
  quiet_end: number;
  weekly_report: boolean;
}
