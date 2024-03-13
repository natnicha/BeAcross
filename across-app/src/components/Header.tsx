import React from 'react';
import RegisterPopup from "../components/RegisterationPopup";
import LoginPopup from "../components/LoginPopup";
import { useUser } from "../UserContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { usePopups } from "../PopupContext";
import ForgotPasswordPopup from "./ForgotPasswordPopup";


const Header: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn } = useUser(); // check user status (login)
  // Hook all popup control to PopupContext
  const {
    openLoginPopup,
    isLoginPopupOpen,
    openRegisterPopup,
    isRegisterPopupOpen,
    isForgotPasswordPopupOpen,
    closeAllPopups,
  } = usePopups();

  const navigate = useNavigate(); // redirect user back to homepage

  const handleLogout = () => {
    // Clear the token and user_role on logout
    sessionStorage.removeItem("jwtToken");
    sessionStorage.removeItem("user_role");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <>
      <header className="site-header">
        <div className="container">
          <div className="row align-items-center">
            <div>
              <p className="text-white mb-0">
                <i className="bi-globe site-header-icon me-2"></i>
                We Strongly Believe in an Educational Future Without Borders.
              </p>
            </div>
          </div>
        </div>
      </header>

      <nav className="navbar navbar-expand-lg bg-white shadow-lg">
        <div className="container">
          <Link to="/">
            <img src="../across-logo.png"></img>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/" className="nav-link click-scroll">
                  <strong>Home</strong>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/aboutacross" className="nav-link click-scroll">
                  <strong>About</strong>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/policy" className="nav-link click-scroll">
                  <strong>Policy</strong>
                </Link>
              </li>
              <li className="nav-item">
               <Link to="/contactus" className="nav-link click-scroll">
                  <strong>Contact Us</strong>
                </Link>
              </li>
              <li className="nav-item">
                <div className="d-flex align-items-center mt-2">
                  {/* Change button text base on user status */}
                  {isLoggedIn ? (
                    <a
                      className="custom-btn-red btn custom-link"
                      onClick={() => {
                        handleLogout(); // check user status
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <strong>Logout</strong>
                    </a>
                  ) : (
                    <a
                      className="custom-btn-green btn custom-link"
                      onClick={() => {
                        openLoginPopup();
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <strong>Login</strong>
                    </a>
                  )}

                  {isLoginPopupOpen && (
                    <LoginPopup content="" onClose={closeAllPopups} />
                  )}
                </div>

                {/* Change welcome text base on user status */}
                {isLoggedIn ? (
                  <p className="d-flex align-items-end mt-2">
                    Welcome, &nbsp;&nbsp;
                    <a
                      className="click-scroll d-flex align-items-end"
                      onClick={() => {
                        const userRole = sessionStorage.getItem("user_role");
                        const destination = (userRole === "uni-admin" || userRole === "sys-admin") ? "/admin" : "/studentprofile";
                        navigate(destination);

                        if(destination === "/studentprofile") {
                          window.location.reload();
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <strong>
                        {sessionStorage.getItem("firstname")}{" "}
                        {sessionStorage.getItem("lastname")}
                      </strong>
                      <i
                        className="bi bi-gear-wide-connected d-flex align-items-end"
                        style={{
                          fontSize: "24px",
                          marginLeft: "10px",
                        }}
                      ></i>
                    </a>
                  </p>
                ) : (
                  <p className="d-flex align-items-end mt-2">
                    Don't have an account?&nbsp;
                    <a
                      className="click-scroll d-flex align-items-end"
                      onClick={() => {
                        openRegisterPopup();
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <strong>
                        <u>Register</u>
                      </strong>
                    </a>
                    {isRegisterPopupOpen && (
                      <RegisterPopup content="" onClose={closeAllPopups} />
                    )}
                  </p>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {/* To render forget password popup */}
      {isForgotPasswordPopupOpen && (
        <ForgotPasswordPopup content="" onClose={closeAllPopups} />
      )}
    </>
  );
};

export default Header;
