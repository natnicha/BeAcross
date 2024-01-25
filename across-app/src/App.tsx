import React from "react";
import "./App.css";
import "./bootstrap.min.css";
import "./bootstrap-icons.css";
import "./magnific-popup.css";
import "./tooplate-waso-strategy.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import StudentProfilePage from "./pages/StudentProfilepage";
import AdminBackofficePage from "./pages/AdminBackofficePage";

const App: React.FC = () => {
  return (
    <>
      <Header />
      <Router>
        <Routes>
          <Route index path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/studentprofile" element={<StudentProfilePage />} />
          <Route path="/admin" element={<AdminBackofficePage />} />
          {/* <Route path="/test" element={<Test />} /> */}
          <Route path="/*" element={<h1>Not Found</h1>} /> {/* 404 */}
        </Routes>
      </Router>
      <Footer />
    </>
  );
};

export default App;
