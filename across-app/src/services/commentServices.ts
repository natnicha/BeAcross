
// Define the interface for the request payload
interface submitCommentRequest {
  id: string;
  token: string;
  message: string;
}

interface submitCommentResponse {
  status: number;
  message: string;
}

export interface getCommentResponse {
  module_id: string;
  total_items: number;
  items: [
    {
      id: string;
      message: string;
      user: string;
      created_at: string;
      updated_at: string;
    }
  ];
}

// Function to send a GET request to the getComment API
export async function getComment(moduleID: string, token: string): Promise<getCommentResponse> {
  const url: string = `http://localhost:8000/api/v1/module/${moduleID}/comment`;

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

// Function to send a POST request to the createComment API
export async function postComment(id: string, token: string, message: string): Promise<submitCommentResponse> {
  const url: string = `http://localhost:8000/api/v1/module/comment`;
  const payload: submitCommentRequest = { id, token, message };

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
          "Successfully submit your feedback!, please refresh page to see your comment.",
      };
    } else if (response.status == 400) {
      return { status: response.status, message: responseData.detail.message };
    } else {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error("Error submit feedback user:", error);
    throw error;
  }
}
