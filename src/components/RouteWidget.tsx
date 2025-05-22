import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { fetchAttractions } from "../services/api";

interface Attraction {
  id: number;
  name: string;
  location: { lat: number; lng: number };
}

interface RouteWidgetProps {
  initialRouteIds?: number[];
  initialRouteName?: string;
  onSave: (name: string, attractionIds: number[], id?: number) => Promise<void>;
  onCancel?: () => void;
}

const RouteWidget: React.FC<RouteWidgetProps> = ({
  initialRouteIds = [],
  initialRouteName = "",
  onSave,
  onCancel,
}) => {
  const [routeIds, setRouteIds] = useState<number[]>(initialRouteIds);
  const [routeName, setRouteName] = useState(initialRouteName);
  const [attractionsMap, setAttractionsMap] = useState<
    Record<number, Attraction>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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

  // Добавление, удаление и перестановка достопримечательностей
  const addAttraction = (id: number) => {
    if (!routeIds.includes(id)) {
      setRouteIds([...routeIds, id]);
    }
  };

  const removeAttraction = (id: number) => {
    setRouteIds(routeIds.filter((rid) => rid !== id));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newRouteIds = [...routeIds];
    [newRouteIds[index - 1], newRouteIds[index]] = [
      newRouteIds[index],
      newRouteIds[index - 1],
    ];
    setRouteIds(newRouteIds);
  };

  const moveDown = (index: number) => {
    if (index === routeIds.length - 1) return;
    const newRouteIds = [...routeIds];
    [newRouteIds[index], newRouteIds[index + 1]] = [
      newRouteIds[index + 1],
      newRouteIds[index],
    ];
    setRouteIds(newRouteIds);
  };

  // Вычисление расстояния
  const haversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const totalDistance = () => {
    let distance = 0;
    for (let i = 0; i < routeIds.length - 1; i++) {
      const a = attractionsMap[routeIds[i]];
      const b = attractionsMap[routeIds[i + 1]];
      if (a && b) {
        distance += haversineDistance(
          a.location.lat,
          a.location.lng,
          b.location.lat,
          b.location.lng
        );
      }
    }
    return distance.toFixed(2);
  };

  // Сохранение маршрута
  const handleSave = async () => {
    if (!routeName.trim()) {
      setError("Введите имя маршрута");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave(routeName.trim(), routeIds);
      alert("Маршрут сохранён");
    } catch {
      setError("Ошибка при сохранении маршрута");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h3>Создание / Редактирование маршрута</h3>
      <input
        placeholder="Имя маршрута"
        value={routeName}
        onChange={(e) => setRouteName(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px", width: "250px" }}
      />
      <button
        onClick={handleSave}
        disabled={saving}
        style={{ marginLeft: "10px" }}
      >
        {saving ? "Сохраняем..." : "Сохранить маршрут"}
      </button>
      {onCancel && (
        <button onClick={onCancel} style={{ marginLeft: "10px" }}>
          Отмена
        </button>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Маршрут</h3>
      {routeIds.length === 0 ? (
        <p>Маршрут пуст. Добавьте достопримечательности.</p>
      ) : (
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
      )}

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

      <h4>Общая длина маршрута: {totalDistance()} км</h4>

      <MapContainer
        center={[55.751244, 37.618423]}
        zoom={12}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {routeIds.map((id) => {
          const attraction = attractionsMap[id];
          if (!attraction) return null;
          return (
            <Marker
              key={id}
              position={[attraction.location.lat, attraction.location.lng]}
            >
              <Popup>{attraction.name}</Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default RouteWidget;
