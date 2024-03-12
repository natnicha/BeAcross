import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

//searchBG
import acrossBG from "../images/across-bg.png";

//thumbnail images
import physicsImage from "../images/projects/natural-science.png";
import computerScienceImage from "../images/projects/computer-science.png";
import mathematicsImage from "../images/projects/mathematics.png";
import economicsImage from "../images/projects/economics.png";
import mechanicalEngineeringImage from "../images/projects/mechanical-engineering.png";
import humanityImage from "../images/projects/humanity.png";
import historicalImage from "../images/projects/electrical-enginerring.png";
import MusicAndArtImage from "../images/projects/music-and-art.png";
import SearchBar from "../components/SearchBar";

const HomePage: React.FC = () => {
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  
  const handleCourseClick = (courseName: string) => {
    try {
      let queryParts: string[] = []; // Define outside to have broader scope
  
      switch (courseName) {
        case "Physics":
          queryParts = [`("degree_program":${courseName})`];
          break;
        case "Computer Science":
          queryParts = [`("degree_program":${courseName})`];
          break;
        case "Mathematic":
          queryParts = [`("degree_program":${courseName})`];
          break;
        case "Economic":
          queryParts = [`("degree_program":${courseName})`];
          break;
        case "Engineer":
          queryParts = [`("degree_program":${courseName})`];
          break;
        case "Human":
          queryParts = [`("degree_program":${courseName})`];
          break;
        case "History":
          queryParts = [`("degree_program":${courseName})`];
          break;
        case "Media Art":
          queryParts = [`("degree_program":${courseName})`];
          break;
        default:
          console.log("Course not handled:", courseName);
          return; // Exit function if courseName does not match any case
      }
  
      // Assuming queryParts is meant to be a string for URI component
      const queryString = encodeURIComponent(queryParts.join('')); // Join parts if needed
      window.location.href = window.location.origin + "/search?query=" + queryString + "&isAdvance=true";
    } catch (error) {
      console.error('Error during search:', error);
    }
  };
  
  return (
    <>
    <img src={acrossBG} alt="Background" />
      {/*Searchbar*/}
      <SearchBar content={content} setContent={setContent} />
      <div className="tooltipButton">
        <div className="tooltipIcon">
          <i className="bi bi-lightbulb-fill"></i>
          <span className="tooltipText">
            You can add searches condition by using "AND", "OR", "NOT" e.g.
            database AND introduction NOT design
          </span>
        </div>
      </div>

      {/*Course Categories*/}
      <section className="projects section-padding pb-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 col-12 text-left mb-4">
              <h2 style={{ color: "#1e5af5" }}>Course Categories</h2>
            </div>

            {/*Physics*/}
            <div className="col-lg-3 col-12">
              <div className="projects-thumb projects-thumb-small" onClick={() => handleCourseClick('Physics')}>
                  <img
                    src={physicsImage}
                    className="img-fluid projects-image"
                    alt="Physics"
                  />
                  <div className="projects-info">
                    <div className="projects-title-wrap">
                      <h4 className="projects-title">Physics</h4>
                    </div>

                    <div className="projects-btn-wrap mt-4">
                      <span className="custom-btn btn">
                        <i className="bi-arrow-right"></i>
                      </span>
                    </div>
                  </div>
              </div>
            </div>
            {/*computer-science*/}
            <div className="col-lg-3 col-12">
              <div className="projects-thumb projects-thumb-small" onClick={() => handleCourseClick('Computer Science')}>
                  <img
                    src={computerScienceImage}
                    className="img-fluid projects-image"
                    alt="Computer Science"
                  />
                  <div className="projects-info">
                    <div className="projects-title-wrap">
                      <h4 className="projects-title">
                        Computer <br /> Science
                      </h4>
                    </div>

                    <div className="projects-btn-wrap mt-4">
                      <span className="custom-btn btn">
                        <i className="bi-arrow-right"></i>
                      </span>
                    </div>
                  </div>
              </div>
            </div>
            {/*Mathematics*/}
            <div className="col-lg-3 col-12">
              <div className="projects-thumb projects-thumb-small" onClick={() => handleCourseClick('Mathematic')}>
                  <img
                    src={mathematicsImage}
                    className="img-fluid projects-image"
                    alt="Mathematics"
                  />
                  <div className="projects-info">
                    <div className="projects-title-wrap">
                      <h4 className="projects-title">Mathematics</h4>
                    </div>

                    <div className="projects-btn-wrap mt-4">
                      <span className="custom-btn btn">
                        <i className="bi-arrow-right"></i>
                      </span>
                    </div>
                  </div>
              </div>
            </div>
            {/*Economics*/}
            <div className="col-lg-3 col-12">
              <div className="projects-thumb projects-thumb-small" onClick={() => handleCourseClick('Economic')}>
                  <img
                    src={economicsImage}
                    className="img-fluid projects-image"
                    alt="Economics"
                  />
                  <div className="projects-info">
                    <div className="projects-title-wrap">
                      <h4 className="projects-title">Economics</h4>
                    </div>

                    <div className="projects-btn-wrap mt-4">
                      <span className="custom-btn btn">
                        <i className="bi-arrow-right"></i>
                      </span>
                    </div>
                  </div>
              </div>
            </div>
            {/*Engineering*/}
            <div className="col-lg-3 col-12">
              <div className="projects-thumb projects-thumb-small" onClick={() => handleCourseClick('Engineer')}>
                  <img
                    src={mechanicalEngineeringImage}
                    className="img-fluid projects-image"
                    alt="Engineering"
                  />
                  <div className="projects-info">
                    <div className="projects-title-wrap">
                      <h4 className="projects-title">Engineering</h4>
                    </div>

                    <div className="projects-btn-wrap mt-4">
                      <span className="custom-btn btn">
                        <i className="bi-arrow-right"></i>
                      </span>
                    </div>
                  </div>
              </div>
            </div>
            {/*Humanity*/}
            <div className="col-lg-3 col-12">
              <div className="projects-thumb projects-thumb-small" onClick={() => handleCourseClick('Human')}>
                  <img
                    src={humanityImage}
                    className="img-fluid projects-image"
                    alt="Humanity"
                  />
                  <div className="projects-info">
                    <div className="projects-title-wrap">
                      <h4 className="projects-title">Humanity</h4>
                    </div>

                    <div className="projects-btn-wrap mt-4">
                      <span className="custom-btn btn">
                        <i className="bi-arrow-right"></i>
                      </span>
                    </div>
                  </div>
              </div>
            </div>
            {/*Historical*/}
            <div className="col-lg-3 col-12">
              <div className="projects-thumb projects-thumb-small" onClick={() => handleCourseClick('History')}>
                  <img
                    src={historicalImage}
                    className="img-fluid projects-image"
                    alt="Historical"
                  />
                  <div className="projects-info">
                    <div className="projects-title-wrap">
                      <h4 className="projects-title">Historical</h4>
                    </div>

                    <div className="projects-btn-wrap mt-4">
                      <span className="custom-btn btn">
                        <i className="bi-arrow-right"></i>
                      </span>
                    </div>
                  </div>
              </div>
            </div>
            {/*Media Art*/}
            <div className="col-lg-3 col-12">
              <div className="projects-thumb projects-thumb-small" onClick={() => handleCourseClick('Media Art')}>
                  <img
                    src={MusicAndArtImage}
                    className="img-fluid projects-image"
                    alt="Media Art"
                  />
                  <div className="projects-info">
                    <div className="projects-title-wrap">
                      <h4 className="projects-title">Media Art</h4>
                    </div>

                    <div className="projects-btn-wrap mt-4">
                      <span className="custom-btn btn">
                        <i className="bi-arrow-right"></i>
                      </span>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
