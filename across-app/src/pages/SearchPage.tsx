import React from "react";
import { useLocation } from "react-router-dom";

const SearchPage: React.FC = (props) => {
  const location = useLocation();
  const result = location.state.content;

  return (
    <>
        {/*Search title*/}
        <section className="projects section-padding pb-0">
          <div className="container">
            <div className="row">
              <div className="col-12 text-left mb-4" style={{ display: 'flex', alignItems: 'center' }}>
                <h2 style={{ display: "inline" }}>Browsing within...&nbsp;&nbsp;</h2> 
                <h2 style={{ display: "inline", color: "#1e5af5" , marginRight: "auto"}}>{result}</h2>

                <p style={{ margin: 0 }}>Number of results found: 64</p>
              </div>
            </div>
          </div>
        </section>

        <div className="profile-container">
        {/*Filter*/}
        <section className="tm-sidebar" id="tm-sidebar">
          <nav className="tm-nav" id="tm-nav">            
              <ul className="tm-nav-items">
                  <li className="tm-nav-item" >
                      <a href="#home" className="tm-nav-link">&nbsp;&nbsp;
                      <i className="bi bi-house-door"></i> Home
                      </a>
                  </li>
                  <li className="tm-nav-item" >
                      <a href="#mypersonalplan" className="tm-nav-link">&nbsp;&nbsp;
                      <i className="bi bi-bookmark"></i> My Personal Plan
                      </a>
                  </li>
                  <li className="tm-nav-item" >
                      <a href="#myexamresult" className="tm-nav-link">&nbsp;&nbsp;
                      <i className="bi bi-file-earmark-text"></i> My Exam Results
                      </a>
                  </li>
              </ul>
              <ul>
                  <li className="tm-nav-item" >
                      <a href="#profile" className="tm-nav-link">&nbsp;&nbsp;
                      <i className="bi bi-file-person"></i>    Profile
                      </a>
                  </li>
              </ul>   
          </nav>
        </section> 
      
        {/*Search list*/}
        <section className="tm-content" style={{ margin: "0px"}} id="profileinformation">
          <div className="nav nav-tabs flex-row align-items-baseline" style={{ paddingLeft: "5%", width: "118%", paddingBottom: "2%"}} >
              <div className="about-thumb bg-white shadow-lg">
                <div className="search-header">
                  <div className="search-column"><strong>Module Code</strong></div>
                  <div className="search-column"><strong>Module Name</strong></div>
                  <div className="search-column"><strong>ECT Credits</strong></div>
                  <div className="search-column"><strong>Degree Level</strong></div>
                  <div className="search-column"><strong>University</strong></div>
                </div>

                <div className="search-table">
                  {/*SR start here*/}
                  <div className="search-row">
                      <div className="search-column" id="moduleCode">
                        563090
                      </div>
                      <div className="search-column" id ="moduleName">
                        Databases and object orientation
                      </div>
                      <div className="search-column" id ="ect">
                        5.0
                      </div>
                      <div className="search-column" id ="degree">
                        Master
                      </div>
                      <div className="search-column" id ="university">
                      Chemnitz University of Technology
                      </div>
                    
                      <div className="search-feature-control-btn">
                        <button className="custom-btn-yellow-number btn custom-link">                                       
                          <i className="bi bi-hand-thumbs-up"></i> Recommened <span className="number-count">81</span>
                        </button>
                        <button className="custom-btn-number btn custom-link">                                       
                        <i className="bi bi-stars"></i> Suggestion Modules  <span className="number-count">81</span>
                        </button>
                        <button className="custom-btn-green-number btn custom-link">                                       
                        Compare
                        </button>
                      </div>  
                    </div> 
                    
                                
                </div>
              </div>
            </div>
      </section>
      </div>
    </>
  );
};

export default SearchPage;
