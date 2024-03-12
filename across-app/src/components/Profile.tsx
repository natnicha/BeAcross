import { useEffect, useState } from "react";
import Popup from "../components/ChangepasswordPopup";

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  registration_number: string; //for the student
  course_of_study: string;
  semester: string;
}

export default function Profile() {
  const [editMode, setEditMode] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage the popup visibility
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
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

  const handleEditToggle = () => {
    setEditMode(!editMode);
    setEditedProfile(userProfile);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (editedProfile) {
      setEditedProfile({ ...editedProfile, [name]: value });
    }
  };

  const handleSave = () => {
    // Call API to save changes
    if (userProfile && editedProfile) {
      fetch(`http://localhost:8000/api/v1/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(editedProfile),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update profile");
          }
          // Update userProfile state with the edited profile
          setUserProfile(editedProfile);
          setEditMode(false); // Exit edit mode after saving
        })
        .catch((error) => {
          console.error("Error updating profile:", error);
        });
    }
  };

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
                name="first_name"
                value={
                  editMode ? editedProfile?.first_name : userProfile?.first_name
                }
                onChange={handleInputChange}
                disabled={!editMode}
              />
            </div>

            <div className="personal-info-section">
              <p>Last Name:</p>
              <input
                type="text"
                className="lastname full-width-input"
                name="last_name"
                value={
                  editMode ? editedProfile?.last_name : userProfile?.last_name
                }
                onChange={handleInputChange}
                disabled={!editMode}
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
                  name="registration_number"
                  value={
                    editMode
                      ? editedProfile?.registration_number
                      : userProfile?.registration_number
                  }
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </div>
              <div className="personal-info-section">
                <p>Course of Study:</p>
                <input
                  type="text"
                  className="courseofstudy full-width-input"
                  name="course_of_study"
                  value={
                    editMode
                      ? editedProfile?.course_of_study
                      : userProfile?.course_of_study
                  }
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </div>
              <div className="personal-info-section">
                <p>Study Semester:</p>
                <input
                  type="text"
                  className="semester full-width-input"
                  name="semester"
                  value={
                    editMode ? editedProfile?.semester : userProfile?.semester
                  }
                  onChange={handleInputChange}
                  disabled={!editMode}
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
            {editMode ? (
              <button
                className="custom-btn-green-number btn custom-link"
                onClick={handleSave}
              >
                Save
              </button>
            ) : (
              <button
                className="custom-btn-number btn custom-link"
                onClick={handleEditToggle}
              >
                Edit
              </button>
            )}{" "}
          </div>
        </div>
      )}
    </div>
  );
}
