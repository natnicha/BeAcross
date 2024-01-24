import React, { useRef, useState } from "react";
import SearchResult from '../components/SearchResult';
import SearchBar from "../components/SearchBar";
import { useLocation } from "react-router-dom";

const SearchPage: React.FC = (props) => {
  const location = useLocation();
  const result = location.state.content;
  const [content, setContent] = useState("");

  return (
    <div className ="SearchPage">
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
            {/*Searchbar*/}
            <SearchBar content={content} setContent={setContent} />

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

          {/*Search Result*/}
        <SearchResult />     
        </div>

        
    </div>
  );
};

export default SearchPage;
