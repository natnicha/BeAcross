import React, { useState, useEffect, useRef } from 'react';
import { loginUser } from '../services/authenticationServices';
import RegisterPopup from '../components/RegisterationPopup';

type PopupProps = {
    content: string;
    onClose: () => void;
  };

const LoginPopup: React.FC<PopupProps> = ({ content, onClose }) => {

  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState(false); // reister popup
  
  const [emailToLogin, setEmailToLogin] = useState(''); // State for storing the email address
  const [passwordToLogin, setPasswordToLogin] = useState(''); // State for storing the password
  const [responseMessage, setResponseMessage] = useState(''); // State for storing response
  const [responseStyle, setResponseStyle] = useState({ margin: "15px", color: "green" }); // response text style

  const [jwtToken, setJwtToken] = useState(''); // State to store JWT token

  // Functions to open/close the register popup
  const openRegisterPopup = () => setIsRegisterPopupOpen(true);
  const closeRegisterPopup = () => setIsRegisterPopupOpen(false);
 
   // Combined login handler
   const handleLogin = async () => {
    try {
      // Call the registerUser function
      const response = await loginUser(emailToLogin, passwordToLogin);
      console.log('Login successful:', response);
      if (response && response.token) {
        setJwtToken(response.token); // Store the JWT token in the state
        setResponseMessage(response.message);
        setResponseStyle({ margin: "15px", color: "green"}); // Set to green on success
        //onClose();
      } else {
        setResponseMessage(response.message);  
        setResponseStyle({ margin: "15px", color: "red" }); // Set to red on failure
        }
    } catch (error) {
      setResponseMessage('Login failed'); // Update message on catch
      setResponseStyle({ margin: "15px", color: "red" }); // Set to red on error
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
                    onChange={(e) => setEmailToLogin(e.target.value)}
                />
            </div>
            <div className="personal-info-section">
                <p>Password:</p>
                <input
                    type="password"
                    className="loginPassword full-width-input"
                    placeholder="********"
                    value={passwordToLogin}
                    onChange={(e) => setPasswordToLogin(e.target.value)}
                />  
            </div>
            
            <p><a className="click-scroll" href="#forgotpassword"><strong><u>Forgot your password?</u></strong></a></p>
            
            <button className="custom-btn btn custom-link mt-4"
            onClick={handleLogin}>LOGIN</button>
            <p style={responseStyle}>{responseMessage}</p>
            <div style={{ marginTop: "20px" }}>
            <p>Don't have an account?&nbsp; 
              <a 
              className="click-scroll"
              href="javascript:void(0)"
              onClick={(e) => {
                  e.preventDefault(); // Prevent default if using href="#"
                  openRegisterPopup();
              }}
              role="button"
              tabIndex={0}
              >
              <strong><u>Register</u></strong>
              </a>

              {isRegisterPopupOpen  && (
                  <RegisterPopup content="" onClose={closeRegisterPopup} />
              )}
            </p>
            </div>
        </div>
      </div>
    );
  };

export default LoginPopup;