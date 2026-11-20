/**
 * ДЕМО-ДАННЫЕ для экранов, у которых на бэкенде ещё нет API:
 * олимпиады и домашние задания ученика.
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
