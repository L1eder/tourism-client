import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 10000,
});

export const fetchAttractions = async () => {
  const response = await api.get("/attractions");
  return response.data;
};

export const fetchAttractionById = async (id: number) => {
  const response = await api.get(`/attractions/${id}`);
  return response.data;
};

export const fetchRoutes = async () => {
  const response = await api.get("/routes");
  return response.data;
};

export const saveRoute = async (route: {
  name: string;
  attractionIds: number[];
}) => {
  const response = await api.post("/routes", route);
  return response.data;
};

export const updateRoute = async (
  id: string,
  route: { name: string; attractionIds: number[] }
) => {
  const response = await api.put(`/routes/${id}`, route);
  return response.data;
};
