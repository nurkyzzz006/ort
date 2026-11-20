"use client";
import { LuMonitor, LuMoon, LuSun } from "react-icons/lu";
import { useT } from "@/i18n";
import { useSettings } from "@/settings/SettingsProvider";
import type { ThemePreference } from "@/settings/constants";
import scss from "./common.module.scss";

const ORDER: ThemePreference[] = ["light", "dark", "system"];
const ICONS = { light: <LuSun />, dark: <LuMoon />, system: <LuMonitor /> };

/** Светлая → тёмная → как в системе */
const ThemeSwitch = () => {
  const t = useT();
  const { theme, setTheme } = useSettings();
  const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
  const label = `${t.theme.title}: ${t.theme[theme]}. ${t.theme.switchTo} ${t.theme[next]}`;

  return (
    <button
      type="button"
      className={scss.iconButton}
      onClick={() => setTheme(next)}
      aria-label={label}
      title={label}
    >
      {ICONS[theme]}
    </button>
  );
};

export default ThemeSwitch;
