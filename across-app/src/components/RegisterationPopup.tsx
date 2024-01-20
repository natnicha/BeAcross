import React, { useState, useEffect, useRef } from 'react';
import { registerUser } from '../services/authenticationServices';

type PopupProps = {
    content: string;
    onClose: () => void;
  };

  const RegisterationPopup: React.FC<PopupProps> = ({ content, onClose }) => {

  // State for storing the email address
  const [emailToRegister, setEmailToRegister] = useState('');

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
      // Handle successful registration

      // Call the onClose function or other existing logic
      onClose();
    } catch (error) {
      console.error('Registration failed:', error);
      // Handle errors
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
                    type="text"
                    className="registerEmail full-width-input"
                    placeholder="firstname.lastname@university.xx"
                    value={emailToRegister}
                    onChange={handleEmailChange}
                />
            </div>
            
          <button className="custom-btn btn custom-link mt-4"
            onClick={handleSubmit}>Submit</button>
            <div style={{ marginTop: "20px" }}>
            <p>Already have an account?&nbsp; 
            <a className="click-scroll" href="#register"><strong><u>LOGIN</u></strong></a></p>
            </div>
        </div>
      </div>
    );
  };

export default RegisterationPopup;