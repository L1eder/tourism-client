import React, { useState, useEffect } from "react";
import { fetchAttractions, saveRoute, fetchRoutes } from "../services/api";

interface Attraction {
  id: number;
  name: string;
  location: { lat: number; lng: number };
}

interface Route {
  id: number;
  name: string;
  attractionIds: number[];
}

interface RouteWidgetProps {
  initialRouteIds?: number[];
  onSaved?: () => void;
  onRouteChange?: (routeIds: number[]) => void;
}

const RouteWidget: React.FC<RouteWidgetProps> = ({
  initialRouteIds = [],
  onSaved,
  onRouteChange,
}) => {
  const [routeIds, setRouteIds] = useState<number[]>(initialRouteIds);
  const [attractionsMap, setAttractionsMap] = useState<
    Record<number, Attraction>
  >({});
  const [routeName, setRouteName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [savedRoutes, setSavedRoutes] = useState<Route[]>([]);

  useEffect(() => {
    const loadAttractions = async () => {
      try {
        const allAttractions = await fetchAttractions();
        const map: Record<number, Attraction> = {};
        allAttractions.forEach((a: Attraction) => {
          map[a.id] = a;
        });
        setAttractionsMap(map);
      } catch {
        setError("Ошибка загрузки достопримечательностей");
      }
    };

    const loadRoutes = async () => {
      try {
        const routes = await fetchRoutes();
        setSavedRoutes(routes);
      } catch {
        setError("Ошибка загрузки сохранённых маршрутов");
      }
    };

    loadAttractions();
    loadRoutes();
  }, []);

  const addAttraction = (id: number) => {
    if (!routeIds.includes(id)) {
      const newRouteIds = [...routeIds, id];
      setRouteIds(newRouteIds);
      onRouteChange?.(newRouteIds);
    }
  };

  const removeAttraction = (id: number) => {
    const newRouteIds = routeIds.filter((rid) => rid !== id);
    setRouteIds(newRouteIds);
    onRouteChange?.(newRouteIds);
  };

  const save = async () => {
    if (!routeName.trim()) {
      setError("Введите имя маршрута");
      return;
    }
    try {
      await saveRoute({ name: routeName, attractionIds: routeIds });
      setError(null);
      alert("Маршрут сохранён");
      onSaved?.();
      setRouteIds([]); // Очистить маршрут после сохранения
      setRouteName(""); // Очистить имя маршрута
    } catch {
      setError("Ошибка при сохранении маршрута");
    }
  };

  const loadRoute = (routeId: number) => {
    const route = savedRoutes.find((r) => r.id === routeId);
    if (route) {
      setRouteIds(route.attractionIds);
      setRouteName(route.name);
      onRouteChange?.(route.attractionIds);
    }
  };

  return (
    <div>
      <h3>Сохранённые маршруты</h3>
      {savedRoutes.length === 0 ? (
        <p>Нет сохранённых маршрутов</p>
      ) : (
        <ul>
          {savedRoutes.map((route) => (
            <li key={route.id}>
              <button onClick={() => loadRoute(route.id)}>{route.name}</button>
            </li>
          ))}
        </ul>
      )}

      <hr />

      <input
        placeholder="Имя маршрута"
        value={routeName}
        onChange={(e) => setRouteName(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px", width: "250px" }}
      />
      <button onClick={save} style={{ marginLeft: "10px" }}>
        Сохранить маршрут
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Маршрут</h3>
      {routeIds.length === 0 && (
        <p>Маршрут пуст. Добавьте достопримечательности.</p>
      )}
      <ul>
        {routeIds.map((id) => (
          <li key={id}>
            {attractionsMap[id]?.name || "Загрузка..."}
            <button onClick={() => removeAttraction(id)}>Удалить</button>
          </li>
        ))}
      </ul>

      <h3>Все достопримечательности</h3>
      <ul>
        {Object.values(attractionsMap).map((a) => (
          <li key={a.id}>
            {a.name}{" "}
            <button
              disabled={routeIds.includes(a.id)}
              onClick={() => addAttraction(a.id)}
            >
              Добавить
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RouteWidget;
