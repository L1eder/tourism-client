// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AttractionListPage from "./pages/AttractionListPage";
import AttractionDetailPage from "./pages/AttractionDetailPage";

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<AttractionListPage />} />
      <Route path="/attraction/:id" element={<AttractionDetailPage />} />
    </Routes>
  </Router>
);

export default App;
