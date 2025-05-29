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
    <div style={{ maxWidth: "300px", margin: "50px auto" }}>
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Имя пользователя:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Зарегистрироваться</button>
      </form>
      <p>
        Уже есть аккаунт? <Link to="/login">Войдите</Link>
      </p>
    </div>
  );
};

export default RegisterForm;
