import React, { useState, useEffect } from "react";
import { fetchRoutes, saveRoute } from "../services/api";
import RouteWidget from "../components/RouteWidget";

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

  const loadRoutes = async () => {
    try {
      const data = await fetchRoutes();
      setRoutes(data);
    } catch {
      setError("Ошибка загрузки маршрутов");
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  // Сохраняем маршрут (создание или обновление)
  const handleSave = async (name: string, attractionIds: number[]) => {
    setError(null);
    try {
      if (selectedRoute) {
        // Обновление маршрута — PUT если поддерживается, иначе удаляем и создаём заново
        // Предположим, что API поддерживает PUT /routes/:id
        await fetch(`http://localhost:3001/routes/${selectedRoute.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, attractionIds }),
        });
      } else {
        // Создание нового маршрута
        await saveRoute({ name, attractionIds });
      }
      await loadRoutes();
      setSelectedRoute(null);
      setIsCreating(false);
    } catch {
      setError("Ошибка при сохранении маршрута");
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

  return (
    <div>
      <h1>Мои маршруты</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!selectedRoute && !isCreating && (
        <>
          <button onClick={handleCreate}>Создать маршрут</button>
          {routes.length === 0 ? (
            <p>Нет сохранённых маршрутов</p>
          ) : (
            <ul>
              {routes.map((route) => (
                <li key={route.id}>
                  <b>{route.name}</b>{" "}
                  <button onClick={() => handleEdit(route)}>
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
