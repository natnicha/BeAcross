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

export interface updateSuggestionResponse {
  status: number;
  message: string;
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

// Function to send a POST request to the approvedSuggestion by admin API
export async function postTransferable(module_a: string, module_b: string): Promise<updateSuggestionResponse> {
  const url: string = `http://localhost:8000/api/v1/module/transferability`;
  // Adjust the payload to match the backend expectation
  const payload = { module_a, module_b }; // Use module_id as per your successful Postman test

  const token = sessionStorage.getItem("jwtToken") || '';
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.status == 200) {
      return {
        status: response.status,
        message:
          "Transferable Modules are updated.",
      };
    } else {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error("Error updating transferable modules:", error);
    throw error;
  }
}

// Function to send a DELETE request to the UnapprovedSuggestion by admin API
export async function deleteTransferable(module_a: string, module_b: string): Promise<updateSuggestionResponse> {
  const url: string = `http://localhost:8000/api/v1/module/transferability`;
  // Adjust the payload to match the backend expectation
  const payload = { module_a, module_b }; // Use module_id as per your successful Postman test

  const token = sessionStorage.getItem("jwtToken") || '';
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    // Parse the JSON response
    const responseData: any = await response.json();
    
    if (response.status == 200) {
      return {
        status: response.status,
        message:
          "Transferable Modules are updated.",
      };
    } else if (response.status == 400) {
      return { status: response.status, message: responseData.detail.message };
    } else {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error("Error updating transferable modules:", error);
    throw error;
  }
}