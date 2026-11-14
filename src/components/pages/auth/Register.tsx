"use client";
import Link from "next/link";
import scss from "./Auth.module.scss";
import { useRouter } from "next/navigation";

const Register = () => {
  const router = useRouter();
  return (
    <div className={scss.Auth}>
      <div className="container">
        <div className={scss.content}>
          <div className={scss.auth_card}>
            <div className={scss.icon}>
              <span>✦</span>
            </div>

            <div className={scss.heading}>
              <h1>Создать аккаунт</h1>
              <p>Зарегистрируйтесь и начните подготовку к ОРТ</p>
            </div>

            <form className={scss.form}>
              <div className={scss.input_group}>
                <label>Имя и фамилия</label>
                <input
                  type="text"
                  placeholder="Введите ваше имя"
                  required
                />
              </div>

              <div className={scss.input_group}>
                <label>Электронная почта</label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  required
                />
              </div>

              <div className={scss.input_group}>
                <label>Пароль</label>
                <input
                  type="password"
                  placeholder="Минимум 8 символов"
                  minLength={8}
                  required
                />
              </div>

              <div className={scss.input_group}>
                <label>Подтвердите пароль</label>
                <input
                  type="password"
                  placeholder="Повторите пароль"
                  required
                />
              </div>

              <label className={scss.agreement}>
                <input type="checkbox" required />
                <span>
                  Я принимаю <Link href="/terms">условия использования</Link>
                  и <Link href="/privacy">политику конфиденциальности</Link>
                </span>
              </label>

              <button onClick={()=> router.push("/dashboard")} type="submit" className={scss.submit_btn}>
                Создать аккаунт
                <span>→</span>
              </button>
            </form>

            <div className={scss.bottom_text}>
              Уже есть аккаунт?
              <Link href="/login">Войти</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
