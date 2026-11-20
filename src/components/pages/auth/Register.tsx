"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { LuArrowRight, LuUserPlus } from "react-icons/lu";
import { getErrorMessage, getFieldErrors, useRegister } from "@/api";
import { useT } from "@/i18n";
import { useSettings } from "@/settings/SettingsProvider";
import { EMAIL_PATTERN } from "./Login";
import scss from "./Auth.module.scss";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirm: string;
  accept: boolean;
}

const FIELD_MAP: Record<string, keyof RegisterForm> = {
  display_name: "name",
  email: "email",
  password: "password",
};

const getTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
  } catch {
    return undefined;
  }
};

const Register = () => {
  const t = useT();
  const a = t.auth;
  const { locale } = useSettings();
  const router = useRouter();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
  } = useForm<RegisterForm>();

  const onSubmit = (form: RegisterForm) =>
    registerMutation.mutate(
      {
        email: form.email,
        password: form.password,
        display_name: form.name.trim() || null,
        // Язык контента = выбранный язык интерфейса
        locale,
        timezone: getTimezone(),
        accept_terms: true,
        accept_privacy: true,
      },
      {
        onSuccess: () => router.replace("/dashboard"),
        // Ошибки валидации бэкенда подсвечиваем у соответствующих полей
        onError: (error) => {
          for (const [field, message] of Object.entries(getFieldErrors(error))) {
            const name = FIELD_MAP[field];
            if (name) setError(name, { message });
          }
        },
      },
    );

  return (
    <div className={scss.Auth}>
      <div className="container">
        <div className={scss.content}>
          <div className={scss.auth_card}>
            <div className={scss.icon} aria-hidden>
              <LuUserPlus />
            </div>

            <div className={scss.heading}>
              <h1>{a.registerTitle}</h1>
              <p>{a.registerText}</p>
            </div>

            <form className={scss.form} onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className={scss.input_group}>
                <label htmlFor="name">{a.name}</label>
                <input
                  id="name"
                  type="text"
                  placeholder={a.namePlaceholder}
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  {...register("name", {
                    required: a.nameRequired,
                    maxLength: { value: 50, message: a.max50 },
                  })}
                />
                {errors.name && <span className={scss.field_error}>{errors.name.message}</span>}
              </div>

              <div className={scss.input_group}>
                <label htmlFor="email">{a.email}</label>
                <input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  {...register("email", {
                    required: a.emailRequired,
                    pattern: { value: EMAIL_PATTERN, message: a.emailInvalid },
                  })}
                />
                {errors.email && <span className={scss.field_error}>{errors.email.message}</span>}
              </div>

              <div className={scss.input_group}>
                <label htmlFor="password">{a.password}</label>
                <input
                  id="password"
                  type="password"
                  placeholder={a.min8}
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  {...register("password", {
                    required: a.passwordRequired,
                    minLength: { value: 8, message: a.min8 },
                    maxLength: { value: 128, message: a.passwordTooLong },
                  })}
                />
                {errors.password && <span className={scss.field_error}>{errors.password.message}</span>}
              </div>

              <div className={scss.input_group}>
                <label htmlFor="confirm">{a.confirmPassword}</label>
                <input
                  id="confirm"
                  type="password"
                  placeholder={a.repeatPassword}
                  autoComplete="new-password"
                  aria-invalid={!!errors.confirm}
                  {...register("confirm", {
                    required: a.repeatPassword,
                    validate: (value) => value === getValues("password") || a.passwordsDiffer,
                  })}
                />
                {errors.confirm && <span className={scss.field_error}>{errors.confirm.message}</span>}
              </div>

              <label className={scss.agreement}>
                <input type="checkbox" {...register("accept", { required: a.acceptRequired })} />
                <span>
                  {a.acceptStart} <Link href="/terms">{a.terms}</Link> {a.and}{" "}
                  <Link href="/privacy">{a.privacy}</Link>
                  {a.acceptEnd}
                </span>
              </label>
              {errors.accept && <span className={scss.field_error}>{errors.accept.message}</span>}

              {registerMutation.isError && (
                <p className={scss.form_error} role="alert">
                  {getErrorMessage(registerMutation.error, t.errors)}
                </p>
              )}

              <button type="submit" className={scss.submit_btn} disabled={registerMutation.isPending}>
                {registerMutation.isPending ? a.creating : a.createButton}
                <span aria-hidden>
                  <LuArrowRight />
                </span>
              </button>
            </form>

            <div className={scss.bottom_text}>
              {a.haveAccount}
              <Link href="/login">{a.loginLink}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
