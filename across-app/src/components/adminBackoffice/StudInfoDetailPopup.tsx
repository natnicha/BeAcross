import { on } from "events";
import React, { useState } from "react";

// Define the Item type based on your data structure
interface Item {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  registration_number: string; //for the student
  course_of_study: string;
  semester: string;
}

interface StudInfoDetailPopupProps {
  selectedItem: Item;
  onClose: () => void;
}

const StudInfoDetailPopup: React.FC<StudInfoDetailPopupProps> = ({
  selectedItem,
  onClose,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [updatedStudInfo, setUpdatedStudInfo] = useState<Item>(selectedItem);

  const jwtToken = sessionStorage.getItem("jwtToken");

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedStudInfo((prevStudInfo) => ({
      ...prevStudInfo,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Call API to save changes
    fetch(`http://localhost:8000/api/v1/user/${selectedItem.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(updatedStudInfo),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle success, maybe close the popup or update UI
        console.log("Updated data:", data);
        onClose();
        window.location.reload();
        setEditMode(false);
      })
      .catch((error) => {
        // Handle error
        console.error("Error updating student info:", error);
      });
  };
  return (
    <div className="studInfo-detail">
      <div className="popup-backdrop">
        <div className="popup-content">
          <div className="title-popup mb-2">
            <h5 style={{ color: "white", textAlign: "left" }}>
              &nbsp;&nbsp;&nbsp;Information of "{selectedItem.first_name}{" "}
              {selectedItem.last_name}"
            </h5>
          </div>
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

          <div className="container">
            {/* personal Information */}
            <p>01. Personal Infomation</p>
            <div className="row">
              <div className="col">
                <strong>Name</strong>
                <input
                  type="text"
                  name="first_name"
                  defaultValue={selectedItem.first_name}
                  value={
                    editMode
                      ? updatedStudInfo.first_name
                      : selectedItem.first_name
                  }
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </div>
              <div className="col">
                <strong>Surname</strong>
                <input
                  type="text"
                  name="last_name"
                  defaultValue={selectedItem.last_name}
                  value={
                    editMode
                      ? updatedStudInfo.last_name
                      : selectedItem.last_name
                  }
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
                <strong>Email</strong>
                <input
                  type="text"
                  name="email"
                  defaultValue={selectedItem.email}
                  value={editMode ? updatedStudInfo.email : selectedItem.email}
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
                <strong>Registration Number</strong>
                <input
                  type="text"
                  name="registration_number"
                  defaultValue={selectedItem.registration_number}
                  value={
                    editMode
                      ? updatedStudInfo.registration_number
                      : selectedItem.registration_number
                  }
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </div>
              <div className="col-sm">
                <strong>Course of Study</strong>
                <input
                  type="text"
                  name="course_of_study"
                  defaultValue={selectedItem.course_of_study}
                  value={
                    editMode
                      ? updatedStudInfo.course_of_study
                      : selectedItem.course_of_study
                  }
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </div>
              <div className="col-sm">
                <strong>Study Semester</strong>
                <input
                  type="text"
                  name="semester"
                  defaultValue={selectedItem.semester}
                  value={
                    editMode ? updatedStudInfo.semester : selectedItem.semester
                  }
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </div>
            </div>
            {editMode ? (
              <button onClick={handleSave}>Save</button>
            ) : (
              <button onClick={handleEditToggle}>Edit</button>
            )}{" "}
            {/* Grade Information */}
            <p>02. Grade Information</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudInfoDetailPopup;
