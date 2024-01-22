import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

//searchBG
import acrossBG from "../images/across-bg.png";

//thumbnail images
import naturalScienceImage from "../images/projects/natural-science.png";
import computerScienceImage from "../images/projects/computer-science.png";
import mathematicsImage from "../images/projects/mathematics.png";
import economicsImage from "../images/projects/economics.png";
import mechanicalEngineeringImage from "../images/projects/mechanical-engineering.png";
import humanityImage from "../images/projects/humanity.png";
import electricalEnginerringImage from "../images/projects/electrical-enginerring.png";
import MusicAndArtImage from "../images/projects/music-and-art.png";
import SearchBar from "../components/SearchBar";

const HomePage: React.FC = () => {
  const [content, setContent] = useState("");

  return (
    <>
    <img src={acrossBG} alt="Background" />
      {/*Searchbar*/}
      <SearchBar content={content} setContent={setContent} />
      <div className="tooltipButton">
        <i className="bi bi-lightbulb-fill"></i>
        <span className="tooltipText">
            You can add searches condition by using "AND", "OR", "NOT" e.g.
            database AND introduction NOT design
        </span>
      </div>

      {/*Course Categories*/}
      <section className="projects section-padding pb-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 col-12 text-left mb-4">
              <h2 style={{ color: "#1e5af5" }}>Course Categories</h2>
            </div>

            {/*Natural Science*/}
            <div className="col-lg-3 col-12">
              <div className="projects-thumb projects-thumb-small">
                <a href="#">
                  <img
                    src={naturalScienceImage}
                    className="img-fluid projects-image"
                    alt="Natural Science"
                  />
                  <div className="projects-info">
                    <div className="projects-title-wrap">
                      <h4 className="projects-title">Natural Science</h4>
                    </div>

                    <div className="projects-btn-wrap mt-4">
                      <span className="custom-btn btn">
                        <i className="bi-arrow-right"></i>
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
            {/*computer-science*/}
            <div className="col-lg-3 col-12">
              <div className="projects-thumb projects-thumb-small">
                <a href="#">
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
                </a>
              </div>
            </div>
            {/*Mathematics*/}
            <div className="col-lg-3 col-12">
              <div className="projects-thumb projects-thumb-small">
                <a href="#">
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
                </a>
              </div>
            </div>
            {/*Economics*/}
            <div className="col-lg-3 col-12">
              <div className="projects-thumb projects-thumb-small">
                <a href="#">
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
                </a>
              </div>
            </div>
            {/*Mechanical Engineering*/}
            <div className="col-lg-3 col-12">
              <div className="projects-thumb projects-thumb-small">
                <a href="#">
                  <img
                    src={mechanicalEngineeringImage}
                    className="img-fluid projects-image"
                    alt="Mechanical Engineering"
                  />
                  <div className="projects-info">
                    <div className="projects-title-wrap">
                      <h4 className="projects-title">Mechanical Engineering</h4>
                    </div>

                    <div className="projects-btn-wrap mt-4">
                      <span className="custom-btn btn">
                        <i className="bi-arrow-right"></i>
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
            {/*Humanity*/}
            <div className="col-lg-3 col-12">
              <div className="projects-thumb projects-thumb-small">
                <a href="#">
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
                </a>
              </div>
            </div>
            {/*Electrical Enginerring*/}
            <div className="col-lg-3 col-12">
              <div className="projects-thumb projects-thumb-small">
                <a href="#">
                  <img
                    src={electricalEnginerringImage}
                    className="img-fluid projects-image"
                    alt="Electrical Enginerring"
                  />
                  <div className="projects-info">
                    <div className="projects-title-wrap">
                      <h4 className="projects-title">Electrical Enginerring</h4>
                    </div>

                    <div className="projects-btn-wrap mt-4">
                      <span className="custom-btn btn">
                        <i className="bi-arrow-right"></i>
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
            {/*Music And Art*/}
            <div className="col-lg-3 col-12">
              <div className="projects-thumb projects-thumb-small">
                <a href="#">
                  <img
                    src={MusicAndArtImage}
                    className="img-fluid projects-image"
                    alt="Music And Art"
                  />
                  <div className="projects-info">
                    <div className="projects-title-wrap">
                      <h4 className="projects-title">Music And Art</h4>
                    </div>

                    <div className="projects-btn-wrap mt-4">
                      <span className="custom-btn btn">
                        <i className="bi-arrow-right"></i>
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
