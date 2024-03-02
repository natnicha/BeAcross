interface PersonalPlanResponse {
    id: string;
    token: string;
  }

// Function to send a POST request to the createPersonal API
export async function postPersonalPlan(module_id: string, semester_id: string): Promise<PersonalPlanResponse> {
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
    
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        // Assuming the API returns JSON that matches the SubmitRecommendedResponse interface
        const data: PersonalPlanResponse = await response.json();
        return data; // Return the response data
    
      } catch (error) {
        console.error("Error submitting Recommended:", error);
        throw error; // Rethrow the error to be handled by the caller
      }
  }