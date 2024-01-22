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
      
      {/*Filter*/}
      <section></section>

      {/*Search list*/}
      <section>
      <div className="search-header">
        <div className="search-column"><strong>Image</strong></div>
        <div className="search-column"><strong>Details</strong></div>
      </div>
      
      <div className="search-table">
        <div className="search-row">
            <div className="search-column">
                image
            </div>
            <div className="search-column">
                <strong>Place Name</strong><br></br>
                Description or Address<br></br>
                Rating: ★★★★☆
            </div>
        </div>
      </div>

      </section>

    </>
  );
};

export default SearchPage;
