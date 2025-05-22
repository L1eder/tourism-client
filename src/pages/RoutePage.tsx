import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import RouteWidget from "../components/RouteWidget";
import "leaflet/dist/leaflet.css";
import { fetchAttractions } from "../services/api";

interface Attraction {
  id: number;
  name: string;
  location: { lat: number; lng: number };
}

const RoutePage: React.FC = () => {
  const [route, setRoute] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загружаем маршрут с сервера
  const fetchRoute = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3001/routes");
      if (!response.ok) throw new Error("Ошибка при загрузке маршрута");
      const data = await response.json();
      setRoute(data.attractions || []); // Предполагается, что сервер возвращает массив attractions
    } catch (e) {
      setError("Ошибка загрузки маршрута");
    } finally {
      setLoading(false);
    }
  };

  // Обновление маршрута на сервере
  const updateRouteOnServer = async (routeIds: number[]) => {
    try {
      await fetch("http://localhost:3001/routes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ attractions: routeIds }),
      });
    } catch (e) {
      console.error("Ошибка при обновлении маршрута на сервере", e);
    }
  };

  const handleRouteChange = async (routeIds: number[]) => {
    if (routeIds.length === 0) {
      setRoute([]);
      return;
    }
    try {
      const attractions = await fetchAttractionsByIds(routeIds);
      setRoute(attractions);
      await updateRouteOnServer(routeIds); // Обновляем маршрут на сервере
    } catch {
      setRoute([]);
      alert("Ошибка загрузки достопримечательностей");
    }
  };

  const fetchAttractionsByIds = async (
    ids: number[]
  ): Promise<Attraction[]> => {
    const response = await fetch("http://localhost:3001/attractions");
    if (!response.ok)
      throw new Error("Ошибка при загрузке достопримечательностей");
    const allAttractions: Attraction[] = await response.json();
    return allAttractions.filter((a) => ids.includes(a.id));
  };

  // Вычисление расстояния между точками
  const haversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Радиус Земли в км
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Возвращаем расстояние в км
  };

  const totalDistance = () => {
    let distance = 0;
    for (let i = 0; i < route.length - 1; i++) {
      distance += haversineDistance(
        route[i].location.lat,
        route[i].location.lng,
        route[i + 1].location.lat,
        route[i + 1].location.lng
      );
    }
    return distance.toFixed(2);
  };

  useEffect(() => {
    fetchRoute();
  }, []);

  if (loading) return <p>Загрузка маршрута...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>Ваш маршрут</h1>
      <RouteWidget
        onSaved={() => alert("Маршрут сохранён")}
        onRouteChange={handleRouteChange}
      />
      <p>Общая длина маршрута: {totalDistance()} км</p>
      <MapContainer
        center={[55.751244, 37.618423]}
        zoom={12}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {route.map((attraction) => (
          <Marker
            key={attraction.id}
            position={[attraction.location.lat, attraction.location.lng]}
          >
            <Popup>{attraction.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
      <Link to="/">Назад к списку достопримечательностей</Link>
    </div>
  );
};

export default RoutePage;
