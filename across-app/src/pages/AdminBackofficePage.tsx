/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Link, Routes, Route } from "react-router-dom";

// Submenu
import AdminHome from "../components/adminBackoffice/AdminHome";
import FileUploader from "../components/adminBackoffice/FileUploader";
import ModuleList from "../components/adminBackoffice/ModuleList";
import StudAcctCreate from "../components/adminBackoffice/StudAcctCreate";
import StudList from "../components/adminBackoffice/StudList";
import Profile from "../components/Profile";

// Bootstrap
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Toggle Submenu usestate
const AdminBackofficePage: React.FC = () => {
  
  const isJwtExist = sessionStorage.getItem('jwtToken') != null && sessionStorage.getItem('jwtToken') != undefined && sessionStorage.getItem('jwtToken') != "";
  if (!isJwtExist) { window.location.href = window.location.origin; }    // go to first page

  const [chevron, setChevron] = useState(true);
  const [chevron2, setChevron2] = useState(true);

  return (
    <>
      <div className="profile-container">
        <section className="tm-sidebar" id="tm-sidebar">
          <nav className="tm-nav" id="tm-nav">
            {/* Submenu links */}
            <ul className="tm-nav-items">
              <li className="tm-nav-item">
                <Link to="" className="tm-nav-link">
                  &nbsp;&nbsp;<i className="bi bi-house-door"></i>Home
                </Link>
              </li>
              <li className="tm-nav-item">
                <a
                  className="tm-nav-link"
                  role="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseUniModules"
                  aria-expanded="false"
                  aria-controls="collapseUniModules"
                  onClick={() => setChevron(!chevron)}
                >
                  &nbsp;&nbsp;<i className="bi bi-bookmark"></i>University
                  Moduels
                  <i
                    className={
                      chevron ? "bi bi-chevron-down" : "bi bi-chevron-up"
                    }
                    style={{ marginLeft: "auto" }}
                  ></i>
                </a>
                <ul className="collapse show" id="collapseUniModules">
                  <li className="tm-nav-item" style={{ border: "none" }}>
                    <Link to="upload" className="nav-link">
                      Upload Modules
                    </Link>
                  </li>
                  <li className="tm-nav-item" style={{ border: "none" }}>
                    <Link to="list" className="nav-link">
                      Module List
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="tm-nav-item">
                <a
                  className="tm-nav-link"
                  role="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseStudentAccount"
                  aria-expanded="false"
                  aria-controls="collapseStudentAccount"
                  onClick={() => setChevron2(!chevron2)}
                >
                  &nbsp;&nbsp;<i className="bi bi-person-fill"></i>
                  University Students
                  <i
                    className={
                      chevron2 ? "bi bi-chevron-down" : "bi bi-chevron-up"
                    }
                    style={{ marginLeft: "auto" }}
                  ></i>
                </a>
                <ul className="collapse show" id="collapseStudentAccount">
                  <li className="tm-nav-item" style={{ border: "none" }}>
                    <Link to="create" className="nav-link">
                      {" "}
                      Create Student Account
                    </Link>
                  </li>
                  <li className="tm-nav-item" style={{ border: "none" }}>
                    <Link to="studlist" className="nav-link">
                      {" "}
                      Student List
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
            <ul>
              <li className="tm-nav-item">
                <Link to="profile" className="tm-nav-link">
                  &nbsp;&nbsp;<i className="bi bi-file-person"></i>Profile
                </Link>
              </li>
            </ul>
          </nav>
        </section>

        {/* Submenu router */}
        <section className="tm-content">
          <div className="nav nav-tabs flex-row align-items-baseline">
            <Routes>
              <Route path="upload" element={<FileUploader />} />
              <Route path="list" element={<ModuleList />} />
              <Route path="create" element={<StudAcctCreate />} />
              <Route path="studlist" element={<StudList />} />
              <Route path="profile" element={<Profile />} />
              <Route index path="/" element={<AdminHome />} />
            </Routes>
          </div>
        </section>
      </div>
    </>
  );
};

export default AdminBackofficePage;
