import React, { useState ,useEffect, useRef } from 'react';
import { loginUser } from '../services/authenticationServices';
import RegisterPopup from '../components/RegisterationPopup';
import ForgotPasswordPopup from '../components/ForgotPasswordPopup';
import { useUser } from '../UserContext';
import { usePopups } from '../PopupContext';

type PopupProps = {
    content: string;
    onClose: () => void;
  };

const LoginPopup: React.FC<PopupProps> = () => {

  // Hook all popup control to PopupContext
  const { openRegisterPopup, openForgotPasswordPopup, isForgotPasswordPopupOpen , isRegisterPopupOpen, closeAllPopups } = usePopups();
  const { setIsLoggedIn } = useUser();

  const [emailToLogin, setEmailToLogin] = useState('');
  const [passwordToLogin, setPasswordToLogin] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [responseStyle, setResponseStyle] = useState({ margin: "15px", color: "green" });
  const popupRef = useRef<HTMLDivElement>(null);

  const [jwtToken, setJwtToken] = useState(''); // State to store JWT token
 
   // Combined login handler
   const handleLogin = async () => {
    try {
      // Call the registerUser function
      const response = await loginUser(emailToLogin, passwordToLogin);
      console.log('Login successful:', response);
      
      if (response && response.token) {
        setJwtToken(response.token); // Store the JWT token in the state
        setIsLoggedIn(true); // set user status for shared
        setResponseMessage(response.message);
        setResponseStyle({ margin: "15px", color: "green"}); // Set to green on success
        closeAllPopups(); // after success login, popup will close
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

  // Close the popup if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        closeAllPopups();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeAllPopups]);

    return (
      <div className="popup-backdrop">
        <div ref={popupRef} className="popup-content">
            <div className="title-popup mb-4">
            <h5 style={{ color: "white"}}>Login to your University account</h5>
            </div>
            <h6>Login to your account</h6>
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
            
            <p><a 
              className="click-scroll"
              onClick={() => {
                  openForgotPasswordPopup();
              }}
              role="button"
              tabIndex={0}
              >
              <strong><u>Forgot password?</u></strong>
              </a>

              {isForgotPasswordPopupOpen  && (
                  <ForgotPasswordPopup content="" onClose={closeAllPopups} />
              )}
            </p>
            
            <button className="custom-btn btn custom-link mt-4"
            onClick={handleLogin}>LOGIN</button>
            <p style={responseStyle}>{responseMessage}</p>
            <div style={{ marginTop: "20px" }}>
            <p>Don't have an account?&nbsp; 
              <a 
              className="click-scroll"
              onClick={() => {
                  openRegisterPopup();
              }}
              role="button"
              tabIndex={0}
              >
              <strong><u>Register</u></strong>
              </a>

              {isRegisterPopupOpen  && (
                  <RegisterPopup content="" onClose={closeAllPopups} />
              )}
            </p>
            </div>
        </div>
      </div>
    );
  };

export default LoginPopup;