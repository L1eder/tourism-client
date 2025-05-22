import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AttractionListPage from "./pages/AttractionListPage";
import AttractionDetailPage from "./pages/AttractionDetailPage";
import RoutePage from "./pages/RoutePage";

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<AttractionListPage />} />
      <Route path="/attraction/:id" element={<AttractionDetailPage />} />
      <Route path="/route" element={<RoutePage />} />
    </Routes>
  </Router>
);

export default App;
