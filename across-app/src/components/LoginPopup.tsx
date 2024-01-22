import React, { useState, useEffect, useRef } from 'react';
import { loginUser } from '../services/authenticationServices';

type PopupProps = {
    content: string;
    onClose: () => void;
  };

  const LoginPopup: React.FC<PopupProps> = ({ content, onClose }) => {

  const [emailToLogin, setEmailToLogin] = useState(''); // State for storing the email address
  const [passwordToLogin, setPasswordToLogin] = useState(''); // State for storing the password
  const [responseMessage, setResponseMessage] = useState(''); // State for storing response

  // Handle email input changes
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailToLogin(event.target.value);
  };

  // Handle password input changes
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordToLogin(event.target.value);
  };
  
   // Combined login handler
   const handleLogin = async () => {
    try {
      // Call the registerUser function
      const response = await loginUser(emailToLogin, passwordToLogin);
      setResponseMessage(response);
      console.log('Login successful:', response);
      onClose();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

    return (
      <div className="popup-backdrop">
        <div className="popup-content">
            <div className="title-popup mb-4">
            <h5 style={{ color: "white"}}>Login to your University account</h5>
            </div>
            <h6>Login to your account</h6>
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
                    type="text"
                    className="loginEmail full-width-input"
                    placeholder="firstname.lastname@university.xx"
                    value={emailToLogin}
                    onChange={handleEmailChange}
                />
            </div>
            <div className="personal-info-section">
                <p>Password:</p>
                <input
                    type="text"
                    className="loginPassword full-width-input"
                    placeholder="********"
                    value={passwordToLogin}
                    onChange={handlePasswordChange}
                />  
            </div>
            
            <p><a className="click-scroll" href="#forgotpassword"><strong><u>Forgot your password?</u></strong></a></p>
            
            <button className="custom-btn btn custom-link mt-4"
            onClick={handleLogin}>LOGIN</button>
            <p>{responseMessage}</p>

            <div style={{ marginTop: "20px" }}>
            <p>Don't have an account?&nbsp; 
            <a className="click-scroll" href="#register"><strong><u>Register</u></strong></a></p>
            </div>
        </div>
      </div>
    );
  };

export default LoginPopup;