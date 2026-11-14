
import Link from "next/link";
import scss from "./Auth.module.scss";

const Login = () => {
  return (
    <div className={scss.Auth}>
      <div className="container">
        <div className={scss.content}>
          <div className={scss.auth_card}>
            <div className={scss.icon}>
              <span>✦</span>
            </div>

            <div className={scss.heading}>
              <h1>С возвращением!</h1>
              <p>Войдите в аккаунт, чтобы продолжить обучение</p>
            </div>

            <form className={scss.form}>
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
                  placeholder="Введите пароль"
                  required
                />
              </div>

              <div className={scss.form_options}>
                <label className={scss.remember}>
                  <input type="checkbox" />
                  <span>Запомнить меня</span>
                </label>

                <Link href="/forgot-password">
                  Забыли пароль?
                </Link>
              </div>

              <button type="submit" className={scss.submit_btn}>
                Войти в аккаунт
                <span>→</span>
              </button>
            </form>

            <div className={scss.bottom_text}>
              Ещё нет аккаунта?
              <Link href="/register">Зарегистрироваться</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
