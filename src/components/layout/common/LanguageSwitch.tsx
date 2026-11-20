"use client";
import { useRouter } from "next/navigation";
import { useSession, useUpdateMe } from "@/api";
import Segmented from "@/components/ui/Segmented";
import { useT } from "@/i18n";
import { useSettings } from "@/settings/SettingsProvider";
import { UI_LOCALES, type UiLocale } from "@/settings/constants";

/**
 * KY | RU. Меняет язык без перезагрузки — состояние страницы сохраняется.
 * У вошедшего пользователя язык сохраняется и в профиле (PATCH /me),
 * чтобы контент бэкенда (title_ky / title_ru, вопросы) пришёл на нём же.
 */
const LanguageSwitch = () => {
  const t = useT();
  const router = useRouter();
  const { locale, setLocale } = useSettings();
  const { isAuthenticated, user } = useSession();
  const updateMe = useUpdateMe();

  const onChange = (next: UiLocale) => {
    if (next === locale) return;
    setLocale(next);
    router.refresh(); // серверные компоненты перерисуются с новым языком
    if (isAuthenticated && user?.locale !== next) updateMe.mutate({ locale: next });
  };

  return (
    <Segmented
      variant="switch"
      ariaLabel={t.common.language}
      value={locale}
      onChange={onChange}
      options={UI_LOCALES.map((l) => ({ value: l, label: l.toUpperCase() }))}
    />
  );
};

export default LanguageSwitch;
