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
import AboutAcross from "./pages/AboutAcrossPage";
import Policy from "./pages/PolicyPage";
import ContactUs from "./pages/ContactUsPage";
import SearchPage from "./pages/SearchPage";
import StudentProfilePage from "./pages/StudentProfilepage";
import AdminBackofficePage from "./pages/AdminBackofficePage";

import ProtectedRoute from './ProtectedRoute';

const App: React.FC = () => {

  // Check if the user is authenticated
  const isAuthenticated = sessionStorage.getItem('jwtToken') ? true : false;

  return (
    <UserProvider>
      <PopupProvider>
        <Router>
          <Header />
          <Routes>
            <Route index path="/" element={<HomePage />} />
            <Route index path="/aboutacross" element={<AboutAcross />} />
            <Route index path="/policy" element={<Policy />} />
            <Route index path="/contactus" element={<ContactUs />} />
            <Route path="/search" element={<SearchPage />} />
            <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
              <Route path="/studentprofile" element={<StudentProfilePage />} />
              <Route path="/admin/*" element={<AdminBackofficePage />} />
            </Route>
            <Route path="/*" element={<h1>Page Not Found</h1>} /> {/* 404 */}
          </Routes>
          <Footer />
        </Router>
      </PopupProvider>
    </UserProvider>
  );
};

export default App;
