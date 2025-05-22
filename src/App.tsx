import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AttractionListPage from "./pages/AttractionListPage";
import AttractionDetailPage from "./pages/AttractionDetailPage";
import MyRoutesPage from "./pages/MyRoutesPage"; // Импортируем новую страницу

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<AttractionListPage />} />
      <Route path="/attraction/:id" element={<AttractionDetailPage />} />
      <Route path="/route" element={<MyRoutesPage />} />{" "}
      {/* Заменяем RoutePage на MyRoutesPage */}
    </Routes>
  </Router>
);

export default App;
