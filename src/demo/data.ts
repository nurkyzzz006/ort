/**
 * ДЕМО-ДАННЫЕ для экранов, у которых на бэкенде ещё нет API:
 * родитель, учитель, системный админ, олимпиады, домашние задания.
 * Экраны с этими данными помечены плашкой «Демо» (DemoNotice).
 * Когда бэкенд добавит endpoint-ы — заменить импорт на хук из src/api, разметка не меняется.
 */

/** Текст на двух языках */
export interface L {
  ky: string;
  ru: string;
}

const l = (ky: string, ru: string): L => ({ ky, ru });

// ─── Общие ────────────────────────────────────────────────────────────────

export type HomeworkStatus = "pending" | "done" | "late" | "review";
export type PlanStatus = "ahead" | "on_track" | "behind";

export interface DemoPoint {
  label: string;
  value: number;
}

// ─── Домашние задания (ученик) ────────────────────────────────────────────

export interface DemoHomework {
  id: string;
  title: L;
  subject: L;
  teacher: string;
  due: string; // ISO
  questions: number;
  minutes: number;
  status: HomeworkStatus;
  score?: number;
  max?: number;
}

export const studentHomework: DemoHomework[] = [
  { id: "hw1", title: l("Квадраттык теңдемелер · 15 суроо", "Квадратные уравнения · 15 вопросов"), subject: l("Математика", "Математика"), teacher: "Б. Асанова", due: "2026-11-24T18:00:00Z", questions: 15, minutes: 30, status: "pending" },
  { id: "hw2", title: l("Окуп түшүнүү · текст №4", "Понимание прочитанного · текст №4"), subject: l("Кыргыз тили", "Кыргызский язык"), teacher: "А. Токтосунова", due: "2026-11-22T18:00:00Z", questions: 10, minutes: 25, status: "late" },
  { id: "hw3", title: l("Логарифмдер · кайталоо", "Логарифмы · повторение"), subject: l("Математика", "Математика"), teacher: "Б. Асанова", due: "2026-11-20T18:00:00Z", questions: 12, minutes: 20, status: "done", score: 10, max: 12 },
  { id: "hw4", title: l("Пассив конструкциялар", "Пассивные конструкции"), subject: l("Орус тили", "Русский язык"), teacher: "Е. Петрова", due: "2026-11-19T18:00:00Z", questions: 8, minutes: 15, status: "review", score: 6, max: 8 },
];

// ─── Олимпиадалар ─────────────────────────────────────────────────────────

export type OlympiadLevel = "school" | "district" | "republic" | "international";
export type OlympiadStatus = "open" | "upcoming" | "finished";

export interface DemoOlympiad {
  id: string;
  title: L;
  subject: L;
  level: OlympiadLevel;
  date: string;
  registrationUntil: string;
  status: OlympiadStatus;
  format: "online" | "offline";
  participants: number;
  myResult?: { place: number; score: number; max: number };
}

export const olympiads: DemoOlympiad[] = [
  { id: "ol1", title: l("Республикалык математика олимпиадасы", "Республиканская олимпиада по математике"), subject: l("Математика", "Математика"), level: "republic", date: "2026-12-12T04:00:00Z", registrationUntil: "2026-12-01T18:00:00Z", status: "open", format: "offline", participants: 1240 },
  { id: "ol2", title: l("Кыргыз тили боюнча онлайн олимпиада", "Онлайн-олимпиада по кыргызскому языку"), subject: l("Кыргыз тили", "Кыргызский язык"), level: "district", date: "2026-11-30T05:00:00Z", registrationUntil: "2026-11-27T18:00:00Z", status: "open", format: "online", participants: 486 },
  { id: "ol3", title: l("Жаш физиктер · мектеп этабы", "Юные физики · школьный этап"), subject: l("Физика", "Физика"), level: "school", date: "2027-01-18T05:00:00Z", registrationUntil: "2027-01-10T18:00:00Z", status: "upcoming", format: "offline", participants: 0 },
  { id: "ol4", title: l("Эл аралык логика олимпиадасы", "Международная олимпиада по логике"), subject: l("Логика", "Логика"), level: "international", date: "2027-02-20T06:00:00Z", registrationUntil: "2027-02-01T18:00:00Z", status: "upcoming", format: "online", participants: 0 },
  { id: "ol5", title: l("Тарых олимпиадасы · райондук этап", "Олимпиада по истории · районный этап"), subject: l("Тарых", "История"), level: "district", date: "2026-10-25T05:00:00Z", registrationUntil: "2026-10-15T18:00:00Z", status: "finished", format: "offline", participants: 312, myResult: { place: 7, score: 64, max: 80 } },
];

// ─── Ата-эне (родитель) ───────────────────────────────────────────────────

