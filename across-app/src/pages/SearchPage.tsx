import React, { } from "react";
import SearchResult from '../components/SearchResult';
import SearchBar from "../components/SearchBar";
import { Location, useLocation } from "react-router-dom";
import { SearchResponse, searchServices } from "../services/searchServices";
import Pagination from '../components/Pagination';

interface SearchPageProps {
  location: Location;  // Define other props as needed
}

interface SearchPageState {
  query: string;
  searchResult: SearchResponse;
  currentPage: number; 
  totalPages: number;  
}

interface ParentState {
  currentPage: number;
}

class SearchPage extends React.Component<SearchPageProps, SearchPageState> {
    
  constructor(props: SearchPageProps) {
    super(props);
    this.state = {
      query: new URLSearchParams(this.props.location.search).get('query') || "",
      searchResult: {},
      currentPage: 1, 
      totalPages: 10, 
    };
    this.setQuery = this.setQuery.bind(this);
  }

  async componentDidMount() {
    this.performSearch();
    this.calculateTotalPages();
  }

  async componentDidUpdate(prevProps: SearchPageProps, prevState: SearchPageState) {
    // Recalculate total pages if total results change
    if (prevState.searchResult.total_results !== this.state.searchResult.total_results) {
      this.calculateTotalPages();
    }
  }

  calculateTotalPages = () => {
    const itemsPerPage = 20;
    let totalPages = 0;

    if (this.state.searchResult && this.state.searchResult.total_results) {
        totalPages = Math.ceil(this.state.searchResult.total_results / itemsPerPage);
    }

    this.setState({ totalPages });
}

  async performSearch() {
    try {
      let offset = (this.state.currentPage - 1) * 20; // Calculate offset based on current page
      const result = await searchServices(this.state.query, offset);
      this.setState({ searchResult: result });
      // Set the search results and reset the current page to 1
      this.setState({ searchResult: result, currentPage: 1 });
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  }

  setQuery(newQuery: string) {
    this.setState({ query: newQuery });
  }

  handlePageChange = (newPage: number) => {
    this.setState({ currentPage: newPage }, () => {
        this.performSearch(); // Call performSearch after setting the new page
    });
};

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
                      <p>Show 
                        <span style={{ color: "#1e5af5"}}><strong> {this.state.searchResult.total_items} </strong></span>
                        of 
                        <span style={{ color: "#1e5af5"}}><strong> {this.state.searchResult.total_results} </strong></span>
                      Search results founded.</p>
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
                <div>
                <Pagination
                  currentPage={this.state.currentPage}
                  totalPages={this.state.totalPages}
                  onPageChange={this.handlePageChange}
                />
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
