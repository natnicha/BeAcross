import React, { } from "react";
import SearchResult from '../components/SearchResult';
import SearchBar from "../components/SearchBar";
import { Location, useLocation } from "react-router-dom";
import { SearchResponse, searchServices } from "../services/searchServices";

interface SearchPageProps {
  location: Location;  // Define other props as needed
}

interface SearchPageState {
  query: string;
  searchResult: SearchResponse; // Define the correct type for your search result
}

class SearchPage extends React.Component<SearchPageProps, SearchPageState> {
  constructor(props: SearchPageProps) {
    super(props);
    this.state = {
      query: new URLSearchParams(this.props.location.search).get('query') || "",
      searchResult: {}
    };
    this.setQuery = this.setQuery.bind(this);
  }

  async componentDidMount() {
    this.performSearch();
  }

  async performSearch() {
    try {
      this.setState({ query: this.state.query }, async () => {
        // Perform the search after state is updated
        const result = await searchServices(this.state.query, "");
        this.setState({ searchResult: result });
      });
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  }

  setQuery(newQuery: string) {
    this.setState({ query: newQuery });
  }
  render() {
    return (
          <div className ="SearchPage">
              {/*Search title*/}
              <section className="projects section-padding pb-0">
                <div className="container">
                  <div className="row">
                    <div className="col-12 text-left mb-4" style={{ display: 'flex', alignItems: 'center' }}>
                      <h2 style={{ display: "inline" }}>Browsing within...&nbsp;&nbsp;</h2> 
                      <h2 style={{ display: "inline", color: "#1e5af5" , marginRight: "auto"}}>{this.state.query}</h2>
                      <p>Number of results found: <span style={{ color: "#1e5af5"}}><strong> {this.state.searchResult.total_results} </strong></span></p>
                    </div>
                  </div>
                  {/*Searchbar*/}
                  <SearchBar content={this.state.query} setContent={this.setQuery} onSearch={() => this.performSearch()}/>
                </div>
              </section>
              <div className="profile-container">
                
                {/*Filter*/}
                <section className="tm-sidebar" id="tm-sidebar">
                  
                </section>  
                {/*Search Result*/}
                <SearchResult searchResult={this.state.searchResult}/>     
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
