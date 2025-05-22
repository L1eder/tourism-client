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
  const [loading, setLoading] = useState(true);

  const loadRoutes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRoutes();
      setRoutes(data);
    } catch {
      setError("Ошибка загрузки маршрутов");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  const handleSave = async (name: string, attractionIds: number[]) => {
    setError(null);
    try {
      if (selectedRoute) {
        await fetch(`http://localhost:3001/routes/${selectedRoute.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, attractionIds }),
        });
      } else {
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
      {error && <p className="text-danger">{error}</p>}

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
