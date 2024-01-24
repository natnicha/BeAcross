import React from "react";
import { SearchResponse } from "../services/searchServices";


//const SearchResult: React.FC<SearchResponse> = (props) => {
//    return (
//        <>
//        {/*Search list*/}
//        <section className="tm-content" style={{ margin: "0px"}} id="profileinformation">
//            <div className="nav nav-tabs flex-row align-items-baseline" style={{ paddingLeft: "5%", width: "118%", paddingBottom: "2%"}} >
//                <div className="about-thumb bg-white shadow-lg">
//                    <div className="search-header">
//                    <div className="search-column"><strong>Module Code</strong></div>
//                    <div className="search-column"><strong>Module Name</strong></div>
//                    <div className="search-column"><strong>ECT Credits</strong></div>
//                    <div className="search-column"><strong>Degree Level</strong></div>
//                    <div className="search-column"><strong>University</strong></div>
//                    </div>
//
//                    <div className="search-table">
//                    <div className="search-row">
//                        <div className="search-column" id="moduleCode">
//                            {/* binding the data from props*/}
//                        </div>
//                        <div className="search-column" id ="moduleName">
//                            {/* binding the data from props*/}
//                        </div>
//                        <div className="search-column" id ="ect">
//                            {/* binding the data from props*/}
//                        </div>
//                        <div className="search-column" id ="degree">
//                            {/* binding the data from props*/}
//                        </div>
//                        <div className="search-column" id ="university">
//                            {/* binding the data from props*/}
//                        </div>
//                        
//                        <div className="search-feature-control-btn">
//                            <button className="custom-btn-yellow-number btn custom-link">                                       
//                            <i className="bi bi-hand-thumbs-up"></i> Recommened <span className="number-count">{no_of_recommend}</span>
//                            </button>
//                            <button className="custom-btn-number btn custom-link">                                       
//                            <i className="bi bi-stars"></i> Suggestion Modules  <span className="number-count">{no_of_suggested_modules}</span>
//                            </button>
//                            <button className="custom-btn-green-number btn custom-link">                                       
//                            Compare
//                            </button>
//                        </div>  
//                        </div>                                     
//                    </div>
//
//                    
//                </div>
//                </div>
//        </section>
//        </>
//    );
//};
//

interface SearchResultProps {
    searchResult: SearchResponse;
}

const SearchResult: React.FC<SearchResultProps> = (props) => {
    return (
        <>
        {/*Search list*/}
        <section className="tm-content" style={{ margin: "0px"}} id="profileinformation">
            <div className="nav nav-tabs flex-row align-items-baseline" style={{ paddingLeft: "5%", width: "118%", paddingBottom: "2%"}}>
                <div className="about-thumb bg-white shadow-lg">
                    <div className="search-header">
                        <div className="search-column"><strong>Module Code</strong></div>
                        <div className="search-column"><strong>Module Name</strong></div>
                        <div className="search-column"><strong>ECTS Credits</strong></div>
                        <div className="search-column"><strong>Degree Level</strong></div>
                        <div className="search-column"><strong>University</strong></div>
                    </div>

                    {props.searchResult.items && props.searchResult.items.map((item, index) => (
                        <div className="search-table" key={index}>
                            <div className="search-row">
                                <div className="search-column" id="moduleCode">
                                    {item.module_code}
                                </div>
                                <div className="search-column" id="moduleName">
                                    {item.module_name}
                                </div>
                                <div className="search-column" id="ect">
                                    {item.ects}
                                </div>
                                <div className="search-column" id="degree">
                                    {item.degree_level}
                                </div>
                                <div className="search-column" id="university">
                                    {item.university}
                                </div>
                                
                                <div className="search-feature-control-btn">
                                    <button className="custom-btn-yellow-number btn custom-link">                                       
                                        <i className="bi bi-hand-thumbs-up"></i> Recommended <span className="number-count">{item.no_of_recommend}</span>
                                    </button>
                                    <button className="custom-btn-number btn custom-link">                                       
                                        <i className="bi bi-stars"></i> Suggestion Modules <span className="number-count">{item.no_of_suggested_modules}</span>
                                    </button>
                                    <button className="custom-btn-green-number btn custom-link">                                       
                                        Compare
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                </div>
            </div>
        </section>
        </>
    );
};

export default SearchResult;