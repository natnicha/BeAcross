import React, { useState, useEffect, useRef } from "react";
import Popup from "../components/ChangepasswordPopup";

//thumbnail images
import personalplanImage from "../images/projects/personal-plan.png";
import examResultImage from "../images/projects/exam-result.png";
import editProfileImage from "../images/projects/edit-profile.png";
import Profile from "../components/Profile";
import { getPersonalPlan, getModuleDetail, ModuleResponse, Item, moduleItem} from "../services/personalplanServices";

const StudentProfilepage: React.FC = () => {
  const [activeNav, setActiveNav] = useState("home"); // State to track the active navigation item
  const [showProfileInformation, setShowProfileInformation] = useState(false); // State to manage visibility of the sections
  const [showExamResult, setExamResult] = useState(false); // State to manage visibility of the sections
  const [showPersonalPlan, setPersonalPlan] = useState(false); // State to manage visibility of the sections
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage the popup visibility

  //personal plan
  const [moduleDetailsArray, setModuleDetailsArray] = useState<moduleItem[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  
  // Function to Nav navigation item click
  const homeNavClick = (navItem: string) => {
    setActiveNav(navItem);
    setShowProfileInformation(false);
    setExamResult(false);
    setPersonalPlan(false);
  };
  const planNavClick = (navItem: string) => {
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


  //Personal Plan
  const handlePersonalPlanClick = async () => {
    try {
      const personalPlanResponse = await getPersonalPlan();
      sessionStorage.setItem('personalPlanData', JSON.stringify(personalPlanResponse));
  
      const moduleDetailsPromises = personalPlanResponse.data.items.map(item =>
        getModuleDetail(item.module_id)
      );
      const moduleDetailsResponses = await Promise.all(moduleDetailsPromises);
  
      // Assuming each getModuleDetail response has an 'items' array you want to display
      // Flatten all module items into a single array and update state
      const moduleItems = moduleDetailsResponses.flatMap(response => response.items || []);
      setModuleDetailsArray(moduleItems); // Store fetched module items in state
  
      setPersonalPlan(true);
      setExamResult(false);
      setShowProfileInformation(false);
    } catch (error) {
      console.error("Failed to fetch module details:", error);
    }
  };

  const handleRowClick = (item: Item) => {
    // Set the selectedModuleId which triggers fetching module details
    setSelectedModuleId(item.module_id);
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
              <li
                className={`tm-nav-item ${
                  activeNav === "mypersonalplan" ? "active" : ""
                }`}
                onClick={() => planNavClick("mypersonalplan")}
              >
                <a href="#mypersonalplan" className="tm-nav-link">
                  &nbsp;&nbsp;
                  <i className="bi bi-bookmark"></i> My Personal Plan
                </a>
              </li>
              <li
                className={`tm-nav-item ${
                  activeNav === "myexamresult" ? "active" : ""
                }`}
                onClick={() => examNavClick("myexamresult")}
              >
                <a href="#myexamresult" className="tm-nav-link">
                  &nbsp;&nbsp;
                  <i className="bi bi-file-earmark-text"></i> My Exam Results
                </a>
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
                  <i className="bi bi-file-person"></i> Profile
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
                  <strong> &nbsp; Personal Plan</strong>
                </a>
              </button>

              <button
                className="nav-link active"
                id="examresult"
                onClick={handleExamResultClick}
              >
                <img
                  src={examResultImage}
                  className="img-fluid projects-image"
                  alt="Exam Result"
                />

                <a className="click-scroll" href="#exam-result">
                  <i className="bi bi-file-earmark-text"></i>{" "}
                  <strong> &nbsp; Exam Result</strong>
                </a>
              </button>

              <button
                className="nav-link active"
                id="editprofile"
                onClick={handleEditProfileClick}
              >
                <img
                  src={editProfileImage}
                  className="img-fluid projects-image"
                  alt="Edit Profile"
                />

                <a className="click-scroll" href="#edit-profile">
                  <i className="bi bi-file-earmark-text"></i>{" "}
                  <strong> &nbsp; Edit Profile</strong>
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
              <Profile />
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
        {showPersonalPlan && (
          <section className="tm-content" id="profileinformation">
            <div className="nav nav-tabs flex-row align-items-baseline">
              <div className="about-thumb bg-white shadow-lg">
                <h5 className="mb-3" style={{ color: "#1e5af5" }}>
                  My Personal Plan
                </h5>
                {/* Render module details directly from moduleDetailsArray */}
                {moduleDetailsArray.map((moduleItem, index) => (
                  <div className="search-table" key={index}>
                    <div className="search-row">
                      <div className="search-column">{moduleItem.module_code}</div>
                      <div className="search-column">{moduleItem.module_name}</div>
                      <div className="search-column">{moduleItem.ects}</div>
                      <div className="search-column">{moduleItem.degree_level}</div>
                      <div className="search-column">{moduleItem.type}</div>
                      <div className="search-column">{moduleItem.university}</div>
                      {/* Add more fields from moduleItem as needed */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default StudentProfilepage;
