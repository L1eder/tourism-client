import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

interface Route {
  id: number;
  name: string;
  attraction_ids: number[];
  username: string;
}

const AdminPanel: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token before request:", token);
        const response = await api.get("/admin/routes");
        setRoutes(response.data);
        setLoading(false);
      } catch (err: any) {
        console.error("Ошибка при загрузке маршрутов:", err);
        setError(err.response?.data?.message || "Ошибка при загрузке данных");
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  if (loading) {
    return <div className="text-center mt-5">Загрузка...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-5">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1>Админская панель</h1>
      <button onClick={handleLogout} className="btn btn-danger mb-3">
        Выйти
      </button>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Достопримечательности</th>
            <th>Пользователь</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr key={route.id}>
              <td>{route.id}</td>
              <td>{route.name}</td>
              <td>{route.attraction_ids.join(", ")}</td>
              <td>{route.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
