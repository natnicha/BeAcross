import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
    content: string;
    setContent: (value: string) => void;
  }

const SearchBar: React.FC<SearchBarProps> = ({ content, setContent }) => {
    
 const navigate = useNavigate();
    
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
                    />&nbsp;&nbsp;
                    <button
                        className="custom-btn btn custom-link"
                        onClick={() =>
                            navigate("/search?query=" + encodeURIComponent(content), { state: { content } })
                        }
                    >
                        Search
                    </button>
                </div>

                <div className="advancedSearchRow">
                    <a
                        className="click-scroll d-flex align-items-end"
                        href="javascript:void(0)"
                        onClick={(e) => {
                            e.preventDefault(); // Prevent default if using href="#"
                        }}
                        role="button"
                        tabIndex={0}
                        >
                        <strong><u>Advance Search</u></strong>
                    </a>
                </div>
            </div>
        </section>
        </>
    );
};

export default SearchBar;