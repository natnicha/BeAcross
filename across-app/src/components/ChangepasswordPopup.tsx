import React from 'react';

type PopupProps = {
    content: string;
    onClose: () => void;
  };

  const ChangePasswordPopup: React.FC<PopupProps> = ({ content, onClose }) => {
    return (
      <div className="popup-backdrop">
        <div className="popup-content">
            <div className="title-popup mb-4">
            <h5 style={{ color: "white"}}>Change your password</h5>
            </div>
            <span>Enter the new password below to change your password.</span>
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
                <p>Currernt Password:</p>
                <input
                    type="text"
                    className="currentpassword full-width-input"
                    placeholder="********"
                />
            </div>
            <div className="personal-info-section">
                <p>New Password:</p>
                <input
                    type="text"
                    className="newpassword full-width-input"
                    placeholder="********"
                />
                <p style={{ fontSize: "12px" }}>Your password must: 
                    <br></br>Minimum of 8 characters.
                    <br></br>At least 1 uppercase.
                    <br></br>At least 1 number.
                    <br></br>At least 1 special character.</p>
            </div>
            <div className="personal-info-section">
                <p>Confirm New Password:</p>
                <input
                    type="text"
                    className="confirmnewpassword full-width-input"
                    placeholder="********"
                />
            </div>
          <button className="custom-btn-green btn custom-link mt-4"
            onClick={onClose}>Change Password</button>
        </div>
      </div>
    );
  };

export default ChangePasswordPopup;