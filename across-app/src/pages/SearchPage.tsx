import React, { useEffect, useRef } from 'react';
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
  sliderValue: number;
}

interface ParentState {
  currentPage: number;
}

class SearchPage extends React.Component<SearchPageProps, SearchPageState> {
    
  private rangeSliderRef = React.createRef<HTMLInputElement>();

  handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ sliderValue: parseInt(event.target.value) });
  };
  
  constructor(props: SearchPageProps) {
    super(props);
    this.state = {
      query: new URLSearchParams(this.props.location.search).get('query') || "",
      searchResult: {},
      currentPage: 1, 
      totalPages: 10, 
      sliderValue: 1,
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
                <section>
                  <div className="filter">
                  <h4 style={{ width: "300px", marginTop: "5px"}}>&nbsp;&nbsp; <i className="bi bi-funnel-fill"></i> Filters with ... </h4>
                      <div className ="filter-item">
                        <h6 style={{ width: "300px", marginLeft: "10px"}}>Degree level:</h6>
                        <div className="checkbox">
                            <label><input type="checkbox" className="pointer-checkbox" /> Bachelor</label>
                        </div>
                        <div className="checkbox">
                            <label><input type="checkbox" className="pointer-checkbox" /> Master</label>
                        </div>
                        <div className="checkbox">
                            <label><input type="checkbox" className="pointer-checkbox" /> Doctoral</label>
                        </div>
                      </div> 

                      <div className ="filter-item">
                        <h6 style={{ width: "300px", marginLeft: "10px"}}>Module type:</h6>
                        <div className="checkbox">
                            <label><input type="checkbox" className="pointer-checkbox" /> Erasmus</label>
                        </div>
                        <div className="checkbox">
                            <label><input type="checkbox" className="pointer-checkbox" /> Obiligitory</label>
                        </div>
                        <div className="checkbox">
                            <label><input type="checkbox" className="pointer-checkbox" /> Elective</label>
                        </div>
                      </div> 

                      <div className ="filter-item">
                      <h6 style={{ width: "300px", marginLeft: "10px"}}>ECTS credits:</h6>
                        <input style={{ marginLeft: "5px"}}
                          type="range" 
                          min="1" 
                          max="15" 
                          step="1" 
                          value={this.state.sliderValue} 
                          onChange={this.handleSliderChange} 
                          ref={this.rangeSliderRef} 
                        />
                        <span> {this.state.sliderValue}</span>
                      </div>
                      
                      <div className ="filter-item">
                      <h6 style={{ width: "300px", marginLeft: "10px"}}>Offer by:</h6>
                        <div className="dropdown">
                          <button className="dropbtn">University... <i className="bi bi-caret-down-fill"></i></button>
                          <div className="dropdown-content">
                              <label><input type="checkbox" className="pointer-checkbox" value="Uni1" /> Bialystok University Of Technology</label>
                              <label><input type="checkbox" className="pointer-checkbox" value="Uni2" /> Technische Universitat Chemnitz</label>
                              <label><input type="checkbox" className="pointer-checkbox" value="Uni3" /> University of Nova Gorica</label>
                          </div>
                        </div>
                      </div>

                      <div className ="filter-item" style={{ borderBottom: "none", marginTop: "20px"}}>
                        <button className="custom-btn-green btn custom-link" style={{ width: "100%"}}>                                       
                        Apply
                        </button>
                      </div>
                  </div>
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
