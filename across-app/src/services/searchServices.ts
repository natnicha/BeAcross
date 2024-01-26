// Define the interface for the request payload
interface SearchItem {
    content?: string;
    university?: string;
    degree_program?: string;
    module_code?: number;
    ects?: number;
    degree_level?: string;
    module_name?: string;
    no_of_recommend?: number;
    no_of_suggested_modules?: number;
} 

export interface SearchResponse {
    message?: string;
    total_items?: number;
    total_results?: number;
    items?: SearchItem[];
}

interface FilterParams {
    degreeLevels: string[];
    moduleTypes: string[];
    universities: string[];
    ectsCredits: number;
  }
 
// Function to send a GET request to the search API
export async function searchServices(term: string, offset: number, filter: FilterParams): Promise<SearchResponse> {
    
    // Base URL including the term
    let url = `http://localhost:8000/api/v1/module/search?term=${encodeURIComponent(term)}`;

    // Add offset to the URL if it's not 0
    if (offset !== 0) {
        url += `&offset=${offset}`;
    }

    // Add filters to the URL
    if (filter.degreeLevels.length > 0) {
        url += `&degree_level=${encodeURIComponent(filter.degreeLevels.join(','))}`;
    }
    if (filter.moduleTypes.length > 0) {
        url += `&module_type=${encodeURIComponent(filter.moduleTypes.join(','))}`;
    }
    if (filter.universities.length > 0) {
        url += `&universitie=${encodeURIComponent(filter.universities.join(','))}`;
    }
    if (filter.ectsCredits > 0) {
        url += `&ects=${filter.ectsCredits}`;
    }
    
    try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
    
        const responseData: any = await response.json();
    
        if (response.ok) {
          return {
            total_items: responseData.data.total_items,
            total_results: responseData.data.total_results,
            items: responseData.data.items,
          };
        } else if (responseData.detail && responseData.detail.message === "No module found") {
          return { message: responseData.detail.message };
        } else {
          throw new Error(`Error: ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching data from search:', error);
        throw error;
      }
};