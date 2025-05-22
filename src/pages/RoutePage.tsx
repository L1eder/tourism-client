import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

interface Attraction {
  id: number;
  name: string;
  location: { lat: number; lng: number };
}

const RoutePage: React.FC = () => {
  const [route, setRoute] = useState<Attraction[]>(() => {
    const savedRoute = localStorage.getItem("route");
    return savedRoute ? JSON.parse(savedRoute) : [];
  });

  const [routeName, setRouteName] = useState("");

  const handleRemoveAttraction = (id: number) => {
    const updatedRoute = route.filter((attraction) => attraction.id !== id);
    setRoute(updatedRoute);
    localStorage.setItem("route", JSON.stringify(updatedRoute));
  };

  const handleSaveRoute = async () => {
    if (routeName.trim() === "") {
      alert("Пожалуйста, введите имя маршрута.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/routes", {
        name: routeName,
        attractions: route,
      });
      alert("Маршрут сохранен!");
      console.log(response.data);
    } catch (error) {
      console.error("Ошибка при сохранении маршрута:", error);
      alert("Произошла ошибка при сохранении маршрута.");
    }
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
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
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

  return (
    <div>
      <h1>Ваш маршрут</h1>
      <input
        type="text"
        placeholder="Введите имя маршрута"
        value={routeName}
        onChange={(e) => setRouteName(e.target.value)}
      />
      <button onClick={handleSaveRoute}>Сохранить маршрут</button>
      <p>Общая длина маршрута: {totalDistance()} км</p>
      <ul>
        {route.map((attraction) => (
          <li key={attraction.id}>
            {attraction.name}
            <button onClick={() => handleRemoveAttraction(attraction.id)}>
              Удалить
            </button>
          </li>
        ))}
      </ul>
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