export interface DemoChild {
  id: string;
  name: string;
  grade: L;
  start: number;
  now: number;
  target: number;
  examDate: string;
  streak: number;
  accuracy: number; // 0…1
  solvedWeek: number;
  minutesWeek: number;
  planDone: number;
  planTotal: number;
  status: PlanStatus;
  trajectory: DemoPoint[];
  weak: { title: L; mastery: number }[];
  homework: { title: L; due: string; status: HomeworkStatus; score?: string }[];
  lastActive: string;
}

export const children: DemoChild[] = [
  {
    id: "c1",
    name: "Айбек Токтогулов",
    grade: l("11-класс", "11 класс"),
    start: 90,
    now: 128,
    target: 200,
    examDate: "2027-05-20T04:00:00Z",
    streak: 12,
    accuracy: 0.78,
    solvedWeek: 142,
    minutesWeek: 310,
    planDone: 18,
    planTotal: 21,
    status: "on_track",
    trajectory: [
      { label: "09.09", value: 90 },
      { label: "30.09", value: 104 },
      { label: "21.10", value: 113 },
      { label: "11.11", value: 128 },
    ],
    weak: [
      { title: l("Квадраттык теңдемелер", "Квадратные уравнения"), mastery: 0.46 },
      { title: l("Ыктымалдык", "Вероятность"), mastery: 0.58 },
    ],
    homework: [
      { title: l("Квадраттык теңдемелер", "Квадратные уравнения"), due: "2026-11-24T18:00:00Z", status: "pending" },
      { title: l("Логарифмдер · кайталоо", "Логарифмы · повторение"), due: "2026-11-20T18:00:00Z", status: "done", score: "10/12" },
    ],
    lastActive: "2026-11-21T07:40:00Z",
  },
  {
    id: "c2",
    name: "Айжан Токтогулова",
    grade: l("10-класс", "10 класс"),
    start: 110,
    now: 117,
    target: 180,
    examDate: "2028-05-20T04:00:00Z",
    streak: 3,
    accuracy: 0.64,
    solvedWeek: 48,
    minutesWeek: 95,
    planDone: 6,
    planTotal: 14,
    status: "behind",
    trajectory: [
      { label: "15.09", value: 110 },
      { label: "13.10", value: 112 },
      { label: "10.11", value: 117 },
    ],
    weak: [
      { title: l("Окуп түшүнүү", "Понимание текста"), mastery: 0.41 },
      { title: l("Пропорциялар", "Пропорции"), mastery: 0.55 },
    ],
    homework: [
      { title: l("Окуп түшүнүү · текст №4", "Понимание текста · №4"), due: "2026-11-22T18:00:00Z", status: "late" },
    ],
    lastActive: "2026-11-19T15:10:00Z",
  },
];

// ─── Мугалим (учитель) ────────────────────────────────────────────────────

export interface DemoClass {
  id: string;
  name: string;
  subject: L;
  students: number;
  avgScore: number;
  avgAccuracy: number;
  activeHomework: number;
  behind: number;
}

export const classes: DemoClass[] = [
  { id: "k1", name: "11-А", subject: l("Математика", "Математика"), students: 26, avgScore: 134, avgAccuracy: 0.72, activeHomework: 2, behind: 4 },
  { id: "k2", name: "11-Б", subject: l("Математика", "Математика"), students: 24, avgScore: 121, avgAccuracy: 0.66, activeHomework: 1, behind: 7 },
  { id: "k3", name: "10-А", subject: l("Математика", "Математика"), students: 28, avgScore: 108, avgAccuracy: 0.61, activeHomework: 1, behind: 5 },
];

export interface DemoStudent {
  id: string;
  name: string;
  classId: string;
  score: number;
  delta: number;
  accuracy: number;
  streak: number;
  homeworkDone: number;
  homeworkTotal: number;
  status: PlanStatus;
  lastActive: string;
}

export const students: DemoStudent[] = [
  { id: "s1", name: "Айбек Т.", classId: "k1", score: 128, delta: 15, accuracy: 0.78, streak: 12, homeworkDone: 5, homeworkTotal: 6, status: "on_track", lastActive: "2026-11-21T07:40:00Z" },
  { id: "s2", name: "Нурай К.", classId: "k1", score: 162, delta: 22, accuracy: 0.86, streak: 21, homeworkDone: 6, homeworkTotal: 6, status: "ahead", lastActive: "2026-11-21T06:12:00Z" },
  { id: "s3", name: "Эмир С.", classId: "k1", score: 96, delta: -3, accuracy: 0.52, streak: 0, homeworkDone: 2, homeworkTotal: 6, status: "behind", lastActive: "2026-11-15T12:00:00Z" },
  { id: "s4", name: "Адинай М.", classId: "k1", score: 141, delta: 9, accuracy: 0.74, streak: 6, homeworkDone: 6, homeworkTotal: 6, status: "on_track", lastActive: "2026-11-20T17:30:00Z" },
  { id: "s5", name: "Бектур Ж.", classId: "k1", score: 110, delta: 4, accuracy: 0.6, streak: 2, homeworkDone: 4, homeworkTotal: 6, status: "behind", lastActive: "2026-11-19T09:20:00Z" },
  { id: "s6", name: "Сезим А.", classId: "k1", score: 150, delta: 18, accuracy: 0.81, streak: 14, homeworkDone: 6, homeworkTotal: 6, status: "ahead", lastActive: "2026-11-21T05:50:00Z" },
];

