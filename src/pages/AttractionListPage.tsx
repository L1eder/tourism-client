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

  useEffect(() => {
    const loadAttractions = async () => {
      const data = await fetchAttractions();
      setAttractions(data);
    };
    loadAttractions();
  }, []);

  // Получаем уникальные районы и категории
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

  return (
    <div>
      <h1>Достопримечательности</h1>

      <label>
        Район:{" "}
        <select
          value={searchDistrict}
          onChange={(e) => setSearchDistrict(e.target.value)}
          style={{ marginRight: "10px" }}
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
          style={{ marginRight: "10px" }}
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
          style={{ marginRight: "10px" }}
          min={0}
        />
      </label>

      <ul>
        {filteredAttractions.map((attraction) => (
          <li key={attraction.id}>
            <Link to={`/attraction/${attraction.id}`}>{attraction.name}</Link>
          </li>
        ))}
      </ul>
      <Link to="/route">Перейти к моему маршруту</Link>
    </div>
  );
};

export default AttractionListPage;
