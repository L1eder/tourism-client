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
import RegisterForm from "./components/RegisterForm";
import AdminPanel from "./components/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AttractionListPage />} />
        <Route path="/attraction/:id" element={<AttractionDetailPage />} />
        <Route path="/route" element={<MyRoutesPage />} />
        <Route path="/admin" element={<AdminPanel />} />{" "}
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </Router>
);

export default App;
