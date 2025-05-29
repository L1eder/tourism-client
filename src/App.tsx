import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AttractionListPage from "./pages/AttractionListPage";
import AttractionDetailPage from "./pages/AttractionDetailPage";
import MyRoutesPage from "./pages/MyRoutesPage";
import LoginForm from "./components/LoginForm";
import ProtectedRoute from "./components/ProtectedRoute";

const App: React.FC = () => (
  <Router>
    <Routes>
      {/* Публичный маршрут — форма входа */}
      <Route path="/login" element={<LoginForm />} />

      {/* Защищённые маршруты */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AttractionListPage />} />
        <Route path="/attraction/:id" element={<AttractionDetailPage />} />
        <Route path="/route" element={<MyRoutesPage />} />
      </Route>

      {/* Опционально: перенаправление с несуществующих путей на /login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </Router>
);

export default App;
