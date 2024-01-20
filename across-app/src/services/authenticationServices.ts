// Define the interface for the request payload
interface RegisterRequest {
    email: string;
  }

interface LoginRequest {
    email: string;
    password: string;
  }
    
// Function to send a POST request to the register API
export async function registerUser(email: string): Promise<any> {
    const url: string = 'http://localhost:8000/api/v1/auth/register';
    const payload: RegisterRequest = { email };

    try {
        const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
        });

        // Parse the JSON response
        const responseData: any = await response.json();

        if (response.ok) {
        return "The registration email has been successfully sent to your email!";
        } else if (response.status == 400) {
        return responseData.detail.message;
        } else {
        throw new Error(`Error: ${response.status}`);
        }
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

// Function to send a POST request to the Login API
export async function LoginUser(email: string, password: string): Promise<any> {
    const url: string = 'http://localhost:8000/api/v1/auth/login';
    const payload: LoginRequest = { email, password };

    try {
        const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
        });

        // Parse the JSON response
        const responseData: any = await response.json();

        if (response.ok) {
        return "Login successfully.";
        } else if (response.status == 400) {
        return responseData.detail.message;
        } else {
        throw new Error(`Error: ${response.status}`);
        }
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};
