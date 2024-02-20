import React from 'react';
import SearchResult from '../components/SearchResult';
import SearchBar from "../components/SearchBar";
import { Location, useLocation, useNavigate } from "react-router-dom";
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
  sliderValue: number | null; 
  filters: {
    degree_level: string[];
    module_type: string[];
    university: string[];
    ects: string | null;
  };

  currentSortField: string;
  currentSortOrder: string;
}


class SearchPage extends React.Component<SearchPageProps, SearchPageState> {
   
  updateSearchParams = (filters: { [key: string]: string }, sort: string, page: number) => {
    const searchParams = new URLSearchParams();
    const navigate = useNavigate();
    
    // Add filters to searchParams
    Object.entries(filters).forEach(([key, value]) => {
        if (value) searchParams.set(key, value);
    });

    // Add sort and pagination to searchParams
    if (sort) searchParams.set('sort', sort);
    if (page) searchParams.set('page', page.toString());

    navigate({ search: searchParams.toString() });
};

  componentDidMount() {
    this.parseUrlParams();
  }

  componentDidUpdate(prevProps: SearchPageProps, prevState: SearchPageState) {
    if (this.props.location.search !== prevProps.location.search) {
      this.parseUrlParams();
    }
  }

  fetchData = () => {
    const { filters, currentSortField, currentSortOrder, currentPage } = this.state;
  };

  parseUrlParams = () => {
    const searchParams = new URLSearchParams(this.props.location.search);
    const degree_level = searchParams.getAll('degree_level');
    const module_type = searchParams.getAll('module_type');
    const university = searchParams.getAll('university');
    // Assuming 'ects' is a singular value in your URL, not an array
    const ects = searchParams.get('ects');

    const filters = {
        degree_level: degree_level || [],
        module_type: module_type || [],
        university: university || [],
        ects: ects,
    };

    const sort = searchParams.get('sort');
    const page = parseInt(searchParams.get('page') || '1', 10);

    this.setState({
        filters: filters,
        currentSortField: sort || '', // Assuming sort maps to currentSortField
        currentPage: page,
    });

    // Optionally, fetch or sort data based on these parameters
};
  
  
  
  private rangeSliderRef = React.createRef<HTMLInputElement>();
  handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (value === 0) {
      this.setState({ sliderValue: null });
    } else {
      this.setState({ sliderValue: value });
    }
  };
  
  constructor(props: SearchPageProps) {
    super(props);
    this.state = {
      query: new URLSearchParams(this.props.location.search).get('query') || "",
      searchResult: {},
      currentPage: 1, 
      totalPages: 0, 
      sliderValue: null,

      currentSortField: 'module_name',
      currentSortOrder: 'asc',

      filters: {
        degree_level: [],
        module_type: [],
        university: [],
        ects: '',
      },
    };
    this.setQuery = this.setQuery.bind(this);
    this.handleSearchBarSearch = this.handleSearchBarSearch.bind(this);
  }

  handleSearchBarSearch = (): void => {
    this.setState({ currentPage: 1 }, () => {
      this.performSearch(true); // Add the true flag if your performSearch method accepts it for new searches
    });
  };

  calculateTotalPages = () => {
    const itemsPerPage = 20;
    let totalPages = 0;

    if (this.state.searchResult && this.state.searchResult.total_results) {
        totalPages = Math.ceil(this.state.searchResult.total_results / itemsPerPage);
    }

    this.setState({ totalPages });
}

   performSearch = async (isNewSearch: boolean = false) => {
    try {
      const offset = (this.state.currentPage - 1) * 20; // Calculate offset based on current page
      const offsetString = offset.toString(); // Convert to String before passing data to BE

      // Constructing the filters object from the state
      const filters = {
        degree_level: this.state.filters.degree_level,
        module_type: this.state.filters.module_type,
        university: this.state.filters.university,
        ects: this.state.sliderValue?.toString() ?? ""
      };

      // Constructing the sorting object from the state
      const sorting = {
        sortby: [this.state.currentSortField],
        orderby: [this.state.currentSortOrder]
      };

      // Including the filters in the searchServices call
      const result = await searchServices(this.state.query, offsetString, filters, sorting);
      
      if (isNewSearch) {
        this.setState({ searchResult: result, currentPage: 1 });
      } else {
        this.setState({ searchResult: result });
      }
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

// Function to update filter state
handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value, checked, type } = event.target;
  
  // Define newSelection as either a string array or a number
  let newSelection: string[] | number;

  if (type === 'checkbox') {
    // TypeScript needs assurance that the name is a valid key of filters
    const filterName = name as keyof typeof this.state.filters;

    // Ensure that the filter is an array before spreading it
    newSelection = Array.isArray(this.state.filters[filterName])
      ? [...this.state.filters[filterName] as string[]]
      : [];

    if (checked) {
      if (!newSelection.includes(value)) {
        newSelection.push(value);
      }
    } else {
      newSelection = newSelection.filter(item => item !== value);
    }
  } else if (type === 'range') {
    newSelection = parseInt(value);
  }

  this.setState(prevState => ({
    filters: {
      ...prevState.filters,
      [name]: newSelection
    },
  }));
};

// Function to be called when 'Apply' is clicked
onApplyFilters = () => {
  this.handleSearchBarSearch();
};

