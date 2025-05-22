import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchAttractionById } from "../services/api";
import ImageGallery from "../components/ImageGallery";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/AttractionDetailPage.css";

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

  if (loading)
    return (
      <div className="text-center my-4">
        <div className="spinner-border" role="status" />
        <p>Загрузка...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-danger my-4">
        <p>{error}</p>
      </div>
    );

  if (!attraction)
    return (
      <div className="text-center my-4">
        <p>Достопримечательность не найдена</p>
      </div>
    );

  const customIcon = new L.Icon({
    iconUrl:
      "https://s1.iconbird.com/ico/2013/9/446/w512h5121380376600FlurryGooglePlaces.png",
    iconSize: [40, 40],
    iconAnchor: [19, 41],
    popupAnchor: [1, -34],
  });

  return (
    <div className="container my-4">
      <h1>{attraction.name}</h1>
      <p>{attraction.description}</p>

      <ImageGallery
        images={attraction.images}
        alt={attraction.name}
        width={300}
        enlargedWidth={800}
      />

      <h2 className="mt-4">Локация</h2>
      <MapContainer
        center={[attraction.location.lat, attraction.location.lng]}
        zoom={15}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker
          position={[attraction.location.lat, attraction.location.lng]}
          icon={customIcon}
        >
          <Popup>{attraction.name}</Popup>
        </Marker>
      </MapContainer>

      <br />
      <Link to="/" className="btn btn-link">
        Назад к списку достопримечательностей
      </Link>
    </div>
  );
};

export default AttractionDetailPage;
