
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';

export const APP_ROUTES = [
  {
    "name": "Home",
    "route": "/"
  },
  {
    "name": "About",
    "route": "/about"
  }
];

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}
