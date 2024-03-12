import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";

interface UserProfile {
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  registration_number: string; //for the student
  course_of_study: string;
  semester: string;
  university: string;
}

type PopupProps = {
  profileItem: UserProfile;
  onClose: () => void;
};

const ChangePasswordPopup: React.FC<PopupProps> = ({
  profileItem,
  onClose,
}) => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useUser(); // check user status (login)

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profileItem);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");

  const jwtToken = sessionStorage.getItem("jwtToken");

  const handleNewPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmNewPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmNewPassword(event.target.value);
  };

  const validatePassword = () => {
    setEditedProfile({
      ...editedProfile,
      password: newPassword,
    });

    if (editedProfile.password.length < 8) {
      setError("Your password must be at least 8 characters long.");
      return false;
    }
    if (!/[A-Z]/.test(editedProfile.password)) {
      setError("Your password must contain at least one uppercase letter.");
      return false;
    }
    if (!/\d/.test(editedProfile.password)) {
      setError("Your password must contain at least one digit.");
      return false;
    }
    if (!/[^A-Za-z0-9]/.test(editedProfile.password)) {
      setError("Your password must contain at least one special character.");
      return false;
    }
    if (editedProfile.password !== confirmNewPassword) {
      setError("New password and confirm password do not match.");
      return false;
    }
    setError("");
    return true;
  };

  const handleChangePassword = () => {
    if (validatePassword()) {
      // Send a request to change password to the backend
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
            throw new Error("Failed to change password");
          }
          onClose();
          sessionStorage.removeItem("jwtToken");
          sessionStorage.removeItem("user_role");
          setIsLoggedIn(false);
          navigate("/");
        })
        .catch((error) => {
          console.error("Error changing password:", error);
          setError("Failed to change password. Please try again later.");
        });
    }
  };

  return (
    <div className="popup-backdrop">
      <div className="popup-content">
        <div className="title-popup mb-4">
          <h5 style={{ color: "white" }}>Change your password</h5>
        </div>
        <span>Enter the new password below to change your password.</span>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          X
        </button>

        <div className="personal-info-section">
          <p>New Password:</p>
          <input
            type="password"
            className="newpassword full-width-input"
            name="password"
            value={newPassword}
            onChange={handleNewPasswordChange}
          />
          <p style={{ fontSize: "12px" }}>
            Your password must:
            <br />
            Minimum of 8 characters.
            <br />
            At least 1 uppercase.
            <br />
            At least 1 number.
            <br />
            At least 1 special character.
          </p>
        </div>
        <div className="personal-info-section">
          <p>Confirm New Password:</p>
          <input
            type="password"
            className="confirmnewpassword full-width-input"
            value={confirmNewPassword}
            onChange={handleConfirmNewPasswordChange}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button
          className="custom-btn-green btn custom-link mt-4"
          onClick={handleChangePassword}
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordPopup;
