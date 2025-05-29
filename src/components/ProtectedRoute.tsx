import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
  const token = localStorage.getItem("token");

  // Если токена нет — перенаправляем на страницу входа
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Если токен есть — показываем вложенные компоненты (страницы)
  return <Outlet />;
};

export default ProtectedRoute;
