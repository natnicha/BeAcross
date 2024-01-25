import React, { useState } from 'react';
import ModuleDetailPopup from '../components/ModuleDetailPopup';
import { SearchResponse } from "../services/searchServices";

// Define the Item type based on your data structure
interface Item {
    content?: string;
    university?: string;
    degree_program?: string;
    module_code?: number;
    ects?: number;
    degree_level?: string;
    module_name?: string;
}

interface SearchResultProps {
    searchResult: SearchResponse;
}

const SearchResult: React.FC<SearchResultProps> = (props) => {
    
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);

    const handleRowClick = (item: Item) => {
        setSelectedItem(item);
    };
    
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

                    {/*Display No Item*/}
                    {!props.searchResult.items &&
                        <h2 style={{ textAlign: "center", color: "red" , marginTop: "15px"}}> {props.searchResult.message} </h2>
                    }

                    {/*Display Items*/}
                    {props.searchResult.items && props.searchResult.items.map((item, index) => (
                        <div className="search-table" key={index}>
                            <div className="search-row" onClick={() => handleRowClick(item)}>
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
                                    <button className="custom-btn-gray-number btn custom-link" style={{ cursor: "default"}} disabled={true}>                                       
                                        Compare
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Conditionally render ModuleDetailPopup */}
            {selectedItem && <ModuleDetailPopup selectedItem={selectedItem} />}
                </div>
            </div>
        </section>
        </>
    );
};

export default SearchResult;