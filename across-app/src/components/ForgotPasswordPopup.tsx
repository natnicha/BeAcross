import React, { useState, useEffect, useRef } from 'react';
import { forgotPassword } from '../services/authenticationServices';

type PopupProps = {
    content: string;
    onClose: () => void;
  };

  const ForgotPasswordPopup: React.FC<PopupProps> = ({ content, onClose }) => {

  const [emailToForgotPassword, setEmailToForgotPassword] = useState(''); // State for storing the email address
  const [responseMessage, setResponseMessage] = useState(''); // State for storing response
  const [isSubmitted, setIsSubmitted] = useState(false); // enable/disable button and input
  const [responseStyle, setResponseStyle] = useState({ margin: "15px", color: "green" }); // response text style

  // Handle email input changes
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailToForgotPassword(event.target.value);
  };
  
// Combined submit handler
const handleSubmit = async () => {
  try {
    // Call the registerUser function
    const response = await forgotPassword(emailToForgotPassword);
    console.log('Request Forgot password successful:', response);
        
    if(response.status === 201) {
      setIsSubmitted(true);
      setResponseMessage(response.message);
      setResponseStyle({ margin: "15px", color: "green"}); // Set to green on success
    } else {  
      setResponseMessage(response.message);
      setResponseStyle({ margin: "15px", color: "red" }); // Set to red on failure
    }
  } catch (error) {
      setResponseMessage('Request Forgot password failed'); // Update message on catch
      setResponseStyle({ margin: "15px", color: "red" }); // Set to red on error
      console.error('Request Forgot password failed:', error);
  }
};

    return (
      <div className="popup-backdrop">
        <div className="popup-content">
            <div className="title-popup mb-4">
            <h5 style={{ color: "white"}}>Forgot your password?</h5>
            </div>
            <h6>Enter University Email associated with your account</h6>
            &nbsp; 
            <button 
            onClick={onClose} 
            style={{ 
                position: 'absolute', 
                top: '10px', 
                right: '10px', 
                border: 'none', 
                background: 'transparent', 
                cursor: 'pointer' 
            }}
            >
            X
            </button>
            
            <div className="personal-info-section">
                <p>Student university Email:</p>
                <input
                    type="email"
                    className="registerEmail full-width-input"
                    placeholder="firstname.lastname@university.xx"
                    value={emailToForgotPassword}
                    onChange={handleEmailChange}
                    disabled={isSubmitted}
                />
            </div>

            <button className="custom-btn btn custom-link mt-4"
            onClick={handleSubmit} disabled={isSubmitted}>Submit</button>
              <p style={responseStyle}>{responseMessage}</p>
        </div>
      </div>
    );
  };

export default ForgotPasswordPopup;