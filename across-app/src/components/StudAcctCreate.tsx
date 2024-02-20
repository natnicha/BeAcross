import { useState } from "react";
import { registerUser } from "../services/authenticationServices";

export default function StudAcctCreate() {
  const handleSubmit = async () => {
    try {
      // Call the registerUser function
      const response = await registerUser(emailToRegister);
      console.log("Registration successful:", response);

      if (response.status === 201) {
        setIsSubmitted(true);
        setResponseMessage(response.message);
        setResponseStyle({ margin: "15px", color: "green" }); // Set to green on success
      } else {
        setResponseMessage(response.message);
        setResponseStyle({ margin: "15px", color: "red" }); // Set to red on failure
      }
    } catch (error) {
      setResponseMessage("Registration failed"); // Update message on catch
      setResponseStyle({ margin: "15px", color: "red" }); // Set to red on error
      console.error("Registration failed:", error);
    }
  };
  const [emailToRegister, setEmailToRegister] = useState(""); // State for storing the email address
  const [responseMessage, setResponseMessage] = useState(""); // State for storing response
  const [isSubmitted, setIsSubmitted] = useState(false); // enable/disable button and input
  const [responseStyle, setResponseStyle] = useState({
    margin: "15px",
    color: "green",
  }); // response text style

  // Handle email input changes
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailToRegister(event.target.value);
  };

  return (
    <div className="about-thumb bg-white shadow-lg">
      <div className="personal-info-section">
        <p>Student university Email:</p>
        <input
          type="email"
          className="registerEmail full-width-input"
          placeholder="firstname.lastname@university.xx"
          value={emailToRegister}
          onChange={handleEmailChange}
          disabled={isSubmitted}
        />
        <button
          className="custom-btn btn custom-link mt-4"
          onClick={handleSubmit}
          disabled={isSubmitted}
        >
          Submit
        </button>
        <p style={responseStyle}>{responseMessage}</p>
      </div>
    </div>
  );
}
