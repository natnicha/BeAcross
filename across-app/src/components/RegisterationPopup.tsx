import React, { useState, useEffect, useRef } from 'react';
import { registerUser } from '../services/authenticationServices';

type PopupProps = {
    content: string;
    onClose: () => void;
  };

  const RegisterationPopup: React.FC<PopupProps> = ({ content, onClose }) => {

  const [emailToRegister, setEmailToRegister] = useState(''); // State for storing the email address
  const [responseMessage, setResponseMessage] = useState(''); // State for storing response
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle email input changes
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailToRegister(event.target.value);
  };
  
// Combined submit handler
const handleSubmit = async () => {
  try {
    // Call the registerUser function
    const response = await registerUser(emailToRegister);
    setResponseMessage(response);
    console.log('Registration successful:', response);
    if (response.ok) {
      setIsSubmitted(true);
    }
  } catch (error) {
    console.error('Registration failed:', error);
  }
};

    return (
      <div className="popup-backdrop">
        <div className="popup-content">
            <div className="title-popup mb-4">
            <h5 style={{ color: "white"}}>Register your University Account</h5>
            </div>
            <h6>Let's get your account set up</h6>
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
                    value={emailToRegister}
                    onChange={handleEmailChange}
                    disabled={isSubmitted}
                />
            </div>
            
          <button className="custom-btn btn custom-link mt-4"
            onClick={handleSubmit} disabled={isSubmitted}>Submit</button>
            <p style={{ marginTop: "15px", color: "green"}} >{responseMessage}</p>
            <div style={{ marginTop: "20px" }}>
            <p>Already have an account?&nbsp; 
            <a className="click-scroll" href="#register"><strong><u>LOGIN</u></strong></a></p>
            </div>
        </div>
      </div>
    );
  };

export default RegisterationPopup;