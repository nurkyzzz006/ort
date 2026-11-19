"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import scss from "./Auth.module.scss";

const Register = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // чтобы страница не перезагружалась
    setError("");

    if (password !== confirm) {
      setError("Пароли не совпадают");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.message || "Не удалось зарегистрироваться");
        return;
      }

      router.replace("/dashboard"); // «Назад» не вернёт на регистрацию
    } catch {
      setError("Ошибка сети, попробуйте ещё раз");
    } finally {
      setLoading(false);
    }
  };

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

            <form className={scss.form} onSubmit={onSubmit}>
              <div className={scss.input_group}>
                <label>Имя и фамилия</label>
                <input
                  type="text"
                  placeholder="Введите ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className={scss.input_group}>
                <label>Электронная почта</label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={scss.input_group}>
                <label>Пароль</label>
                <input
                  type="password"
                  placeholder="Минимум 8 символов"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className={scss.input_group}>
                <label>Подтвердите пароль</label>
                <input
                  type="password"
                  placeholder="Повторите пароль"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>

              <label className={scss.agreement}>
                <input type="checkbox" required />
                <span>
                  Я принимаю <Link href="/terms">условия использования</Link>{" "}
                  и <Link href="/privacy">политику конфиденциальности</Link>
                </span>
              </label>

              {error && <p style={{ color: "red" }}>{error}</p>}

              <button
                type="submit"
                className={scss.submit_btn}
                disabled={loading}
              >
                {loading ? "Создаём..." : "Создать аккаунт"}
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