export interface DemoAssignment {
  id: string;
  title: L;
  classId: string;
  className: string;
  due: string;
  submitted: number;
  total: number;
  avgScore: number | null;
  status: "active" | "closed" | "draft";
}

export const assignments: DemoAssignment[] = [
  { id: "a1", title: l("Квадраттык теңдемелер · 15 суроо", "Квадратные уравнения · 15 вопросов"), classId: "k1", className: "11-А", due: "2026-11-24T18:00:00Z", submitted: 14, total: 26, avgScore: 0.71, status: "active" },
  { id: "a2", title: l("Логарифмдер · кайталоо", "Логарифмы · повторение"), classId: "k1", className: "11-А", due: "2026-11-20T18:00:00Z", submitted: 25, total: 26, avgScore: 0.79, status: "closed" },
  { id: "a3", title: l("Пропорциялар", "Пропорции"), classId: "k2", className: "11-Б", due: "2026-11-26T18:00:00Z", submitted: 6, total: 24, avgScore: 0.63, status: "active" },
  { id: "a4", title: l("Ыктымалдык · киришүү", "Вероятность · введение"), classId: "k3", className: "10-А", due: "2026-11-28T18:00:00Z", submitted: 0, total: 28, avgScore: null, status: "draft" },
];

// ─── Системный админ ──────────────────────────────────────────────────────

export type ServiceState = "ok" | "degraded" | "down";

export const services: { name: string; role: L; state: ServiceState; latencyMs: number | null; version: string }[] = [
  { name: "PostgreSQL", role: l("Негизги маалымат базасы", "Основная база данных"), state: "ok", latencyMs: 4, version: "16.4" },
  { name: "Redis", role: l("Кэш, лимиттер, кезек", "Кэш, лимиты, очереди"), state: "ok", latencyMs: 1, version: "7.2" },
  { name: "Worker", role: l("Кайталоо, прогноз, отчёттор", "Повторение, прогноз, отчёты"), state: "ok", latencyMs: null, version: "1.8.0" },
  { name: "Telegram bot", role: l("aiogram webhook", "aiogram webhook"), state: "degraded", latencyMs: 420, version: "1.3.2" },
  { name: "LLM adapter", role: l("AI-мугалим", "AI-учитель"), state: "ok", latencyMs: 1800, version: "0.9.1" },
  { name: "Object storage", role: l("Медиа файлдар", "Медиафайлы"), state: "ok", latencyMs: 35, version: "S3" },
];

export const metrics = { p95: 412, errorRate: 0.003, aiCallsDay: 1942, uptime: 0.9978 };

export const backups: { at: string; size: string; kind: L; ok: boolean }[] = [
  { at: "2026-11-21T03:00:00Z", size: "2.4 GB", kind: l("Толук · күнүмдүк", "Полный · ежедневный"), ok: true },
  { at: "2026-11-20T03:00:00Z", size: "2.4 GB", kind: l("Толук · күнүмдүк", "Полный · ежедневный"), ok: true },
  { at: "2026-11-19T03:00:00Z", size: "2.3 GB", kind: l("Толук · күнүмдүк", "Полный · ежедневный"), ok: true },
];

export const auditLog: { at: string; actor: string; action: L; object: string }[] = [
  { at: "2026-11-21T08:12:00Z", actor: "admin@orto.kg", action: l("Шкаланы жарыялады", "Опубликовал шкалу"), object: "ort_main v3" },
  { at: "2026-11-21T07:55:00Z", actor: "editor@orto.kg", action: l("Импорт (dry-run)", "Импорт (dry-run)"), object: "questions_nov.csv" },
  { at: "2026-11-20T16:31:00Z", actor: "admin@orto.kg", action: l("Ролду өзгөрттү", "Изменил роль"), object: "user 8f3c… → expert" },
  { at: "2026-11-20T11:02:00Z", actor: "expert@orto.kg", action: l("Суроону бекитти", "Одобрил вопрос"), object: "Q-1054" },
];
