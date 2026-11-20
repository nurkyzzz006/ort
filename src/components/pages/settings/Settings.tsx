"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LuDownload, LuLogOut, LuSend, LuTrash2, LuUnlink } from "react-icons/lu";
import {
  getErrorMessage,
  useArchiveGoal,
  useCreateLinkToken,
  useCreateSelfReportedCheckpoint,
  useDeleteAccount,
  useExportAccount,
  useGetGoal,
  useGetNotifications,
  useLogoutAll,
  useSession,
  useSetGoal,
  useUnlinkTelegram,
  useUpdateMe,
  useUpdateNotifications,
  type GradeStatus,
} from "@/api";
import LanguageSwitch from "@/components/layout/common/LanguageSwitch";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import Segmented from "@/components/ui/Segmented";
import { ErrorState, Skeleton } from "@/components/ui/StateView";
import { useT } from "@/i18n";
import { formatDate } from "@/i18n/format";
import { useSettings } from "@/settings/SettingsProvider";
import type { ThemePreference } from "@/settings/constants";
import scss from "./Settings.module.scss";

const GRADES: GradeStatus[] = ["grade_10", "grade_11", "graduate", "other"];
const THEMES: ThemePreference[] = ["light", "dark", "system"];

/** Настройки (ТЗ 9.2: профиль, язык, уведомления, Telegram, безопасность, export/delete) */
const Settings = () => {
  const t = useT();
  return (
    <>
      <PageHeader title={t.settings.title} subtitle={t.settings.subtitle} />
      <div className={scss.grid}>
        <ProfileCard />
        <AppearanceCard />
        <GoalCard />
        <NotificationsCard />
        <TelegramCard />
        <SecurityCard />
      </div>
    </>
  );
};

const Status = ({ ok, error, text }: { ok: boolean; error: unknown; text?: string }) => {
  const t = useT();
  if (error) return <p className={scss.error} role="alert">{getErrorMessage(error, t.errors)}</p>;
  if (ok) return <p className={scss.ok} role="status">{text ?? t.common.saved}</p>;
  return null;
};

// ── Профиль ──
const ProfileCard = () => {
  const t = useT();
  const { user, isLoading } = useSession();
  const updateMe = useUpdateMe();
  const { register, handleSubmit, formState } = useForm({
    values: {
      display_name: user?.display_name ?? "",
      grade_status: (user?.grade_status ?? "") as GradeStatus | "",
      timezone: user?.timezone ?? "",
    },
  });

  if (isLoading) return <Skeleton height={260} />;

  return (
    <Card title={t.settings.profile}>
      <form
        className={scss.form}
        onSubmit={handleSubmit((v) =>
          updateMe.mutate({
            display_name: v.display_name.trim() || null,
            grade_status: v.grade_status || null,
            timezone: v.timezone.trim() || null,
          }),
        )}
      >
        <label className={scss.field}>
          <span>{t.settings.name}</span>
          <input maxLength={50} {...register("display_name")} />
        </label>
        <label className={scss.field}>
          <span>{t.settings.email}</span>
          <input value={user?.email ?? ""} disabled readOnly />
        </label>
        <label className={scss.field}>
          <span>{t.settings.grade}</span>
          <select {...register("grade_status")}>
            <option value="">—</option>
            {GRADES.map((g) => (
              <option key={g} value={g}>
                {t.settings.grades[g]}
              </option>
            ))}
          </select>
        </label>
        <label className={scss.field}>
          <span>{t.settings.timezone}</span>
          <input maxLength={64} placeholder="Asia/Bishkek" {...register("timezone")} />
        </label>
        <Button type="submit" loading={updateMe.isPending} disabled={!formState.isDirty}>
          {t.common.save}
        </Button>
        <Status ok={updateMe.isSuccess} error={updateMe.error} />
      </form>
    </Card>
  );
};

// ── Тема и язык ──
const AppearanceCard = () => {
  const t = useT();
  const { theme, setTheme } = useSettings();
  return (
    <Card title={t.settings.appearance}>
      <div className={scss.field}>
        <span>{t.common.language}</span>
        <LanguageSwitch />
      </div>
      <div className={scss.field}>
        <span>{t.theme.title}</span>
        <Segmented
          variant="switch"
          ariaLabel={t.theme.title}
          value={theme}
          onChange={setTheme}
          options={THEMES.map((v) => ({ value: v, label: t.theme[v] }))}
        />
      </div>
      <p className={scss.note}>{t.settings.appearanceNote}</p>
    </Card>
  );
};

