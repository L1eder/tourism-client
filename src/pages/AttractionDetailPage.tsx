import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchAttractionById } from "../services/api";
import ImageGallery from "../components/ImageGallery";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface Attraction {
  id: number;
  name: string;
  description: string;
  images: string[];
  location: { lat: number; lng: number };
}

const AttractionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [attraction, setAttraction] = useState<Attraction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAttraction = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAttractionById(Number(id));
        setAttraction(data);
      } catch {
        setError("Ошибка загрузки достопримечательности");
      } finally {
        setLoading(false);
      }
    };
    loadAttraction();
  }, [id]);

  const handleAddToRoute = async () => {
    if (!attraction) return;

    try {
      const response = await fetch("http://localhost:3001/routes");
      const routeData = await response.json();
      const currentRouteIds = routeData.attractions || [];

      if (!currentRouteIds.includes(attraction.id)) {
        currentRouteIds.push(attraction.id);
        await fetch("http://localhost:3001/routes", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ attractions: currentRouteIds }),
        });
        alert(`${attraction.name} добавлена в маршрут!`);
      } else {
        alert(`${attraction.name} уже в маршруте!`);
      }
    } catch (error) {
      console.error("Ошибка при добавлении в маршрут", error);
      alert("Не удалось добавить достопримечательность в маршрут");
    }
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!attraction) return <p>Достопримечательность не найдена</p>;

  return (
    <div>
      <h1>{attraction.name}</h1>
      <p>{attraction.description}</p>
      <ImageGallery images={attraction.images} alt={attraction.name} />
      <h2>Локация</h2>
      <MapContainer
        center={[attraction.location.lat, attraction.location.lng]}
        zoom={15}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={[attraction.location.lat, attraction.location.lng]}>
          <Popup>{attraction.name}</Popup>
        </Marker>
      </MapContainer>
      <button onClick={handleAddToRoute} style={{ marginTop: "10px" }}>
        Добавить в маршрут
      </button>
      <br />
      <Link to="/">Назад к списку достопримечательностей</Link>
    </div>
  );
};

export default AttractionDetailPage;
