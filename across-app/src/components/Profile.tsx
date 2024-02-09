import { useState } from "react";
import Popup from "../components/ChangepasswordPopup";

export default function Profile() {
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage the popup visibility

  // Function to open/close the popup
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <div className="about-thumb bg-white shadow-lg">
      <h5 className="mb-3" style={{ color: "#1e5af5" }}>
        Personal Information
      </h5>
      <div className="personal-info-container">
        <div className="personal-info-section">
          <p>First Name:</p>
          <input
            type="text"
            className="firstname full-width-input"
            placeholder=""
          />
        </div>

        <div className="personal-info-section">
          <p>Last Name:</p>
          <input
            type="text"
            className="lastname full-width-input"
            placeholder=""
          />
        </div>
      </div>
      <div className="personal-info-section">
        <p>Email:</p>
        <input
          type="text"
          className="email full-width-input"
          placeholder="firstname.lastname@tu-chemnitz.de"
          disabled
        />
      </div>
      <div className="personal-info-section">
        <p>University Affiliation:</p>
        <input
          type="text"
          className="uniInfo full-width-input"
          placeholder="Chemnitz University of Technology"
          disabled
        />
      </div>
      <hr />
      <div className="personal-info-container">
        <div className="personal-info-section">
          <p>Password:</p>
          <input
            type="text"
            className="password full-width-input"
            placeholder="********"
            disabled
          />
        </div>
        <button onClick={openPopup} className="custom-btn btn custom-link mt-4">
          Change Password
        </button>

        {isPopupOpen && <Popup content="" onClose={closePopup} />}
        <button className="custom-btn-green btn custom-link mt-4">Save</button>
      </div>
    </div>
  );
}
