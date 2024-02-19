interface getCommentRequest {
  moduleID: string;
  token: string;
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
