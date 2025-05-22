import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchAttractionById } from "../services/api";
import ImageGallery from "../components/ImageGallery";

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

  useEffect(() => {
    const loadAttraction = async () => {
      if (!id) return;
      const data = await fetchAttractionById(Number(id));
      setAttraction(data);
    };
    loadAttraction();
  }, [id]);

  const handleAddToRoute = () => {
    if (attraction) {
      const currentRoute = localStorage.getItem("route");
      const route = currentRoute ? JSON.parse(currentRoute) : [];
      if (!route.some((item: Attraction) => item.id === attraction.id)) {
        route.push(attraction);
        localStorage.setItem("route", JSON.stringify(route));
        alert(`${attraction.name} добавлена в маршрут!`);
      } else {
        alert(`${attraction.name} уже в маршруте!`);
      }
    }
  };

  if (!attraction) return <p>Загрузка...</p>;

  return (
    <div>
      <h1>{attraction.name}</h1>
      <p>{attraction.description}</p>
      <ImageGallery images={attraction.images} alt={attraction.name} />
      <h2>Локация</h2>
      <p>
        Широта: {attraction.location.lat}, Долгота: {attraction.location.lng}
      </p>
      <button onClick={handleAddToRoute}>Добавить в маршрут</button>
      <Link to="/">Назад к списку достопримечательностей</Link>
    </div>
  );
};

export default AttractionDetailPage;
