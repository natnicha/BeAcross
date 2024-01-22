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
                        navigate("/search?query=" + content, { state: { content } })
                      }
                >
                    Search
                </button>
                </div>
        </section>
        </>
    );
};

export default SearchBar;