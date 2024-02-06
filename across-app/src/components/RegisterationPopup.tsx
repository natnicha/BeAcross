import React, { useState } from 'react';
import { registerUser } from '../services/authenticationServices';
import LoginPopup from '../components/LoginPopup';
import { usePopups } from '../PopupContext';

type PopupProps = {
  content: string;
  onClose: () => void;
};
const RegisterationPopup: React.FC<PopupProps> = () => {

  // Hook all popup control to PopupContext
  const { openLoginPopup, isLoginPopupOpen, closeAllPopups } = usePopups();
  const [emailToRegister, setEmailToRegister] = useState(''); // State for storing the email address
  const [responseMessage, setResponseMessage] = useState(''); // State for storing response
  const [isSubmitted, setIsSubmitted] = useState(false); // enable/disable button and input
  const [responseStyle, setResponseStyle] = useState({ margin: "15px", color: "green" }); // response text style

  // Handle email input changes
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailToRegister(event.target.value);
  };
  
// Combined submit handler
const handleSubmit = async () => {
  try {
    // Call the registerUser function
    const response = await registerUser(emailToRegister);
    console.log('Registration successful:', response);
        
    if(response.status === 201) {
      setIsSubmitted(true);
      setResponseMessage(response.message);
      setResponseStyle({ margin: "15px", color: "green"}); // Set to green on success
    } else {  
      setResponseMessage(response.message);
      setResponseStyle({ margin: "15px", color: "red" }); // Set to red on failure
    }
  } catch (error) {
      setResponseMessage('Registration failed'); // Update message on catch
      setResponseStyle({ margin: "15px", color: "red" }); // Set to red on error
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
            onClick={closeAllPopups} 
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
            <p style={responseStyle}>{responseMessage}</p>
            <div style={{ marginTop: "20px" }}>
            <p>Already have an account?&nbsp; 
              <a 
                className="click-scroll"
                onClick={() => {
                    openLoginPopup();
                }}
                role="button"
                tabIndex={0}
                >
                <strong><u>LOGIN</u></strong>
                </a>

                {isLoginPopupOpen  && (
                  <LoginPopup content="" onClose={closeAllPopups} />
              )}
            </p>           
            </div>
        </div>
      </div>
    );
  };

export default RegisterationPopup;