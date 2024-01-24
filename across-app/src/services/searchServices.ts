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
    total_results?: number;
    items?: SearchItem[];
}
 
// Function to send a GET request to the search API
export async function searchServices(term: string, offset: string): Promise<SearchResponse> {
    const url: string = 'http://localhost:8000/api/v1/module/search?term=' + term + offset;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Parse the JSON response
        const responseData: any = await response.json();

        if (response.ok) {
            return { 
                total_results: responseData.data.total_results, 
                items: responseData.data.items,
            };
        } else if (responseData.detail && responseData.detail.message === "no module found") {
            return { message: responseData.detail.message };
        } else {
            throw new Error(`Error: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching data from search:', error);
        throw error;
    }
};