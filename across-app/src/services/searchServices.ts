// Define the interface for the request payload
interface SearchItem {
    content?: string;
    university?: string;
    degree_program?: string;
    module_code?: number;
    ects?: number;
    degree_level?: string;
    module_name?: string;
    type?: string;
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
    degree_level: string[];
    module_type: string[];
    university: string[];
    ects: number;
  }

interface SortParams {
    sortby: string[];
    orderby: string[];
  }
 
// Function to send a GET request to the search API
export async function searchServices(term: string, offset: number, filter: FilterParams, sort:SortParams): Promise<SearchResponse> {
    
    // Base URL including the term
    let url = `http://localhost:8000/api/v1/module/search?term=${encodeURIComponent(term)}`;

    // Add offset to the URL if it's not 0
    if (offset !== 0) {
        url += `&offset=${offset}`;
    }

    // Add filters to the URL
    if (filter.degree_level.length > 0) {
        url += `&degree_level=${encodeURIComponent(filter.degree_level.join(','))}`;
    }
    if (filter.module_type.length > 0) {
        url += `&module_type=${encodeURIComponent(filter.module_type.join(','))}`;
    }
    if (filter.university.length > 0) {
        url += `&university=${encodeURIComponent(filter.university.join(','))}`;
    }
    if (filter.ects) {
        url += `&ects=${filter.ects}`;
    }

    // Add filters to the URL
    if (sort.sortby.length > 0) {
        url += `&sortby=${encodeURIComponent(sort.sortby.join(','))}`;
    }
    if (sort.orderby.length > 0) {
        url += `&orderby=${encodeURIComponent(sort.orderby.join(','))}`;
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