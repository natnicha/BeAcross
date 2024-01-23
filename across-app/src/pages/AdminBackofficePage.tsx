import React, { useState, useEffect, useRef } from "react";
import Popup from "../components/ChangepasswordPopup";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

//thumbnail images
import personalplanImage from "../images/projects/personal-plan.png";
import examResultImage from "../images/projects/exam-result.png";

const StudentProfilepage: React.FC = () => {
  const [activeNav, setActiveNav] = useState("home"); // State to track the active navigation item
  const [showProfileInformation, setShowProfileInformation] = useState(false); // State to manage visibility of the sections
  const [showExamResult, setExamResult] = useState(false); // State to manage visibility of the sections
  const [showPersonalPlan, setPersonalPlan] = useState(false); // State to manage visibility of the sections
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage the popup visibility

  // Function to Nav navigation item click
  const homeNavClick = (navItem: string) => {
    setActiveNav(navItem);
    setShowProfileInformation(false);
    setExamResult(false);
    setPersonalPlan(false);
  };
  const uniModulesNavClick = (navItem: string) => {
    setActiveNav(navItem);
    setPersonalPlan(true);
    setShowProfileInformation(false);
    setExamResult(false);
  };
  const examNavClick = (navItem: string) => {
    setActiveNav(navItem);
    setExamResult(true);
    setShowProfileInformation(false);
    setPersonalPlan(false);
  };
  const profileNavClick = (navItem: string) => {
    setActiveNav(navItem);
    setShowProfileInformation(true);
    setExamResult(false);
    setPersonalPlan(false);
  };

  // Event handler for button navigate
  const handleEditProfileClick = () => {
    setShowProfileInformation(true);
    setExamResult(false);
    setPersonalPlan(false);
  };
  const handleExamResultClick = () => {
    setExamResult(true);
    setShowProfileInformation(false);
    setPersonalPlan(false);
  };
  const handlePersonalPlanClick = () => {
    setPersonalPlan(true);
    setExamResult(false);
    setShowProfileInformation(false);
  };

  // State for the visibility of rows under module types
  const [showFocusModuleRows, setShowFocusModuleRows] = useState(false);
  const [showAdvanceModuleRows, setShowAdvanceModuleRows] = useState(false);
  const [showSeminarModuleRows, setSeminarModuleRows] = useState(false);
  const [showKeyCompetenceRows, setKeyCompetenceRows] = useState(false);

  // Toggle function for each module type Row
  const toggleFocusModuleRows = () => {
    setShowFocusModuleRows(!showFocusModuleRows);
  };
  const toggleAdvanceModuleRows = () => {
    setShowAdvanceModuleRows(!showAdvanceModuleRows);
  };
  const toggleSeminarModuleRows = () => {
    setSeminarModuleRows(!showSeminarModuleRows);
  };
  const toggleKeyCompetenceRows = () => {
    setKeyCompetenceRows(!showKeyCompetenceRows);
  };

  // Function to open/close the popup
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);
  // Function to change the chevron icon
  const [chevron, setChevron] = useState(true);
  const [chevron2, setChevron2] = useState(true);

  const handleChevron = (prop: any) => {
    prop = chevron ? setChevron(!chevron) : setChevron2(!chevron2);
  };

  return (
    <>
      <div className="profile-container">
        {/*Sidebar menu*/}
        <section className="tm-sidebar" id="tm-sidebar">
          <nav className="tm-nav" id="tm-nav">
            <ul className="tm-nav-items">
              <li
                className={`tm-nav-item ${
                  activeNav === "home" ? "active" : ""
                }`}
                onClick={() => homeNavClick("home")}
              >
                <a href="#home" className="tm-nav-link">
                  &nbsp;&nbsp;
                  <i className="bi bi-house-door"></i> Home
                </a>
              </li>
              <li className="tm-nav-item">
                <a
                  className="tm-nav-link"
                  role="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseUniModules"
                  aria-expanded="false"
                  aria-controls="collapseUniModules"
                  onClick={handleChevron}
                >
                  &nbsp;&nbsp;
                  <i className="bi bi-bookmark"></i>University Moduels
                  <i
                    className={
                      chevron ? "bi bi-chevron-down" : "bi bi-chevron-up"
                    }
                    style={{ marginLeft: "auto" }}
                  ></i>
                </a>
                <ul className="collapse show" id="collapseUniModules">
                  <li
                    className={`tm-nav-item ${
                      activeNav === "unimodule" ? "active" : ""
                    }`}
                    onClick={() => uniModulesNavClick("unimodule")}
                  >
                    <a className="nav-link" href="#upload">
                      Upload Modules
                    </a>
                  </li>
                  <li
                    className={`tm-nav-item ${
                      activeNav === "unimodule" ? "active" : ""
                    }`}
                    onClick={() => uniModulesNavClick("unimodule")}
                  >
                    <a className="nav-link" href="#list">
                      Module List
                    </a>
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
                  onClick={handleChevron}
                >
                  &nbsp;&nbsp;
                  <i className="bi bi-person-fill-add"></i>Student Account
                  <i
                    className={
                      chevron2 ? "bi bi-chevron-down" : "bi bi-chevron-up"
                    }
                    style={{ marginLeft: "auto" }}
                  ></i>
                </a>
                <ul className="collapse show" id="collapseStudentAccount">
                  <li
                    className={`tm-nav-item ${
                      activeNav === "unimodule" ? "active" : ""
                    }`}
                    onClick={() => uniModulesNavClick("unimodule")}
                  >
                    <a className="nav-link" href="#upload">
                      Create Student Account
                    </a>
                  </li>
                  <li
                    className={`tm-nav-item ${
                      activeNav === "unimodule" ? "active" : ""
                    }`}
                    onClick={() => uniModulesNavClick("unimodule")}
                  >
                    <a className="nav-link" href="#list">
                      Student List
                    </a>
                  </li>
                </ul>
              </li>
            </ul>

            <ul>
              <li
                className={`tm-nav-item ${
                  activeNav === "profile" ? "active" : ""
                }`}
                onClick={() => profileNavClick("profile")}
              >
                <a href="#profile" className="tm-nav-link">
                  &nbsp;&nbsp;
                  <i className="bi bi-file-person"></i>Profile
                </a>
              </li>
            </ul>
          </nav>
        </section>

        {/*Menu card*/}
        {/* Conditional rendering for menu card section */}
        {!showProfileInformation && !showExamResult && !showPersonalPlan && (
          <section className="tm-content" id="menucard">
            <div className="nav nav-tabs flex-row align-items-baseline">
              <button className="nav-link active" id="personalplan">
                <img
                  src={personalplanImage}
                  className="img-fluid projects-image"
                  alt="Personal Plan"
                />

                <a
                  className="click-scroll"
                  href="#personal-plan"
                  onClick={handlePersonalPlanClick}
                >
                  <i className="bi bi-bookmark"></i>{" "}
                  <strong> &nbsp; Upload Modules</strong>
                </a>
                <br />
                <a
                  className="click-scroll"
                  href="#personal-plan"
                  onClick={handlePersonalPlanClick}
                >
                  <i className="bi bi-bookmark"></i>{" "}
                  <strong> &nbsp; Module List</strong>
                </a>
              </button>

              <button className="nav-link active" id="examresult">
                <img
                  src={examResultImage}
                  className="img-fluid projects-image"
                  alt="Exam Result"
                />
                <a
                  className="click-scroll"
                  href="#personal-plan"
                  onClick={handlePersonalPlanClick}
                >
                  <i className="bi bi-bookmark"></i>{" "}
                  <strong> &nbsp; Create Student Account</strong>
                </a>
                <br />
                <a
                  className="click-scroll"
                  href="#personal-plan"
                  onClick={handlePersonalPlanClick}
                >
                  <i className="bi bi-bookmark"></i>{" "}
                  <strong> &nbsp; Student List</strong>
                </a>
              </button>
            </div>
          </section>
        )}

        {/*Profile Information*/}
        {/* Conditional rendering for profile information section */}
        {showProfileInformation && (
          <section className="tm-content" id="profileinformation">
            <div className="nav nav-tabs flex-row align-items-baseline">
              <div className="about-thumb bg-white shadow-lg">
                <h5 className="mb-3" style={{ color: "#1e5af5" }}>
                  Personal Information
                </h5>
                <div className="personal-info-container">
                  <div className="personal-info-section">
                    <p>First Name:</p>
                    <input
                      type="text"
                      className="firstname full-width-input"
                      placeholder=""
                    />
                  </div>

                  <div className="personal-info-section">
                    <p>Last Name:</p>
                    <input
                      type="text"
                      className="lastname full-width-input"
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="personal-info-section">
                  <p>Email:</p>
                  <input
                    type="text"
                    className="email full-width-input"
                    placeholder="firstname.lastname@tu-chemnitz.de"
                    disabled
                  />
                </div>
                <div className="personal-info-section">
                  <p>University Affiliation:</p>
                  <input
                    type="text"
                    className="uniInfo full-width-input"
                    placeholder="Chemnitz University of Technology"
                    disabled
                  />
                </div>
                <hr />
                <div className="personal-info-container">
                  <div className="personal-info-section">
                    <p>Password:</p>
                    <input
                      type="text"
                      className="password full-width-input"
                      placeholder="********"
                      disabled
                    />
                  </div>
                  <button
                    onClick={openPopup}
                    className="custom-btn btn custom-link mt-4"
                  >
                    Change Password
                  </button>

                  {isPopupOpen && <Popup content="" onClose={closePopup} />}
                  <button className="custom-btn-green btn custom-link mt-4">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/*Exam Results*/}
        {/* Conditional rendering for exam result section */}
        {showExamResult && (
          <section className="tm-content" id="profileinformation">
            <div className="nav nav-tabs flex-row align-items-baseline">
              <div className="about-thumb bg-white shadow-lg">
                <h5 className="mb-3" style={{ color: "#1e5af5" }}>
                  Grade Archived
                </h5>
                <table>
                  <thead>
                    <tr>
                      <th>Modules Name</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      onClick={toggleFocusModuleRows}
                      style={{ cursor: "pointer" }}
                    >
                      <td colSpan={2}>
                        <i className="bi bi-caret-down-fill"></i>
                        &nbsp;&nbsp;Focus modules - 25.0 credits
                      </td>
                    </tr>
                    {!showFocusModuleRows && (
                      <>
                        <tr>
                          <td>
                            553010 - Current Trends in Web Engineering - Core
                            elective - 5.0 credits
                          </td>
                          <td>passed</td>
                        </tr>
                        <tr>
                          <td>
                            563050 - Databases and web technologies - Core
                            elective - 5.0 credits
                          </td>
                          <td>passed</td>
                        </tr>
                        <tr>
                          <td>
                            553050 - Cloud & Web applications - Core elective -
                            5.0 credits
                          </td>
                          <td>failed</td>
                        </tr>
                      </>
                    )}

                    <tr
                      onClick={toggleAdvanceModuleRows}
                      style={{ cursor: "pointer" }}
                    >
                      <td colSpan={2}>
                        <i className="bi bi-caret-down-fill"></i>
                        &nbsp;&nbsp;Advance modules - 25.0 credits
                      </td>
                    </tr>
                    {!showAdvanceModuleRows && (
                      <>
                        <tr>
                          <td>
                            553030 - Design of distributed systems - Core
                            elective - 5.0 credits
                          </td>
                          <td>passed</td>
                        </tr>
                      </>
                    )}

                    <tr
                      onClick={toggleSeminarModuleRows}
                      style={{ cursor: "pointer" }}
                    >
                      <td colSpan={2}>
                        <i className="bi bi-caret-down-fill"></i>
                        &nbsp;&nbsp;Seminar modules - 7.0 credits
                      </td>
                    </tr>
                    {!showSeminarModuleRows && (
                      <>
                        <tr>
                          <td>
                            500410 Seminar Web Engineering - Compulsory elective
                            - 5.0 credits
                          </td>
                          <td>passed</td>
                        </tr>
                        <tr>
                          <td>
                            500420 Preparatory seminar business game web
                            engineering - Compulsory elective - 2.0 credits
                          </td>
                          <td>passed</td>
                        </tr>
                      </>
                    )}

                    <tr
                      onClick={toggleKeyCompetenceRows}
                      style={{ cursor: "pointer" }}
                    >
                      <td colSpan={2}>
                        <i className="bi bi-caret-down-fill"></i>&nbsp;&nbsp;Key
                        Competence - 8.0 credits
                      </td>
                    </tr>
                    {!showKeyCompetenceRows && (
                      <>
                        <tr>
                          <td>
                            136130 German as a foreign language I (level A1) -
                            Core elective - 4.0 credits
                          </td>
                          <td>passed</td>
                        </tr>
                        <tr>
                          <td>
                            136135 German as a foreign language II (level A2) -
                            Core elective - 4.0 credits
                          </td>
                          <td>failed</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/*Personal Plan*/}
        {/* Conditional rendering for personal plan section */}
        {showPersonalPlan && (
          <section className="tm-content" id="profileinformation">
            <div className="nav nav-tabs flex-row align-items-baseline">
              <div className="about-thumb bg-white shadow-lg">
                <h5 className="mb-3" style={{ color: "#1e5af5" }}>
                  My Personal Plan
                </h5>
              </div>
            </div>
          </section>
        )}

        {/*Personal Plan*/}
        {/* Conditional rendering for personal plan section */}
        {showPersonalPlan && (
          <section className="tm-content" id="profileinformation">
            <div className="nav nav-tabs flex-row align-items-baseline">
              <div className="about-thumb bg-white shadow-lg">
                <h5 className="mb-3" style={{ color: "#1e5af5" }}>
                  My Personal Plan
                </h5>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default StudentProfilepage;
