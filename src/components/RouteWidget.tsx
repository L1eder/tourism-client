import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { fetchAttractions } from "../services/api";
import "../styles/RouteWidget.css"; // Импортируем стили

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAttractions = async () => {
      setLoading(true);
      setError(null);
      try {
        const allAttractions = await fetchAttractions();
        const map: Record<number, Attraction> = {};
        allAttractions.forEach((a: Attraction) => {
          map[a.id] = a;
        });
        setAttractionsMap(map);
      } catch {
        setError("Ошибка загрузки достопримечательностей");
      } finally {
        setLoading(false);
      }
    };
    loadAttractions();
  }, []);

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

  if (loading) {
    return (
      <div className="text-center my-4">
        <div className="spinner-border" role="status" />
        <p>Загрузка достопримечательностей...</p>
      </div>
    );
  }

  return (
    <div className="route-widget container mt-4">
      <h3>Создание / Редактирование маршрута</h3>
      <input
        placeholder="Имя маршрута"
        value={routeName}
        onChange={(e) => setRouteName(e.target.value)}
        className="form-control mb-3"
        style={{ maxWidth: 400 }}
      />
      <button
        onClick={handleSave}
        disabled={saving}
        className="btn btn-primary me-2"
      >
        {saving ? "Сохраняем..." : "Сохранить маршрут"}
      </button>
      {onCancel && (
        <button onClick={onCancel} className="btn btn-secondary">
          Отмена
        </button>
      )}
      {error && <p className="text-danger mt-2">{error}</p>}

      <h4 className="mt-4">Маршрут</h4>
      {routeIds.length === 0 ? (
        <p>Маршрут пуст. Добавьте достопримечательности.</p>
      ) : (
        <ul className="list-group mb-3" style={{ maxWidth: 500 }}>
          {routeIds.map((id, index) => (
            <li
              key={id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {attractionsMap[id]?.name || "Загрузка..."}
              <div>
                <button
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="btn btn-sm btn-outline-secondary me-1"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveDown(index)}
                  disabled={index === routeIds.length - 1}
                  className="btn btn-sm btn-outline-secondary me-1"
                >
                  ↓
                </button>
                <button
                  onClick={() => removeAttraction(id)}
                  className="btn btn-sm btn-danger"
                >
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h4>Все достопримечательности</h4>
      <ul className="list-group" style={{ maxWidth: 500 }}>
        {Object.values(attractionsMap).map((a) => (
          <li
            key={a.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {a.name}
            <button
              disabled={routeIds.includes(a.id)}
              onClick={() => addAttraction(a.id)}
              className="btn btn-sm btn-success"
            >
              Добавить
            </button>
          </li>
        ))}
      </ul>

      <h5 className="mt-3">Общая длина маршрута: {totalDistance()} км</h5>

      <MapContainer
        center={[55.751244, 37.618423]}
        zoom={12}
        style={{ height: "400px", width: "100%", marginTop: "20px" }}
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
