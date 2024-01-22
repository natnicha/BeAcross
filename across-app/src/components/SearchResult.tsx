import React from "react";

const SearchResult: React.FC = () => {
    
    return (
        <>
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
        </>
    );
};

export default SearchResult;