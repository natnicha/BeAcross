export interface SuggestionItem {
    content?: string;
    university?: string;
    degree_program?: string;
    module_code?: number;
    ects?: string;
    degree_level?: string;
    module_name?: string;
    type?: string;
    no_of_recommend: number;
    no_of_suggested_modules?: number;
    module_id: string;
    is_recommended: boolean;
} 

export interface getSuggestionResponse {
    message?: string;
    requested_module_id?: number;
    total_suggested_module_items?: number;
    suggested_module_items?: SuggestionItem[];
  }

// Function to send a GET request to the getComment API
export async function getSuggestion(module_id: string): Promise<getSuggestionResponse> {

const token = sessionStorage.getItem("jwtToken") || '';  //get jwt token

    const url: string = `http://localhost:8000/api/v1/module/${module_id}/suggested`;
  
    try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });
    
        const responseData: any = await response.json();
    
        if (response.ok) {
          return {
            requested_module_id: responseData.data.requested_module_id,
            total_suggested_module_items: responseData.data.total_suggested_module_items,
            suggested_module_items: responseData.data.suggested_module_items,
          };
        } else if (responseData.detail && responseData.detail.message === "No suggested module found") {
          return { message: responseData.detail.message };
        } else {
          throw new Error(`Error: ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching data from suggestion:', error);
        throw error;
      }
  }