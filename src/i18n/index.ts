"use client";
import { useSettings } from "@/settings/SettingsProvider";
import type { UiLocale } from "@/settings/constants";
import { ky } from "./ky";
import { ru } from "./ru";

/** Структура словаря задаётся кыргызской версией; русская обязана ей соответствовать */
export type Dictionary = typeof ky;

const dictionaries: Record<UiLocale, Dictionary> = { ky, ru };

export const getDictionary = (locale: UiLocale): Dictionary => dictionaries[locale];

/** Тексты интерфейса на текущем языке */
export const useT = (): Dictionary => {
  const { locale } = useSettings();
  return dictionaries[locale];
};

/** Выбор поля title_ky / title_ru из данных бэкенда */
export const pickTitle = (
  item: { title_ky: string; title_ru: string } | null | undefined,
  locale: UiLocale,
): string => (item ? (locale === "ru" ? item.title_ru : item.title_ky) || item.title_ky : "");
