import React, { useState, useEffect } from "react";
import { fetchAttractions } from "../services/api";
import { Link } from "react-router-dom";

interface Attraction {
  id: number;
  name: string;
  description: string;
  category: string;
  district: string;
  price: number;
}

const AttractionListPage: React.FC = () => {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [searchDistrict, setSearchDistrict] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchPrice, setSearchPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAttractions = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAttractions();
        setAttractions(data);
      } catch {
        setError("Ошибка загрузки достопримечательностей");
      } finally {
        setLoading(false);
      }
    };
    loadAttractions();
  }, []);

  const uniqueDistricts = Array.from(
    new Set(attractions.map((a) => a.district))
  ).sort();
  const uniqueCategories = Array.from(
    new Set(attractions.map((a) => a.category))
  ).sort();

  const filteredAttractions = attractions.filter((attraction) => {
    return (
      (searchDistrict ? attraction.district === searchDistrict : true) &&
      (searchCategory ? attraction.category === searchCategory : true) &&
      (searchPrice ? attraction.price <= Number(searchPrice) : true)
    );
  });

  if (loading)
    return (
      <div className="text-center my-4">
        <div className="spinner-border" role="status" />
        <p>Загрузка достопримечательностей...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-danger my-4">
        <p>{error}</p>
      </div>
    );

  return (
    <div className="container my-4">
      <h1>Достопримечательности</h1>

      <div className="mb-3 d-flex flex-wrap gap-3 align-items-center">
        <label>
          Район:{" "}
          <select
            value={searchDistrict}
            onChange={(e) => setSearchDistrict(e.target.value)}
            className="form-select"
          >
            <option value="">Все</option>
            {uniqueDistricts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </label>

        <label>
          Категория:{" "}
          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="form-select"
          >
            <option value="">Все</option>
            {uniqueCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label>
          Максимальная стоимость:{" "}
          <input
            type="number"
            placeholder="Максимальная стоимость"
            value={searchPrice}
            onChange={(e) => setSearchPrice(e.target.value)}
            className="form-control"
            min={0}
            style={{ width: 150 }}
          />
        </label>
      </div>

      {filteredAttractions.length === 0 ? (
        <p>Достопримечательности не найдены.</p>
      ) : (
        <ul className="list-group">
          {filteredAttractions.map((attraction) => (
            <li key={attraction.id} className="list-group-item">
              <Link to={`/attraction/${attraction.id}`}>{attraction.name}</Link>
            </li>
          ))}
        </ul>
      )}

      <Link to="/route" className="btn btn-primary mt-3">
        Перейти к моему маршруту
      </Link>
    </div>
  );
};

export default AttractionListPage;
