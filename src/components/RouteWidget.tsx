import React, { useState, useEffect } from "react";
import { fetchAttractions, saveRoute } from "../services/api";

interface Attraction {
  id: number;
  name: string;
  location: { lat: number; lng: number };
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
    loadAttractions();
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

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newRouteIds = [...routeIds];
    [newRouteIds[index - 1], newRouteIds[index]] = [
      newRouteIds[index],
      newRouteIds[index - 1],
    ];
    setRouteIds(newRouteIds);
    onRouteChange?.(newRouteIds);
  };

  const moveDown = (index: number) => {
    if (index === routeIds.length - 1) return;
    const newRouteIds = [...routeIds];
    [newRouteIds[index], newRouteIds[index + 1]] = [
      newRouteIds[index + 1],
      newRouteIds[index],
    ];
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
    } catch {
      setError("Ошибка при сохранении маршрута");
    }
  };

  return (
    <div>
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
        {routeIds.map((id, index) => (
          <li key={id} style={{ marginBottom: "8px" }}>
            {attractionsMap[id]?.name || "Загрузка..."}
            <button
              onClick={() => moveUp(index)}
              disabled={index === 0}
              style={{ marginLeft: 10 }}
            >
              ↑
            </button>
            <button
              onClick={() => moveDown(index)}
              disabled={index === routeIds.length - 1}
              style={{ marginLeft: 5 }}
            >
              ↓
            </button>
            <button
              onClick={() => removeAttraction(id)}
              style={{ marginLeft: 5 }}
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>

      <h3>Все достопримечательности</h3>
      <ul>
        {Object.values(attractionsMap).map((a) => (
          <li key={a.id} style={{ marginBottom: "6px" }}>
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
