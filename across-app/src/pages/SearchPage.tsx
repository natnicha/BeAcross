import React from "react";
import { useLocation } from "react-router-dom";

const SearchPage = () => {
  const location = useLocation();
  const result = location.state.content;

  return (
    <div>
      <h1>Search Page</h1>
      <h3>{result}</h3>
    </div>
  );
};

export default SearchPage;
