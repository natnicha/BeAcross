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
            
          </section>  

          {/*Search Result*/}
        <SearchResult />     
        </div>

        
    </div>
  );
};

export default SearchPage;
