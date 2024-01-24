import React, { useEffect, useRef, useState } from "react";
import SearchResult from '../components/SearchResult';
import SearchBar from "../components/SearchBar";
import { Location, useLocation } from "react-router-dom";
import { searchServices } from "../services/searchServices";

//const SearchPage: React.FC = (props) => {
//  const location = useLocation();
//  const query = location.state.content; // extract string from URL
//  const [content, setQuery] = useState("");
//  const [searchResult, setSearchResult] = useState<any>(null); // Initialize to null or a default value
//
//  return (
//    <div className ="SearchPage">
//        {/*Search title*/}
//        <section className="projects section-padding pb-0">
//          <div className="container">
//            <div className="row">
//              <div className="col-12 text-left mb-4" style={{ display: 'flex', alignItems: 'center' }}>
//                <h2 style={{ display: "inline" }}>Browsing within...&nbsp;&nbsp;</h2> 
//                <h2 style={{ display: "inline", color: "#1e5af5" , marginRight: "auto"}}>{query}</h2>
//                <p style={{ margin: 0 }}>Number of results found: 64</p>
//              </div>
//            </div>
//            {/*Searchbar*/}
//            <SearchBar content={query} setQuery={setQuery} />
//          </div>
//        </section>
//
//        <div className="profile-container">
//          
//          {/*Filter*/}
//          <section className="tm-sidebar" id="tm-sidebar">
//            
//          </section>  
//
//          {/*Search Result*/}
//          <SearchResult />     
//        </div>
//
//        
//    </div>
//  );
//};

interface SearchPageProps {
  location: Location;  // Define other props as needed
}

interface SearchPageState {
  query: string;
  searchResult: any; // Define the correct type for your search result
}

class SearchPage extends React.Component<SearchPageProps, SearchPageState> {
  constructor(props: SearchPageProps) {
    super(props);
    this.state = {
      query: "",
      searchResult: null
    };
    this.setQuery = this.setQuery.bind(this);
  }

  async componentDidMount() {
    try {
      // Extract 'query' parameter from URL search string
      const searchParams = new URLSearchParams(this.props.location.search);
      const query = searchParams.get('query') || ""; // 'data' in your case

      const result = await searchServices(query, 20);
      this.setState({ searchResult: result, query });
    } catch (error) {
      console.error('Error fetching search results:', error);
      // Handle error appropriately
    }
  }

  setQuery(newQuery: string) {
    this.setState({ query: newQuery });
  }

  render() {
    const { query, searchResult } = this.state;

    return (
          <div className ="SearchPage">
              {/*Search title*/}
              <section className="projects section-padding pb-0">
                <div className="container">
                  <div className="row">
                    <div className="col-12 text-left mb-4" style={{ display: 'flex', alignItems: 'center' }}>
                      <h2 style={{ display: "inline" }}>Browsing within...&nbsp;&nbsp;</h2> 
                      <h2 style={{ display: "inline", color: "#1e5af5" , marginRight: "auto"}}>{query}</h2>
                      <p style={{ margin: 0 }}>Number of results found: 64</p>
                    </div>
                  </div>
                  {/*Searchbar*/}
                  <SearchBar content={query} setContent={this.setQuery} />
                </div>
              </section>
              <div className="profile-container">
                
                {/*Filter*/}
                <section className="tm-sidebar" id="tm-sidebar">
                  
                </section>  
                {/*Search Result*/}
                <SearchResult />     
              </div>
              
          </div>
    );
  }
}

function useRouteInfo() {
  const location = useLocation();
  // Add other hooks or logic if needed
  return { location };
}

const SearchPageWrapper = () => {
  const { location } = useRouteInfo();

  // Pass location and any other necessary props to SearchPage
  return <SearchPage location={location} />;
};

export default SearchPageWrapper;