// ── Цель (ТЗ 4.11) ──
interface GoalForm {
  target_score: string;
  exam_date: string;
  minutes_per_day: string;
}

const GoalCard = () => {
  const t = useT();
  const goal = useGetGoal({ retry: false });
  const setGoal = useSetGoal();
  const archive = useArchiveGoal();
  const checkpoint = useCreateSelfReportedCheckpoint();
  const { register, handleSubmit } = useForm<GoalForm>({
    values: {
      target_score: goal.data ? String(goal.data.target_score) : "",
      exam_date: goal.data?.exam_date ?? "",
      minutes_per_day: goal.data ? String(goal.data.minutes_per_day) : "30",
    },
  });
  const cp = useForm<{ total_scaled: string; taken_on: string }>();

  return (
    <Card title={t.goal.title} className={scss.anchor}>
      <span id="goal" className={scss.anchorTarget} />
      {goal.isPending ? (
        <Skeleton height={120} />
      ) : (
        goal.data && (
          <p className={scss.note}>
            {t.goal.current(goal.data.start_score, goal.data.target_score, formatDate(goal.data.exam_date))}
          </p>
        )
      )}

      <form
        className={scss.form}
        onSubmit={handleSubmit((v) =>
          setGoal.mutate({
            target_score: v.target_score ? Number(v.target_score) : null,
            exam_date: v.exam_date,
            minutes_per_day: Number(v.minutes_per_day),
          }),
        )}
      >
        <div className={scss.row2}>
          <label className={scss.field}>
            <span>{t.goal.target}</span>
            <input type="number" min={0} max={1000} {...register("target_score")} />
          </label>
          <label className={scss.field}>
            <span>{t.goal.examDate}</span>
            <input type="date" required {...register("exam_date", { required: true })} />
          </label>
        </div>
        <label className={scss.field}>
          <span>{t.goal.minutes}</span>
          <input type="number" min={10} max={600} required {...register("minutes_per_day", { required: true })} />
        </label>
        <div className={scss.buttons}>
          <Button type="submit" loading={setGoal.isPending}>
            {goal.data ? t.goal.update : t.goal.set}
          </Button>
          {goal.data && (
            <Button variant="secondary" loading={archive.isPending} onClick={() => archive.mutate()}>
              {t.goal.archive}
            </Button>
          )}
        </div>
        <Status ok={setGoal.isSuccess} error={setGoal.error ?? archive.error} />
        {/* ТЗ 4.10: цели нужен стартовый результат пробника */}
        <p className={scss.note}>{t.goal.needsCheckpoint}</p>
      </form>

      <form
        className={`${scss.form} ${scss.sub}`}
        onSubmit={cp.handleSubmit((v) =>
          checkpoint.mutate({ total_scaled: Number(v.total_scaled), taken_on: v.taken_on }),
        )}
      >
        <p className={scss.subTitle}>{t.goal.selfReported}</p>
        <div className={scss.row2}>
          <label className={scss.field}>
            <span>{t.goal.score}</span>
            <input type="number" min={0} max={1000} required {...cp.register("total_scaled", { required: true })} />
          </label>
          <label className={scss.field}>
            <span>{t.goal.takenOn}</span>
            <input type="date" required {...cp.register("taken_on", { required: true })} />
          </label>
        </div>
        <Button type="submit" variant="secondary" loading={checkpoint.isPending}>
          {t.goal.addResult}
        </Button>
        <Status ok={checkpoint.isSuccess} error={checkpoint.error} />
      </form>
    </Card>
  );
};

