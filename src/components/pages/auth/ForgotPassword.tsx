"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { LuArrowRight, LuKeyRound } from "react-icons/lu";
import { getErrorMessage, useRequestPasswordReset, type RequestPasswordResetRequest } from "@/api";
import { useT } from "@/i18n";
import { EMAIL_PATTERN } from "./Login";
import scss from "./Auth.module.scss";

const ForgotPassword = () => {
  const t = useT();
  const a = t.auth;
  const resetMutation = useRequestPasswordReset();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestPasswordResetRequest>();

  return (
    <div className={scss.Auth}>
      <div className="container">
        <div className={scss.content}>
          <div className={scss.auth_card}>
            <div className={scss.icon} aria-hidden>
              <LuKeyRound />
            </div>

            <div className={scss.heading}>
              <h1>{a.forgotTitle}</h1>
              <p>{a.forgotText}</p>
            </div>

            {resetMutation.isSuccess ? (
              // ТЗ: без раскрытия, существует ли аккаунт (no enumeration)
              <p className={scss.form_success} role="status">
                {a.forgotSent}
              </p>
            ) : (
              <form
                className={scss.form}
                onSubmit={handleSubmit((form) => resetMutation.mutate(form))}
                noValidate
              >
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

                {resetMutation.isError && (
                  <p className={scss.form_error} role="alert">
                    {getErrorMessage(resetMutation.error, t.errors)}
                  </p>
                )}

                <button type="submit" className={scss.submit_btn} disabled={resetMutation.isPending}>
                  {resetMutation.isPending ? a.sending : a.sendLink}
                  <span aria-hidden>
                    <LuArrowRight />
                  </span>
                </button>
              </form>
            )}

            <div className={scss.bottom_text}>
              {a.remembered}
              <Link href="/login">{a.loginLink}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