// Function to update Sort state
handleSortClick = (sortField: string) => {
  this.setState(prevState => {
    // Toggle sort order if the same field is clicked again, else set to 'desc'
    const newOrder = prevState.currentSortField === sortField && prevState.currentSortOrder === 'asc' ? 'desc' : 'asc';

    return {
      currentSortField: sortField,
      currentSortOrder: newOrder
    };
  }, this.performSearch);
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
                  <SearchBar 
                    content={this.state.query} 
                    setContent={this.setQuery} 
                    onSearch={() => this.handleSearchBarSearch()}
                  />
                </div>
              
              {/*Sorting*/}
              <div className="sort-container"> 
                <h6>Sort by:</h6>
                <button
                  className="custom-btn btn custom-link"
                  onClick={() => this.handleSortClick('module_name')}
                 >                                       
                  <i className={`bi ${this.state.currentSortField === 'module_name' && this.state.currentSortOrder === 'desc' ? 'bi-sort-alpha-up' : 'bi-sort-alpha-down'}`}></i> Module Name
                </button>
                <button 
                  className="custom-btn btn custom-link"
                  onClick={() => this.handleSortClick('no_of_suggested_modules')}
                >                                       
                  <i className={`bi ${this.state.currentSortField === 'no_of_suggested_modules' && this.state.currentSortOrder === 'desc' ? 'bi-sort-up' : 'bi-sort-down'}`}></i> Suggestion Modules
                </button>
                <button 
                  className="custom-btn btn custom-link"
                  onClick={() => this.handleSortClick('no_of_recommend')}
                >                                       
                 <i className={`bi ${this.state.currentSortField === 'no_of_recommend' && this.state.currentSortOrder === 'desc' ? 'bi-sort-up' : 'bi-sort-down'}`}></i> Recommended Modules
                </button>
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
                            <label>
                              <input 
                                type="checkbox" 
                                className="pointer-checkbox" 
                                name="degree_level" 
                                value="bachelor" 
                                onChange={this.handleFilterChange}
                              /> 
                               &nbsp;Bachelor
                            </label>
                        </div>
                        <div className="checkbox">
                            <label>
                              <input 
                                type="checkbox" 
                                className="pointer-checkbox" 
                                name="degree_level" 
                                value="master" 
                                onChange={this.handleFilterChange}
                              />
                               &nbsp;Master
                            </label>
                        </div>
                        <div className="checkbox">
                            <label>
                              <input 
                                type="checkbox" 
                                className="pointer-checkbox" 
                                name="degree_level" 
                                value="doctoral" 
                                onChange={this.handleFilterChange}
                              />
                               &nbsp;Doctoral
                            </label>
                        </div>
                      </div> 

                      <div className ="filter-item">
                        <h6 style={{ width: "300px", marginLeft: "10px"}}>Module type:</h6>
                        <div className="checkbox">
                            <label>
                              <input 
                                  type="checkbox" 
                                  className="pointer-checkbox" 
                                  name="module_type" 
                                  value="erasmus" 
                                  onChange={this.handleFilterChange}
                              /> 
                               &nbsp;Erasmus
                            </label>
                        </div>
                        <div className="checkbox">
                            <label>
                              <input 
                                  type="checkbox" 
                                  className="pointer-checkbox" 
                                  name="module_type" 
                                  value="obiligitory" 
                                  onChange={this.handleFilterChange}
                              />  
                               &nbsp;Obiligitory
                            </label>
                        </div>
                        <div className="checkbox">
                            <label>
                              <input 
                                  type="checkbox" 
                                  className="pointer-checkbox" 
                                  name="module_type" 
                                  value="elective" 
                                  onChange={this.handleFilterChange}
                              /> 
                               &nbsp;Elective
                            </label>
                        </div>
                      </div> 

                      <div className ="filter-item">
                      <h6 style={{ width: "300px", marginLeft: "10px"}}>ECTS credits:</h6>
                        <input style={{ marginLeft: "5px"}}
                          type="range" 
                          min="0" 
                          max="20" 
                          step="1" 
                          name="ects"
                          value={this.state.sliderValue ?? 0}  
                          onChange={this.handleSliderChange} 
                          ref={this.rangeSliderRef} 
                        />
                        <span> {this.state.sliderValue !== null && this.state.sliderValue !== 0 ? this.state.sliderValue : ""} </span>
                      </div>
                      
                      <div className ="filter-item">
                      <h6 style={{ width: "300px", marginLeft: "10px"}}>Offer by:</h6>
                        <div className="dropdown">
                          <button className="dropbtn">University... <i className="bi bi-caret-down-fill"></i></button>
                          <div className="dropdown-content">
                              <label>
                                <input 
                                  type="checkbox" 
                                  className="pointer-checkbox" 
                                  name="university" 
                                  value="Bialystok University Of Technology" 
                                  onChange={this.handleFilterChange}
                                /> 
                                &nbsp;Bialystok University Of Technology
                                </label>
                              <label>
                                <input 
                                  type="checkbox" 
                                  className="pointer-checkbox" 
                                  name="university" 
                                  value="Technische Universitat Chemnitz" 
                                  onChange={this.handleFilterChange}
                                />
                                &nbsp;Technische Universitat Chemnitz
                                </label>
                              <label>
                                <input 
                                  type="checkbox" 
                                  className="pointer-checkbox" 
                                  name="university" 
                                  value="University of Nova Gorica" 
                                  onChange={this.handleFilterChange}
                                /> 
                                &nbsp;University of Nova Gorica
                                </label>
                          </div>
                        </div>
                      </div>

                      <div className ="filter-item" style={{ borderBottom: "none", marginTop: "20px"}}>
                        <button 
                        className="custom-btn-green btn custom-link" 
                        style={{ width: "100%"}}
                        onClick={this.onApplyFilters}
                        >                                       
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
