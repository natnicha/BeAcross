import React, { useState, useEffect, useRef } from "react";
import Popup from "../components/ChangepasswordPopup";
import { registerUser } from "../services/authenticationServices";
import FileUploader from "../components/FileUploader";

// Bootstrap
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

//thumbnail images
import personalplanImage from "../images/projects/personal-plan.png";
import examResultImage from "../images/projects/exam-result.png";
import editProfileImage from "../images/projects/edit-profile.png";

const StudentProfilepage: React.FC = () => {
  const [activeNav, setActiveNav] = useState("home"); // State to track the active navigation item
  const [showProfileInformation, setShowProfileInformation] = useState(false); // State to manage visibility of the sections
  const [showUniModuleUpload, setUniModuleUpload] = useState(false); // State to manage visibility of the sections
  const [showUniModuleList, setUniModuleList] = useState(false); // State to manage visibility of the sections
  const [showStudAcctCreate, setStudAcctCreate] = useState(false); // State to manage visibility of the sections
  const [showStudList, setStudList] = useState(false); // State to manage visibility of the sections
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage the popup visibility

  // Function to Nav navigation item click
  const homeNavClick = (navItem: string) => {
    setActiveNav(navItem);
    setShowProfileInformation(false);
    setUniModuleUpload(false);
    setUniModuleList(false);
    setStudAcctCreate(false);
    setStudList(false);
  };

  const profileNavClick = (navItem: string) => {
    setActiveNav(navItem);
    setShowProfileInformation(true);
    setUniModuleUpload(false);
    setUniModuleList(false);
    setStudAcctCreate(false);
    setStudList(false);
  };

  //Funtion to Nav navigation and card click
  const uniModuleUploadClick = (navItem: string) => {
    setActiveNav(navItem);
    setShowProfileInformation(false);
    setUniModuleUpload(true);
    setUniModuleList(false);
    setStudAcctCreate(false);
    setStudList(false);
  };
  const uniModuleListClick = (navItem: string) => {
    setActiveNav(navItem);
    setShowProfileInformation(false);
    setUniModuleUpload(false);
    setUniModuleList(true);
    setStudAcctCreate(false);
    setStudList(false);
  };
  const studAcctCreateClick = (navItem: string) => {
    setActiveNav(navItem);
    setShowProfileInformation(false);
    setUniModuleUpload(false);
    setUniModuleList(false);
    setStudAcctCreate(true);
    setStudList(false);
  };
  const studListClick = (navItem: string) => {
    setActiveNav(navItem);
    setShowProfileInformation(false);
    setUniModuleUpload(false);
    setUniModuleList(false);
    setStudAcctCreate(false);
    setStudList(true);
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

  const handleSubmit = async () => {
    try {
      // Call the registerUser function
      const response = await registerUser(emailToRegister);
      setResponseMessage(response);
      console.log("Registration successful:", response);
      if (
        response ===
        "The registration email has been successfully sent to your email!"
      ) {
        setIsSubmitted(true);
        setResponseStyle({ margin: "15px", color: "green" }); // Set to green on success
      } else {
        setResponseStyle({ margin: "15px", color: "red" }); // Set to red on failure
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setResponseMessage("Registration failed"); // Update message on catch
      setResponseStyle({ margin: "15px", color: "red" }); // Set to red on error
    }
  };
  const [emailToRegister, setEmailToRegister] = useState(""); // State for storing the email address
  const [responseMessage, setResponseMessage] = useState(""); // State for storing response
  const [isSubmitted, setIsSubmitted] = useState(false); // enable/disable button and input
  const [responseStyle, setResponseStyle] = useState({
    margin: "15px",
    color: "green",
  }); // response text style

  // Handle email input changes
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailToRegister(event.target.value);
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
                    onClick={() => uniModuleUploadClick("upload")}
                  >
                    <a className="nav-link" href="#upload">
                      Upload Modules
                    </a>
                  </li>
                  <li
                    className={`tm-nav-item ${
                      activeNav === "list" ? "active" : ""
                    }`}
                    onClick={() => uniModuleListClick("list")}
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
                      activeNav === "create" ? "active" : ""
                    }`}
                    onClick={() => studAcctCreateClick("create")}
                  >
                    <a className="nav-link" href="#create">
                      Create Student Account
                    </a>
                  </li>
                  <li
                    className={`tm-nav-item ${
                      activeNav === "studlist" ? "active" : ""
                    }`}
                    onClick={() => studListClick("studlist")}
                  >
                    <a className="nav-link" href="#studlist">
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
        {!showProfileInformation &&
          !showUniModuleUpload &&
          !showUniModuleList &&
          !showStudAcctCreate &&
          !showStudList && (
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
                    href="#upload"
                    onClick={() => uniModuleUploadClick("upload")}
                  >
                    <i className="bi bi-bookmark"></i>{" "}
                    <strong> &nbsp; Upload Modules</strong>
                  </a>
                  <br />
                  <a
                    className="click-scroll"
                    href="#list"
                    onClick={() => uniModuleListClick("list")}
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
                    href="#create"
                    onClick={() => studAcctCreateClick("create")}
                  >
                    <i className="bi bi-bookmark"></i>{" "}
                    <strong> &nbsp; Create Student Account</strong>
                  </a>
                  <br />
                  <a
                    className="click-scroll"
                    href="#studlist"
                    onClick={() => studListClick("studlist")}
                  >
                    <i className="bi bi-bookmark"></i>{" "}
                    <strong> &nbsp; Student List</strong>
                  </a>
                </button>
                <button
                  className="nav-link active"
                  id="editprofile"
                  onClick={() => profileNavClick("profile")}
                >
                  <img
                    src={editProfileImage}
                    className="img-fluid projects-image"
                    alt="Edit Profile"
                  />

                  <a className="click-scroll" href="#profile">
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

        {/*Upload Modules*/}
        {/* Conditional rendering for exam result section */}
        {showUniModuleUpload && (
          <section className="tm-content" id="profileinformation">
            <div className="nav nav-tabs flex-row align-items-baseline">
              <div className="about-thumb bg-white shadow-lg">
                <FileUploader />
              </div>
            </div>
          </section>
        )}

        {/*Modules list*/}
        {/* Conditional rendering for personal plan section */}
        {showUniModuleList && (
          <section className="tm-content" id="profileinformation">
            <div className="nav nav-tabs flex-row align-items-baseline">
              <div className="about-thumb bg-white shadow-lg">
                <h5 className="mb-3" style={{ color: "#1e5af5" }}>
                  Module List
                </h5>
              </div>
            </div>
          </section>
        )}

        {/*Create Student Account*/}
        {/* Conditional rendering for personal plan section */}
        {showStudAcctCreate && (
          <section className="tm-content" id="profileinformation">
            <div className="nav nav-tabs flex-row align-items-baseline">
              <div className="about-thumb bg-white shadow-lg">
                <div className="personal-info-section">
                  <p>Student university Email:</p>
                  <input
                    type="email"
                    className="registerEmail full-width-input"
                    placeholder="firstname.lastname@university.xx"
                    value={emailToRegister}
                    onChange={handleEmailChange}
                    disabled={isSubmitted}
                  />
                  <button
                    className="custom-btn btn custom-link mt-4"
                    onClick={handleSubmit}
                    disabled={isSubmitted}
                  >
                    Submit
                  </button>
                  <p style={responseStyle}>{responseMessage}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/*Student List*/}
        {/* Conditional rendering for personal plan section */}
        {showStudList && (
          <section className="tm-content" id="profileinformation">
            <div className="nav nav-tabs flex-row align-items-baseline">
              <div className="about-thumb bg-white shadow-lg">
                <h5 className="mb-3" style={{ color: "#1e5af5" }}>
                  Student List
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
