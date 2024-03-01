import { useEffect, useState } from "react";
import Popup from "../components/ChangepasswordPopup";

interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  registration_number: string; //for the student
  course_of_study: string;
  semester: string;
}

export default function Profile() {
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage the popup visibility
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const jwtToken = sessionStorage.getItem("jwtToken");

  // Function to open/close the popup
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  useEffect(() => {
    // Fetch user profile data
    fetch("http://localhost:8000/api/v1/user/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setUserProfile(data))
      .catch((error) => console.error("Error fetching profile:", error));
  }, [jwtToken]);

  return (
    <div className="about-thumb bg-white shadow-lg">
      <h5 className="mb-3" style={{ color: "#1e5af5" }}>
        Personal Information
      </h5>
      {userProfile && (
        <div>
          <div className="personal-info-container">
            <div className="personal-info-section">
              <p>First Name:</p>
              <input
                type="text"
                className="firstname full-width-input"
                placeholder={userProfile?.first_name}
              />
            </div>

            <div className="personal-info-section">
              <p>Last Name:</p>
              <input
                type="text"
                className="lastname full-width-input"
                placeholder={userProfile?.last_name}
              />
            </div>
          </div>
          <div className="personal-info-section">
            <p>Email:</p>
            <input
              type="text"
              className="email full-width-input"
              placeholder={userProfile?.email}
              disabled
            />
          </div>
          {sessionStorage.getItem("user_role") !== "uni-admin" ? (
            <>
              <div className="personal-info-section">
                <p>Registration Number:</p>
                <input
                  type="text"
                  className="registrationnumber full-width-input"
                  placeholder={userProfile?.registration_number}
                  disabled
                />
              </div>
              <div className="personal-info-section">
                <p>Course of Study:</p>
                <input
                  type="text"
                  className="courseofstudy full-width-input"
                  placeholder=""
                />
              </div>
              <div className="personal-info-section">
                <p>Study Semester:</p>
                <input
                  type="text"
                  className="cut"
                  placeholder={userProfile?.semester}
                />
              </div>
            </>
          ) : (
            <div className="personal-info-section">
              <p>University Affiliation:</p>
              <input
                type="text"
                className="uniInfo full-width-input"
                placeholder="Chemnitz University of Technology"
                disabled
              />
            </div>
          )}

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
            <button
              onClick={openPopup}
              className="custom-btn btn custom-link p mt-4"
            >
              Change Password
            </button>

            {isPopupOpen && <Popup content="" onClose={closePopup} />}
            <button className="custom-btn-green btn custom-link mt-4">
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
