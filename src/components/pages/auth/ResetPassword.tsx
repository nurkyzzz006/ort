"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { LuArrowRight, LuKeyRound } from "react-icons/lu";
import { getErrorMessage, useConfirmPasswordReset } from "@/api";
import { useT } from "@/i18n";
import scss from "./Auth.module.scss";

interface ResetForm {
  password: string;
  confirm: string;
}

// Страница по ссылке из письма: /reset-password?token=…
const ResetPassword = () => {
  const t = useT();
  const a = t.auth;
  const token = useSearchParams().get("token");
  const confirmMutation = useConfirmPasswordReset();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ResetForm>();

  const onSubmit = (form: ResetForm) => {
    if (!token) return;
    confirmMutation.mutate({ token, new_password: form.password });
  };

  const renderBody = () => {
    if (!token) {
      return (
        <p className={scss.form_error} role="alert">
          {a.resetInvalidLink}
        </p>
      );
    }

    if (confirmMutation.isSuccess) {
      return (
        <p className={scss.form_success} role="status">
          {a.resetDone}
        </p>
      );
    }

    return (
      <form className={scss.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={scss.input_group}>
          <label htmlFor="password">{a.newPassword}</label>
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

        {confirmMutation.isError && (
          <p className={scss.form_error} role="alert">
            {getErrorMessage(confirmMutation.error, t.errors)}
          </p>
        )}

        <button type="submit" className={scss.submit_btn} disabled={confirmMutation.isPending}>
          {confirmMutation.isPending ? a.saving : a.savePassword}
          <span aria-hidden>
            <LuArrowRight />
          </span>
        </button>
      </form>
    );
  };

  return (
    <div className={scss.Auth}>
      <div className="container">
        <div className={scss.content}>
          <div className={scss.auth_card}>
            <div className={scss.icon} aria-hidden>
              <LuKeyRound />
            </div>

            <div className={scss.heading}>
              <h1>{a.resetTitle}</h1>
              <p>{a.resetText}</p>
            </div>

            {renderBody()}

            <div className={scss.bottom_text}>
              <Link href="/login">{a.backToLogin}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