// ── Уведомления ──
const NotificationsCard = () => {
  const t = useT();
  const settings = useGetNotifications();
  const update = useUpdateNotifications();
  const s = settings.data;

  const hourSelect = (key: "reminder_hour" | "quiet_start" | "quiet_end", label: string) => (
    <label className={scss.field}>
      <span>{label}</span>
      <select
        value={s?.[key] ?? 0}
        disabled={update.isPending}
        onChange={(e) => update.mutate({ [key]: Number(e.target.value) })}
      >
        {Array.from({ length: 24 }, (_, h) => (
          <option key={h} value={h}>
            {String(h).padStart(2, "0")}:00
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <Card title={t.settings.notifications}>
      {settings.isPending ? (
        <Skeleton height={160} />
      ) : settings.isError ? (
        <ErrorState error={settings.error} onRetry={() => settings.refetch()} />
      ) : (
        s && (
          <div className={scss.form}>
            <label className={scss.toggle}>
              <input
                type="checkbox"
                checked={s.telegram_enabled}
                disabled={update.isPending}
                onChange={(e) => update.mutate({ telegram_enabled: e.target.checked })}
              />
              <span>{t.settings.reminders}</span>
            </label>
            <label className={scss.toggle}>
              <input
                type="checkbox"
                checked={s.weekly_report}
                disabled={update.isPending}
                onChange={(e) => update.mutate({ weekly_report: e.target.checked })}
              />
              <span>{t.settings.weeklyReport}</span>
            </label>
            {hourSelect("reminder_hour", t.settings.reminderHour)}
            <div className={scss.row2}>
              {hourSelect("quiet_start", t.settings.quietStart)}
              {hourSelect("quiet_end", t.settings.quietEnd)}
            </div>
            <p className={scss.note}>{t.settings.hoursNote}</p>
            <Status ok={false} error={update.error} />
          </div>
        )
      )}
    </Card>
  );
};

// ── Telegram (ТЗ 6.1: одноразовый токен) ──
const TelegramCard = () => {
  const t = useT();
  const notifications = useGetNotifications();
  const link = useCreateLinkToken();
  const unlink = useUnlinkTelegram();
  const linked = notifications.data?.telegram_linked;

  return (
    <Card title="Telegram" className={scss.anchor}>
      <span id="telegram" className={scss.anchorTarget} />
      <p className={scss.note}>{linked ? t.settings.telegramLinked : t.settings.telegramText}</p>
      {linked ? (
        <Button variant="secondary" icon={<LuUnlink />} loading={unlink.isPending} onClick={() => unlink.mutate()}>
          {t.settings.unlink}
        </Button>
      ) : link.data ? (
        <div className={scss.token}>
          {link.data.deep_link ? (
            <Button href={link.data.deep_link} icon={<LuSend />}>
              {t.settings.openBot}
            </Button>
          ) : (
            <p>
              {t.settings.sendToBot} <code>/start {link.data.token}</code>
            </p>
          )}
          <p className={scss.note}>{t.settings.tokenExpires(Math.ceil(link.data.expires_in / 60))}</p>
        </div>
      ) : (
        <Button icon={<LuSend />} loading={link.isPending} onClick={() => link.mutate()}>
          {t.settings.link}
        </Button>
      )}
      <Status ok={false} error={link.error ?? unlink.error} />
    </Card>
  );
};

// ── Безопасность и данные ──
const SecurityCard = () => {
  const t = useT();
  const router = useRouter();
  const logoutAll = useLogoutAll();
  const exportAccount = useExportAccount();
  const deleteAccount = useDeleteAccount();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const del = useForm<{ password: string; confirm: string }>();

  const download = () =>
    exportAccount.mutate(undefined, {
      onSuccess: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "orto-account.json";
        a.click();
        URL.revokeObjectURL(url);
      },
    });

  return (
    <Card title={t.settings.security}>
      <div className={scss.form}>
        <Button
          variant="secondary"
          icon={<LuLogOut />}
          loading={logoutAll.isPending}
          onClick={() => logoutAll.mutate(undefined, { onSuccess: () => router.replace("/login") })}
        >
          {t.settings.logoutAll}
        </Button>
        <Button variant="secondary" icon={<LuDownload />} loading={exportAccount.isPending} onClick={download}>
          {t.settings.export}
        </Button>
        <Status ok={false} error={logoutAll.error ?? exportAccount.error} />

        {!confirmDelete ? (
          <Button variant="danger" icon={<LuTrash2 />} onClick={() => setConfirmDelete(true)}>
            {t.settings.deleteAccount}
          </Button>
        ) : (
          <form
            className={scss.danger}
            onSubmit={del.handleSubmit((v) =>
              deleteAccount.mutate(v, { onSuccess: () => router.replace("/") }),
            )}
          >
            <p>{t.settings.deleteWarning}</p>
            <label className={scss.field}>
              <span>{t.settings.password}</span>
              <input type="password" autoComplete="current-password" required {...del.register("password", { required: true })} />
            </label>
            <label className={scss.field}>
              <span>{t.settings.deleteConfirm}</span>
              <input required {...del.register("confirm", { required: true })} />
            </label>
            <div className={scss.buttons}>
              <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
                {t.common.cancel}
              </Button>
              <Button type="submit" variant="danger" loading={deleteAccount.isPending}>
                {t.settings.deleteForever}
              </Button>
            </div>
            <Status ok={false} error={deleteAccount.error} />
          </form>
        )}
      </div>
    </Card>
  );
};

export default Settings;
