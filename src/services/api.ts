import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const fetchAttractions = async () => {
  const response = await api.get("/attractions");
  return response.data;
};

export const fetchAttractionById = async (id: number) => {
  const response = await api.get(`/attractions/${id}`);
  return response.data;
};

export const fetchRoutes = async () => {
  try {
    const response = await api.get("/routes");
    return response.data.map((route: any) => ({
      ...route,
      attractionIds: route.attraction_ids || [],
    }));
  } catch (error) {
    console.error("Ошибка при загрузке маршрутов:", error);
    throw error;
  }
};

export const saveRoute = async (route: {
  name: string;
  attractionIds: number[];
}) => {
  try {
    const payload = {
      name: route.name,
      attraction_ids: route.attractionIds,
    };
    const response = await api.post("/routes", payload);
    return response.data;
  } catch (error) {
    console.error("Ошибка при сохранении маршрута:", error);
    throw error;
  }
};

export const updateRoute = async (
  id: string,
  route: { name: string; attractionIds: number[] }
) => {
  try {
    const payload = {
      name: route.name,
      attraction_ids: route.attractionIds,
    };
    const response = await api.put(`/routes/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Ошибка при обновлении маршрута:", error);
    throw error;
  }
};
