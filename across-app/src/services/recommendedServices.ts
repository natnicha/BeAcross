interface RecommendedResponse {
  id: string;
  token: string;
}

// Function to send a POST request to the submit Recommended API
export async function postRecommended(module_id: string, token: string): Promise<RecommendedResponse> {
  const url: string = `http://localhost:8000/api/v1/module/recommend`;
  const payload = { module_id };

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
    const data: RecommendedResponse = await response.json();
    return data; // Return the response data

  } catch (error) {
    console.error("Error submitting Recommended:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

// Function to send a DELETE request to the submit Recommended API
export async function deleteRecommended(module_id: string, token: string): Promise<RecommendedResponse> {
  const url: string = `http://localhost:8000/api/v1/module/${module_id}/recommend`;
  const payload = { module_id };

  try {
    const response = await fetch(url, {
      method: "DELETE",
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
    const data: RecommendedResponse = await response.json();
    return data; // Return the response data

  } catch (error) {
    console.error("Error submitting Recommended:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
}