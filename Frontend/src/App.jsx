import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import AuthPage from "./pages/AuthPages";
import ReportPage from "./pages/ReportPage";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/about" element={<AboutPage/>} />
          <Route path="/auth" element={<AuthPage/>} />
          <Route path="/reports" element={<ReportPage/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
