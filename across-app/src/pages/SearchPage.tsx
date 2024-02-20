import React from 'react';
import SearchResult from '../components/SearchResult';
import SearchBar from "../components/SearchBar";
import { Location, useLocation, useNavigate } from "react-router-dom";
import { SearchResponse, searchServices } from "../services/searchServices";
import Pagination from '../components/Pagination';


interface SearchPageProps {
  location: Location;
  navigate: (to: string | { pathname: string; search: string }, options?: { replace?: boolean; state?: any }) => void;
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
   
  private rangeSliderRef = React.createRef<HTMLInputElement>();

  handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    this.setState(prevState => ({
        filters: {
            ...prevState.filters,
            ects: value !== "0" ? value : null, // Adjusting to store as string; use null for "0"
        }
    }), () => {
    });
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
      this.performSearch(true);
    });
  };

  async componentDidMount() {
    this.parseUrlParams();
    this.performSearch(true); // Assuming true initializes the search with current state
}

async componentDidUpdate(prevProps: SearchPageProps, prevState: SearchPageState) {
    // Check if URL changed
    if (this.props.location.search !== prevProps.location.search) {
        this.parseUrlParams();
    }
}

parseUrlParams = () => {
  const searchParams = new URLSearchParams(this.props.location.search);
  
  // Parsing sorting parameters
  const currentSortField = searchParams.get('sortby') || 'module_name';
  const currentSortOrder = searchParams.get('orderby') || 'asc';
  
  // Parsing filter parameters
  const degree_level = searchParams.getAll('degree_level');
  const module_type = searchParams.getAll('module_type');
  const university = searchParams.getAll('university');
  
  // For ects
  const ects = searchParams.get('ects');
  
  // Parsing pagination
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  
  // Setting the state with parsed values
  this.setState({
      currentSortField,
      currentSortOrder,
      filters: {
          degree_level: degree_level,
          module_type: module_type,
          university: university,
          ects: ects || null,
      },
      currentPage,
  }, () => {
      this.performSearch(true);
  });
}

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

      // Conditionally add 'ects' if it's not null
      if (this.state.filters.ects) {
        filters.ects = this.state.filters.ects;
    }

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
      this.updateUrlParams();  
      this.performSearch(); // Call performSearch after setting the new page
    });
};

// Function to update filter state
handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value, checked, type } = event.target;
  
  // Define newSelection as either a string array or a number
  let newSelection: string[] | number;

  if (type === 'checkbox') {
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
  this.updateUrlParams();
  this.handleSearchBarSearch();
};

updateUrlParams = () => {
  const { filters, currentSortField, currentSortOrder, currentPage, query } = this.state;
  const searchParams = new URLSearchParams();

  // Add query
  if(query) searchParams.set('query', query);

  // Add filters to the URL parameters
  filters.degree_level.forEach(level => searchParams.append('degree_level', level));
  filters.module_type.forEach(type => searchParams.append('module_type', type));
  filters.university.forEach(uni => searchParams.append('university', uni));
  if(filters.ects) searchParams.set('ects', filters.ects);

  // Add sorting to the URL parameters
  if(currentSortField) searchParams.set('sortby', currentSortField);
  if(currentSortOrder) searchParams.set('orderby', currentSortOrder);

  // Add pagination to the URL parameters
  searchParams.set('sortby', currentSortField);
  searchParams.set('orderby', currentSortOrder);
  searchParams.set('page', currentPage.toString());

  // Use navigate to update the URL without reloading the page
  this.props.navigate(`?${searchParams.toString()}`, { replace: true });
};

handleSortClick = (sortField: string) => {
  this.setState(prevState => ({
    currentSortField: sortField,
    currentSortOrder: prevState.currentSortField === sortField && prevState.currentSortOrder === 'asc' ? 'desc' : 'asc'
  }), () => {
    this.updateUrlParams(); // Update URL with new sorting parameters
    this.performSearch();
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
                                checked={this.state.filters.degree_level.includes('bachelor')}
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
                                checked={this.state.filters.degree_level.includes('master')}
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
                                checked={this.state.filters.degree_level.includes('doctoral')}
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
                                  checked={this.state.filters.module_type.includes('erasmus')}
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
                                  checked={this.state.filters.module_type.includes('obiligitory')}
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
                                  checked={this.state.filters.module_type.includes('elective')}
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
                          value={this.state.filters.ects ?? 0}
                          onChange={this.handleSliderChange} 
                      />
                      <span> {this.state.filters.ects !== null ? this.state.filters.ects : "All"} </span>
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
                                  checked={this.state.filters.university.includes('Bialystok University Of Technology')}
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
                                  checked={this.state.filters.university.includes('Technische Universitat Chemnitz')}
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
                                  checked={this.state.filters.university.includes('University of Nova Gorica')}
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
  const navigate = useNavigate();
  const location = useLocation();

  return <SearchPage navigate={navigate} location={location} />;
};

export default SearchPageWrapper;

