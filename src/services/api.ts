// src/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001", // Базовый URL для вашего API
  timeout: 10000,
});

// Функция для получения списка достопримечательностей
export const fetchAttractions = async () => {
  const response = await api.get("/attractions");
  return response.data;
};

// Функция для получения информации о конкретной достопримечательности по ID
export const fetchAttractionById = async (id: number) => {
  const response = await api.get(`/attractions/${id}`);
  return response.data;
};
