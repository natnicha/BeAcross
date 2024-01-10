import React from 'react';

const Header: React.FC = () => {
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
                                <a className="custom-btn btn custom-link" href="#login">Login</a>
                            </div>
                            <p className="d-flex align-items-center mt-2">
                                Don't have an account?&nbsp; 
                                <a className="click-scroll" href="#register"><strong><u>Register</u></strong></a>
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