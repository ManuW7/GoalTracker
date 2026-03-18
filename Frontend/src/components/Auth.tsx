import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

type AuthMode = "login" | "register";

function Auth() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "register" && password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    try {
      const endpoint =
        mode === "login"
          ? "http://83.136.235.118:8000/auth/login"
          : "http://83.136.235.118:8000/auth/reg";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: mode === "login" ? {} : { "Content-Type": "application/json" },
        body:
          mode === "login"
            ? (() => {
                const fd = new FormData();
                fd.append("username", username);
                fd.append("password", password);
                return fd;
              })()
            : JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (!response.ok) {
        throw new Error(data.detail || "Ошибка авторизации");
      }

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
      }

      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.89761 18.1618C8.28247 19.3099 10.0607 20 12.0001 20C16.4184 20 20.0001 16.4183 20.0001 12C20.0001 11.431 19.9407 10.8758 19.8278 10.3404M6.89761 18.1618C5.12756 16.6944 4.00014 14.4789 4.00014 12C4.00014 7.58172 7.58186 4 12.0001 4C15.8494 4 19.0637 6.71853 19.8278 10.3404M6.89761 18.1618C8.85314 17.7147 11.1796 16.7828 13.526 15.4281C16.2564 13.8517 18.4773 12.0125 19.8278 10.3404M6.89761 18.1618C4.46844 18.7171 2.61159 18.5243 1.99965 17.4644C1.36934 16.3726 2.19631 14.5969 3.99999 12.709M19.8278 10.3404C21.0796 8.79041 21.5836 7.38405 21.0522 6.46374C20.5134 5.53051 19.0095 5.26939 16.9997 5.59929"
              stroke="black"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h1>{mode === "login" ? "Вход" : "Регистрация"}</h1>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Логин</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите логин"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              required
            />
          </div>

          {mode === "register" && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Подтвердите пароль</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Повторите пароль"
                required
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="auth-button">
            {mode === "login" ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {mode === "login" ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
            <button type="button" onClick={toggleMode} className="toggle-link">
              {mode === "login" ? "Зарегистрироваться" : "Войти"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;
