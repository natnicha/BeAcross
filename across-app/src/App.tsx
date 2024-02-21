import React, { useEffect } from "react";
import "./App.css";
import "./bootstrap.min.css";
import "./bootstrap-icons.css";
import "./magnific-popup.css";
import "./tooplate-waso-strategy.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./UserContext";
import { PopupProvider } from "./PopupContext";

import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import StudentProfilePage from "./pages/StudentProfilepage";
import AdminBackofficePage from "./pages/AdminBackofficePage";

const App: React.FC = () => {
  return (
    <UserProvider>
      <PopupProvider>
        <Router>
          <Header />
          <Routes>
            <Route index path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/studentprofile" element={<StudentProfilePage />} />
            <Route path="/admin/*" element={<AdminBackofficePage />} />
            <Route path="/*" element={<h1>Not Found</h1>} /> {/* 404 */}
          </Routes>
          <Footer />
        </Router>
      </PopupProvider>
    </UserProvider>
  );
};

export default App;
