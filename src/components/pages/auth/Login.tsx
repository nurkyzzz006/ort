"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { LuArrowRight, LuLogIn } from "react-icons/lu";
import { getErrorMessage, useLogin, type LoginRequest } from "@/api";
import { useT } from "@/i18n";
import { getRedirectTarget } from "./redirect";
import scss from "./Auth.module.scss";

type LoginForm = Required<LoginRequest>;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const t = useT();
  const a = t.auth;
  const router = useRouter();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ defaultValues: { remember: true } });

  const onSubmit = (form: LoginForm) =>
    loginMutation.mutate(form, {
      // replace — кнопка «Назад» не вернёт на страницу входа
      onSuccess: () => router.replace(getRedirectTarget()),
    });

  return (
    <div className={scss.Auth}>
      <div className="container">
        <div className={scss.content}>
          <div className={scss.auth_card}>
            <div className={scss.icon} aria-hidden>
              <LuLogIn />
            </div>

            <div className={scss.heading}>
              <h1>{a.loginTitle}</h1>
              <p>{a.loginText}</p>
            </div>

            <form className={scss.form} onSubmit={handleSubmit(onSubmit)} noValidate>
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
                  placeholder={a.passwordPlaceholder}
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  {...register("password", {
                    required: a.passwordRequired,
                    maxLength: { value: 128, message: a.passwordTooLong },
                  })}
                />
                {errors.password && <span className={scss.field_error}>{errors.password.message}</span>}
              </div>

              <div className={scss.form_options}>
                <label className={scss.remember}>
                  <input type="checkbox" {...register("remember")} />
                  <span>{a.remember}</span>
                </label>
                <Link href="/forgot-password">{a.forgot}</Link>
              </div>

              {loginMutation.isError && (
                <p className={scss.form_error} role="alert">
                  {getErrorMessage(loginMutation.error, t.errors)}
                </p>
              )}

              <button type="submit" className={scss.submit_btn} disabled={loginMutation.isPending}>
                {loginMutation.isPending ? a.loggingIn : a.loginButton}
                <span aria-hidden>
                  <LuArrowRight />
                </span>
              </button>
            </form>

            <div className={scss.bottom_text}>
              {a.noAccount}
              <Link href="/register">{a.registerLink}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
