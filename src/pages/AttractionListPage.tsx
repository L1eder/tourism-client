import React, { useState, useEffect } from "react";
import { fetchAttractions } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AttractionListPage.css";

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
  const [showModal, setShowModal] = useState(false); // Состояние для модального окна
  const navigate = useNavigate();

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

  const handleLogoutClick = () => {
    setShowModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    setShowModal(false);
    navigate("/login");
  };

  const cancelLogout = () => {
    setShowModal(false);
  };

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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Достопримечательности</h1>
        <button className="btn btn-danger" onClick={handleLogoutClick}>
          Выйти
        </button>
      </div>

      {/* Модальное окно для подтверждения выхода */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        tabIndex={-1}
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Подтверждение выхода</h5>
              <button
                type="button"
                className="btn-close"
                onClick={cancelLogout}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>Вы уверены, что хотите выйти из аккаунта?</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={cancelLogout}
              >
                Отмена
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmLogout}
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </div>
      {showModal && <div className="modal-backdrop fade show"></div>}

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
        Перейти к моим маршрутам
      </Link>
    </div>
  );
};

export default AttractionListPage;
