import React, { useState } from 'react';
import MapContainer from './MapContainer';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DetailPage from "./DetailPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MapContainer />} />
        <Route path="/detail/:id" element={<DetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
