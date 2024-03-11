import React, { useState, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
    content: string;
    setContent: (value: string) => void;
    onSearch?: () => Promise<void> | void;
    condition1?: string;
    condition2?: string;
    condition3?: string;
    condition4?: string;
    field1?: string;
    field2?: string;
    field3?: string;
    field4?: string;
    operator1?: string;
    operator2?: string;
    operator3?: string;
    operator4?: string;
  }


const SearchBar: React.FC<SearchBarProps> = ({ content, setContent, onSearch }) => {
    
    const navigate = useNavigate();
    const [showAdvanceSearch, setAdvanceSearch] = useState(false); // State to manage visibility of the advance search panel
    const [selectedValue, setSelectedValue] = useState('AND');
    const [errorMessage, setErrorMessage] = useState(''); // New state for the error message

    //advanceSearch
    const [condition1, setCondition1] = useState<string>('');
    const [condition2, setCondition2] = useState<string | undefined>('');
    const [condition3, setCondition3] = useState<string | undefined>('');
    const [condition4, setCondition4] = useState<string | undefined>('');
    const [field1, setField1] = useState<string | undefined>('');
    const [field2, setField2] = useState<string | undefined>('');
    const [field3, setField3] = useState<string | undefined>('');
    const [field4, setField4] = useState<string | undefined>('');
    const [operator1, setOperator1] = useState<string>('AND');
    const [operator2, setOperator2] = useState<string>('AND');
    const [operator3, setOperator3] = useState<string>('AND');
    const [operator4, setOperator4] = useState<string>('AND');


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

    const handleAdvanceSearch = async () => {
        if (!condition1.trim()) {
            // If content is empty or only contains whitespace
            setErrorMessage('Please enter a first condition first.');
            return; // Exit the function early without searching
        }
        setErrorMessage(''); // Clear any previous error message
        try {

            // Initialize queryParts with the first part of the query using content
            const queryParts = [`("${field1}":${condition1})`];

            // Append additional conditions with their respective operators and fields
            if (condition2) queryParts.push(`${operator2}("${field2}":${condition2})`);
            if (condition3) queryParts.push(`${operator3}("${field3}":${condition3})`);
            if (condition4) queryParts.push(`${operator4}("${field4}":${condition4})`);

            // Join all parts of the query into a final string
            const finalQuery = queryParts.join('');

            //if (onSearch) {
            //    await onSearch();
            //}
            //navigate("/search?query=" + encodeURIComponent(finalQuery) + "&isAdvance=true");
            window.location.href = window.location.origin + "/search?query=" + encodeURIComponent(finalQuery) + "&isAdvance=true";
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
                        disabled={showAdvanceSearch}
                    />&nbsp;&nbsp;
                <button
                    className="custom-btn btn custom-link"
                    onClick={handleSearch}
                    disabled={showAdvanceSearch}
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
                                    <input style={{ marginLeft: '60px' }}
                                        type="text"
                                        className="AdvanceSearchInput"
                                        placeholder="Condition 1"
                                        value={condition1 || ''}
                                        onChange={(e) => setCondition1(e.target.value)}
                                    />
                                    &nbsp;&nbsp;<strong>in</strong>&nbsp;&nbsp;
                                    <select
                                        name="metaData"
                                        id="metaData"
                                        value={field1}
                                        onChange={(e) => setField1(e.target.value)}
                                    >
                                        <option value="" disabled selected>Select...</option>
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
                                        value={operator2}
                                        onChange={(e) => setOperator2(e.target.value)}
                                    >
                                        <option value="AND">AND</option>
                                        <option value="OR">OR</option>
                                        <option value="NOT">NOT</option>
                                    </select>
                                    &nbsp;
                                    <input
                                        type="text"
                                        className="AdvanceSearchInput"
                                        placeholder="Condition 2"
                                        value={condition2 || ''}
                                        onChange={(e) => setCondition2(e.target.value)}
                                    />
                                    &nbsp;&nbsp;<strong>in</strong>&nbsp;&nbsp;
                                    <select
                                        name="metaData"
                                        id="metaData"
                                        value={field2}
                                        onChange={(e) => setField2(e.target.value)}
                                    >
                                        <option value="" disabled selected>Select...</option>
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
                                        value={operator3}
                                        onChange={(e) => setOperator3(e.target.value)}
                                    >
                                        <option value="AND">AND</option>
                                        <option value="OR">OR</option>
                                        <option value="NOT">NOT</option>
                                    </select>
                                    &nbsp;
                                    <input
                                        type="text"
                                        className="AdvanceSearchInput"
                                        placeholder="Condition 3"
                                        value={condition3 || ''}
                                        onChange={(e) => setCondition3(e.target.value)}
                                    />
                                    &nbsp;&nbsp;<strong>in</strong>&nbsp;&nbsp;
                                    <select
                                        name="metaData"
                                        id="metaData"
                                        value={field3}
                                        onChange={(e) => setField3(e.target.value)}
                                    >
                                        <option value="" disabled selected>Select...</option>
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
                                        value={operator4}
                                        onChange={(e) => setOperator4(e.target.value)}
                                    >
                                        <option value="AND">AND</option>
                                        <option value="OR">OR</option>
                                        <option value="NOT">NOT</option>
                                    </select>
                                    &nbsp;
                                    <input
                                        type="text"
                                        className="AdvanceSearchInput"
                                        placeholder="Condition 4"
                                        value={condition4 || ''}
                                        onChange={(e) => setCondition4(e.target.value)}
                                    />
                                    &nbsp;&nbsp;<strong>in</strong>&nbsp;&nbsp;
                                    <select
                                        name="metaData"
                                        id="metaData"
                                        value={field4}
                                        onChange={(e) => setField4(e.target.value)}
                                    >
                                        <option value="" disabled selected>Select...</option>
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
                                onClick={handleAdvanceSearch}
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