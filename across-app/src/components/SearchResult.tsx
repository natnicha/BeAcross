import React from "react";

interface SearchResultProps {
    university?: string;
    degree_program?: string;
    module_code?: number;
    ects?: number;
    degree_level?: string;
    module_name?: string;
    no_of_recommend?: number;
    no_of_suggested_modules?: number;
}

const SearchResult: React.FC<SearchResultProps> = (props) => {

    // Destructure the props
    const { university, module_code, ects, degree_level, module_name, no_of_recommend, no_of_suggested_modules } = props;
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
                            {module_code}
                        </div>
                        <div className="search-column" id ="moduleName">
                            {module_name}
                        </div>
                        <div className="search-column" id ="ect">
                            {ects}
                        </div>
                        <div className="search-column" id ="degree">
                            {degree_level}
                        </div>
                        <div className="search-column" id ="university">
                            {university}
                        </div>
                        
                        <div className="search-feature-control-btn">
                            <button className="custom-btn-yellow-number btn custom-link">                                       
                            <i className="bi bi-hand-thumbs-up"></i> Recommened <span className="number-count">{no_of_recommend}</span>
                            </button>
                            <button className="custom-btn-number btn custom-link">                                       
                            <i className="bi bi-stars"></i> Suggestion Modules  <span className="number-count">{no_of_suggested_modules}</span>
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