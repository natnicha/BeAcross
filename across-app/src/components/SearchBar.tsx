import React, { useState, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
    content: string;
    setContent: (value: string) => void;
    onSearch?: () => Promise<void> | void;
  }

const SearchBar: React.FC<SearchBarProps> = ({ content, setContent, onSearch }) => {
    
    const navigate = useNavigate();
    const [showAdvanceSearch, setAdvanceSearch] = useState(false); // State to manage visibility of the advance search panel
    const [selectedValue, setSelectedValue] = useState('AND');
    const [errorMessage, setErrorMessage] = useState(''); // New state for the error message

    const AdvanceSearchClick = () => {
        setAdvanceSearch(!showAdvanceSearch); // Toggle the visibility of the advance search panel
    };

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedValue(event.target.value);
    };

    const handleSearch = async () => {
        if (!content.trim()) {
            // If content is empty or only contains whitespace
            setErrorMessage('Please enter a search term first.');
            return; // Exit the function early without searching
        }
        setErrorMessage(''); // Clear any previous error message
        try {
            if (onSearch) {
                await onSearch();
            }
            navigate("/search?query=" + encodeURIComponent(content));
        } catch (error) {
            console.error('Error during search:', error);
            setErrorMessage('An error occurred during the search. Please try again.');
        }
      };

    // Function to handle Enter key press
    const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>): Promise<void> => {
        if (event.key === 'Enter') {
        await handleSearch();
        }
    };
    
    return (
       <>
       {/*Searchbar*/}
        <section className="searchbar">
            <div className="searchbarContent">
                <div className="searchbarRow">
                    <i className="bi bi-search"></i>
                    <input
                        type="text"
                        className="searchInput"
                        placeholder="Search module here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={handleKeyDown} // Add onKeyDown event listener
                    />&nbsp;&nbsp;
                <button
                    className="custom-btn btn custom-link"
                    onClick={handleSearch}
                    >
                    Search
                </button>
                </div>
                {errorMessage && <div style={{ color: 'red', marginTop: '10px', marginLeft: '30px' }}>{errorMessage}</div>}
                    <div className="advancedSearchRow">
                        <a
                            className="click-scroll d-flex align-items-end"
                            onClick={(e) => {
                                e.preventDefault();
                                AdvanceSearchClick();
                            }}
                            role="button"
                            tabIndex={0}
                            >
                            <strong><u>Advance Search</u></strong>
                            &nbsp;<i className="bi bi-caret-right-fill"></i>
                        </a>
                        {showAdvanceSearch && (
                        <>
                            <div className="advanchsearchpanel">
                                <div className="advancesearch">
                                    <select
                                        name="logicalOperators"
                                        id="logicalOperators"
                                        value={selectedValue}
                                        onChange={handleChange}
                                    >
                                        <option value="AND">AND</option>
                                        <option value="OR">OR</option>
                                        <option value="NOT">NOT</option>
                                    </select>
                                    &nbsp;
                                    <input
                                        type="text"
                                        className="searchInput"
                                        placeholder="Condition 1"
                                        value={""}
                                    />
                                    &nbsp;&nbsp;<strong>in</strong>&nbsp;&nbsp;
                                    <select
                                        name="metaData"
                                        id="metaData"
                                        value={selectedValue}
                                        onChange={handleChange}
                                    >
                                        <option value="module_name">Module Name</option>
                                        <option value="degree_program">Degree Program</option>
                                        <option value="degree_level">Degree Level</option>
                                        <option value="content">Content</option>
                                        <option value="ects">ECTS</option>
                                        <option value="university">University</option>
                                        <option value="module_type">Module Type</option>
                                    </select> 
                                    <div style={{ paddingLeft: '35px'}}></div>
                                    <select 
                                        name="logicalOperators"
                                        id="logicalOperators"
                                        value={selectedValue}
                                        onChange={handleChange}
                                    >
                                        <option value="AND">AND</option>
                                        <option value="OR">OR</option>
                                        <option value="NOT">NOT</option>
                                    </select>
                                    &nbsp;
                                    <input
                                        type="text"
                                        className="searchInput"
                                        placeholder="Condition 2"
                                        value={""}
                                    />
                                    &nbsp;&nbsp;<strong>in</strong>&nbsp;&nbsp;
                                    <select
                                        name="metaData"
                                        id="metaData"
                                        value={selectedValue}
                                        onChange={handleChange}
                                    >
                                        <option value="module_name">Module Name</option>
                                        <option value="degree_program">Degree Program</option>
                                        <option value="degree_level">Degree Level</option>
                                        <option value="content">Content</option>
                                        <option value="ects">ECTS</option>
                                        <option value="university">University</option>
                                        <option value="module_type">Module Type</option>
                                    </select> 
                                </div>  

                                <div className="advancesearch">
                                    <select
                                        name="logicalOperators"
                                        id="logicalOperators"
                                        value={selectedValue}
                                        onChange={handleChange}
                                    >
                                        <option value="AND">AND</option>
                                        <option value="OR">OR</option>
                                        <option value="NOT">NOT</option>
                                    </select>
                                    &nbsp;
                                    <input
                                        type="text"
                                        className="searchInput"
                                        placeholder="Condition 3"
                                        value={""}
                                    />
                                    &nbsp;&nbsp;<strong>in</strong>&nbsp;&nbsp;
                                    <select
                                        name="metaData"
                                        id="metaData"
                                        value={selectedValue}
                                        onChange={handleChange}
                                    >
                                        <option value="module_name">Module Name</option>
                                        <option value="degree_program">Degree Program</option>
                                        <option value="degree_level">Degree Level</option>
                                        <option value="content">Content</option>
                                        <option value="ects">ECTS</option>
                                        <option value="university">University</option>
                                        <option value="module_type">Module Type</option>
                                    </select>
                                    <div style={{ paddingLeft: '35px'}}></div>
                                    <select 
                                        name="logicalOperators"
                                        id="logicalOperators"
                                        value={selectedValue}
                                        onChange={handleChange}
                                    >
                                        <option value="AND">AND</option>
                                        <option value="OR">OR</option>
                                        <option value="NOT">NOT</option>
                                    </select>
                                    &nbsp;
                                    <input
                                        type="text"
                                        className="searchInput"
                                        placeholder="Condition 4"
                                        value={""}
                                    />
                                    &nbsp;&nbsp;<strong>in</strong>&nbsp;&nbsp;
                                    <select
                                        name="metaData"
                                        id="metaData"
                                        value={selectedValue}
                                        onChange={handleChange}
                                    >
                                        <option value="module_name">Module Name</option>
                                        <option value="degree_program">Degree Program</option>
                                        <option value="degree_level">Degree Level</option>
                                        <option value="content">Content</option>
                                        <option value="ects">ECTS</option>
                                        <option value="university">University</option>
                                        <option value="module_type">Module Type</option>
                                    </select> 
                                </div>
                            </div>
                            &nbsp;&nbsp;
                            <button
                                className="custom-btn btn custom-link"
                                onClick={handleSearch}
                                >
                                Advance Search
                            </button>
                        </> 
                                          
                    )}
                    </div>
            </div>
        </section>
        </>
    );
};

export default SearchBar;