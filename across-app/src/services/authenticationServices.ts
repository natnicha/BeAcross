// Define the interface for the request payload
interface RegisterRequest {
  email: string;
}

interface RegisterResponse {
  status: number;
  message: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token?: string;
  message: string;
  firstname: string;
  lastname: string;
  userrole?: string;
}

// Function to send a POST request to the register API
export async function registerUser(email: string): Promise<RegisterResponse> {
  const url: string = "http://localhost:8000/api/v1/auth/register";
  const payload: RegisterRequest = { email };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Parse the JSON response
    const responseData: any = await response.json();

    if (response.ok) {
      return {
        status: response.status,
        message:
          "The registration email has been successfully sent to your email!",
      };
    } else if (response.status == 400) {
      return { status: response.status, message: responseData.detail.message };
    } else {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

// Function to send a POST request to the Login API
export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  const url: string = "http://localhost:8000/api/v1/auth/login";
  const payload: LoginRequest = { email, password };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Parse the JSON response
    const responseData: any = await response.json();

    if (response.ok) {
      // Store data
      sessionStorage.setItem("firstname", responseData.data.user.first_name);
      sessionStorage.setItem("lastname", responseData.data.user.last_name);
      sessionStorage.setItem("userrole", responseData.data.user.user_role);

      sessionStorage.setItem("jwtToken", responseData.data.jwt); // store jwt until the tab closed, access via sessionStorage.getItem('jwtToken');
      return {
        token: responseData.data.jwt,
        message: "Login successfully.",
        firstname: responseData.data.firstname,
        lastname: responseData.data.lastname,
      };
    } else if (response.status == 401) {
      return {
        token: "",
        message: responseData.detail.message,
        firstname: "",
        lastname: "",
      };
    } else {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

// Function to send a POST request to the Forgot password API
export async function forgotPassword(email: string): Promise<RegisterResponse> {
  const url: string = "";
  const payload: RegisterRequest = { email };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Parse the JSON response
    const responseData: any = await response.json();

    if (response.ok) {
      return { status: response.status, message: "" };
    } else if (response.status == 400) {
      return { status: response.status, message: responseData.detail.message };
    } else {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error("Error forgot password:", error);
    throw error;
  }
}
