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

  const filteredAttractions = attractions.filter((attraction) => {
    return (
      (searchDistrict
        ? attraction.district
            .toLowerCase()
            .includes(searchDistrict.toLowerCase())
        : true) &&
      (searchCategory
        ? attraction.category
            .toLowerCase()
            .includes(searchCategory.toLowerCase())
        : true) &&
      (searchPrice ? attraction.price <= Number(searchPrice) : true)
    );
  });

  return (
    <div>
      <h1>Достопримечательности</h1>
      <input
        type="text"
        placeholder="Поиск по району"
        value={searchDistrict}
        onChange={(e) => setSearchDistrict(e.target.value)}
      />
      <input
        type="text"
        placeholder="Поиск по категории"
        value={searchCategory}
        onChange={(e) => setSearchCategory(e.target.value)}
      />
      <input
        type="number"
        placeholder="Максимальная стоимость"
        value={searchPrice}
        onChange={(e) => setSearchPrice(e.target.value)}
      />
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
