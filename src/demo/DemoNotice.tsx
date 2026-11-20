"use client";
import { LuFlaskConical } from "react-icons/lu";
import { useT } from "@/i18n";
import { useSettings } from "@/settings/SettingsProvider";
import type { L } from "./data";
import scss from "./DemoNotice.module.scss";

/** Плашка: экран показывает демо-данные, API для него ещё нет */
const DemoNotice = ({ endpoints }: { endpoints?: string }) => {
  const t = useT();
  return (
    <div className={scss.notice} role="note">
      <LuFlaskConical aria-hidden />
      <p>
        <strong>{t.demo.title}</strong> {t.demo.text}
        {endpoints && <code>{endpoints}</code>}
      </p>
    </div>
  );
};

/** Текст демо-данных на текущем языке */
export const useL = () => {
  const { locale } = useSettings();
  return (text: L) => text[locale];
};

export default DemoNotice;
