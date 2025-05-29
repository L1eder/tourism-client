import React, { useState, useEffect } from "react";
import { fetchRoutes, saveRoute, updateRoute } from "../services/api";
import RouteWidget from "../components/RouteWidget";
import "../styles/MyRoutesPage.css";

interface Route {
  id: string;
  name: string;
  attractionIds: number[];
}

const MyRoutesPage: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadRoutes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRoutes();
      setRoutes(data);
    } catch (err) {
      console.error("Ошибка загрузки маршрутов:", err);
      setError(
        "Не удалось загрузить маршруты. Проверьте соединение или войдите снова."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Вы не авторизованы. Пожалуйста, войдите в систему.");
      setLoading(false);
      return;
    }
    loadRoutes();
  }, []);

  const handleSave = async (name: string, attractionIds: number[]) => {
    setError(null);
    try {
      if (selectedRoute) {
        await updateRoute(selectedRoute.id, { name, attractionIds });
      } else {
        await saveRoute({ name, attractionIds });
      }
      await loadRoutes();
      setSelectedRoute(null);
      setIsCreating(false);
    } catch (err) {
      console.error("Ошибка при сохранении маршрута:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Неизвестная ошибка при сохранении маршрута";
      setError(`Ошибка: ${errorMessage}. Попробуйте снова.`);
      throw new Error("Ошибка при сохранении маршрута");
    }
  };

  const handleEdit = (route: Route) => {
    setSelectedRoute(route);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setSelectedRoute(null);
    setIsCreating(true);
  };

  const handleCancel = () => {
    setSelectedRoute(null);
    setIsCreating(false);
  };

  if (loading)
    return (
      <div className="text-center my-4">
        <div className="spinner-border" role="status" />
        <p>Загрузка маршрутов...</p>
      </div>
    );

  return (
    <div className="container my-4">
      <h1>Мои маршруты</h1>
      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{error}</span>
          {!error.includes("авторизованы") && (
            <button onClick={loadRoutes} className="btn btn-sm btn-danger">
              Повторить попытку
            </button>
          )}
        </div>
      )}

      {!selectedRoute && !isCreating && (
        <>
          <button onClick={handleCreate} className="btn btn-primary mb-3">
            Создать маршрут
          </button>
          {routes.length === 0 ? (
            <p>Нет сохранённых маршрутов</p>
          ) : (
            <ul className="list-group">
              {routes.map((route) => (
                <li
                  key={route.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <b>{route.name}</b>
                  <button
                    onClick={() => handleEdit(route)}
                    className="btn btn-sm btn-outline-primary"
                  >
                    Редактировать
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {(selectedRoute || isCreating) && (
        <RouteWidget
          initialRouteIds={selectedRoute?.attractionIds}
          initialRouteName={selectedRoute?.name}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default MyRoutesPage;
