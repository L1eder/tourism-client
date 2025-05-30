import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Имя пользователя и пароль обязательны");
      return;
    }
    try {
      console.log("Отправляем данные:", { username, password });
      await axios.post("http://localhost:3001/auth/register", {
        username,
        password,
      });
      navigate("/login");
    } catch (err: any) {
      console.error("Ошибка при регистрации:", err);
      setError(err.response?.data?.message || "Ошибка при регистрации");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <div className="card-body">
          <h2 className="text-center mb-4">Регистрация</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Имя пользователя:
              </label>
              <input
                type="text"
                id="username"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Введите имя пользователя"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Пароль:
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Введите пароль"
              />
            </div>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <button type="submit" className="btn btn-primary w-100 mt-3">
              Зарегистрироваться
            </button>
          </form>
          <p className="text-center mt-3">
            Уже есть аккаунт?{" "}
            <Link to="/login" className="text-primary">
              Войдите
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
