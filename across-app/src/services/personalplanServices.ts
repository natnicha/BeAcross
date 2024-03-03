export interface PostPersonalPlanResponse {
    status: number;
    message: string;
  }

export interface PersonalPlanResponse {
    data: Data;
}

export interface Data {
    total_items: number;
    items: Item[];
}

export interface Item {
    module_id: string;
    personal_plan: PersonalPlan[];
}

export interface PersonalPlan {
    personal_plan_id: string;
    semester_id: string;
    semester_name: string;
    is_added: boolean;
}

export interface ModuleItem {
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

    // enrichment fields (i.e. field that did not orignally populated from backend)
    semesterId?: string;
    personalPlanId?: string;
} 

export interface ModuleResponse {
    message?: string;
    total_items?: number;
    total_results?: number;
    items?: ModuleItem[];
}

interface DeleteResponse {
  status: number;
  message: string;
}

// Function to send a POST request to the createPersonal API
export async function postPersonalPlan(module_id: string, semester_id: string): Promise<PostPersonalPlanResponse> {
    const url: string = `http://localhost:8000/api/v1/personal-plan`;
    // Adjust the payload to match the backend expectation
    const payload = { module_id, semester_id }; // Use module_id as per your successful Postman test
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
    
        // Parse the JSON response
        const responseData: any = await response.json();
    
        if (response.ok) {
          return {
            status: response.status,
            message:
              "The Module has been add to your Personal Plan!",
          };
        } else if (response.status == 409) {
          return { status: response.status, message: responseData.detail.message };
        } else {
          throw new Error(`Error: ${response.status}`);
        }
      } catch (error) {
        console.error("Error registering user:", error);
        throw error;
      }
}

// Function to send a GET request to the getPersonal API
export async function getPersonalPlan(): Promise<PersonalPlanResponse> {
    const url: string = `http://localhost:8000/api/v1/personal-plan?`;
  
    const token = sessionStorage.getItem("jwtToken") || '';

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
        // Assuming responseData directly matches the structure of getCommentResponse
        return responseData;
      } else {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching data from search:', error);
      throw error;
    }
  }

// Function to send a GET request to the Module API
export async function getModuleDetail(module_id: string): Promise<ModuleItem> {
    const url: string = `http://localhost:8000/api/v1/module/${module_id}`;
  
    const token = sessionStorage.getItem("jwtToken") || '';
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
        // Assuming responseData directly matches the structure of getCommentResponse
        return responseData.data[0];
      } else {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching data from search:', error);
      throw error;
    }
  }


// Function to send a DELETE request to the delete personal plan API
export async function deleteRecommended(personal_plan_id: string): Promise<DeleteResponse> {
  const url: string = `http://localhost:8000/api/v1/personal-plan/${personal_plan_id}`;
  const payload = { personal_plan_id };

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

    if (response.status == 204) {
      return {
        status: response.status,
        message:
          "The module was deleted from your personal plan.",
      };
    } else {
      throw new Error(`Error: ${response.status}`);
    }

  } catch (error) {
    console.error("Error deleting module:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
}