interface PersonalPlanResponse {
    status: number;
    message: string;
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