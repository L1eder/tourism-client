import React, { useState, useEffect } from "react";
import axios from "axios";
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
        const response = await axios.get("http://localhost:3001/admin/routes");
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Админская панель</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Выйти
        </button>
      </div>
      <h3>Маршруты всех пользователей</h3>
      {routes.length === 0 ? (
        <p>Маршрутов пока нет.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название маршрута</th>
              <th>Пользователь</th>
              <th>Достопримечательности (ID)</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => (
              <tr key={route.id}>
                <td>{route.id}</td>
                <td>{route.name}</td>
                <td>{route.username}</td>
                <td>{route.attraction_ids.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPanel;
