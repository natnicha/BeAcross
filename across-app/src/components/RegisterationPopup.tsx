import React from 'react';

type PopupProps = {
    content: string;
    onClose: () => void;
  };

  const RegisterationPopup: React.FC<PopupProps> = ({ content, onClose }) => {

    return (
      <div className="popup-backdrop">
        <div className="popup-content">
            <h5 className="mb-3" style={{ color: '#1e5af5' }}>Register your University Account</h5>
            <span>Let's get your account set up</span>
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
                />
            </div>
          <button className="custom-btn btn custom-link mt-4"
            onClick={onClose}>Submit</button>
            <p>Already have an account?&nbsp; 
            <a className="click-scroll" href="#register"><strong><u>LOGIN</u></strong></a></p>
        </div>
      </div>
    );
  };

export default RegisterationPopup;