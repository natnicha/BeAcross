import React, { useState, useEffect, useRef } from 'react';
import RegisterPopup from '../components/RegisterationPopup';
import LoginPopup from '../components/LoginPopup';

const Header: React.FC = () => {

    const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
    const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState(false);

    // Functions to open/close the login popup
    const openLoginPopup = () => setIsLoginPopupOpen(true);
    const closeLoginPopup = () => setIsLoginPopupOpen(false);

    // Functions to open/close the register popup
    const openRegisterPopup = () => setIsRegisterPopupOpen(true);
    const closeRegisterPopup = () => setIsRegisterPopupOpen(false);

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
                <img src="../across-logo.png"></img>
                  <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                      <span className="navbar-toggler-icon"></span>
                  </button>

                  <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <a className="nav-link click-scroll" href="#section_1"><strong>Home</strong></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link click-scroll" href="#section_2"><strong>About</strong></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link click-scroll" href="#section_3"><strong>Policy</strong></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link click-scroll" href="#section_4"><strong>Contact</strong></a>
                        </li>
                        <li className="nav-item">
                            <div className="d-flex align-items-center mt-2">
                                <a 
                                    className="custom-btn btn custom-link"                                  
                                    href="javascript:void(0)"
                                    onClick={(e) => {
                                        e.preventDefault(); // Prevent default if using href="#"
                                        openLoginPopup();
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    >
                                    <strong><u>Login</u></strong>
                                </a>
                                {isLoginPopupOpen  && (
                                        <LoginPopup content="" onClose={closeLoginPopup} />
                                    )}
                            </div>
                            <p className="d-flex align-items-center mt-2">
                                Don't have an account?&nbsp; 
                                <a
                                    className="click-scroll"
                                    href="javascript:void(0)"
                                    onClick={(e) => {
                                        e.preventDefault(); // Prevent default if using href="#"
                                        openRegisterPopup();
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    >
                                    <strong><u>Register</u></strong>
                                </a>

                                {isRegisterPopupOpen  && (
                                        <RegisterPopup content="" onClose={closeRegisterPopup} />
                                    )}
                            </p>
                        </li>
                    </ul>
                  </div>
              </div>
          </nav>
        </>
    );
};

export default Header;