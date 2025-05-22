// src/pages/AttractionDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAttractionById } from "../services/api"; // Импортируем функцию из api.ts

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
      const data = await fetchAttractionById(Number(id)); // Используем функцию для получения данных
      setAttraction(data);
    };
    loadAttraction();
  }, [id]);

  if (!attraction) return <p>Загрузка...</p>;

  return (
    <div>
      <h1>{attraction.name}</h1>
      <p>{attraction.description}</p>
      <div>
        <h2>Галерея</h2>
        {attraction.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={attraction.name}
            style={{ width: "200px", margin: "10px" }}
          />
        ))}
      </div>
      <h2>Локация</h2>
      <p>
        Широта: {attraction.location.lat}, Долгота: {attraction.location.lng}
      </p>
      {/* Здесь можно добавить интеграцию с картами, например, Google Maps */}
    </div>
  );
};

export default AttractionDetailPage;
