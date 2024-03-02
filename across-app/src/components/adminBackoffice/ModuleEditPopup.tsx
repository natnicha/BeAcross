import React, { useState } from "react";

// Define the Item type based on your data structure
interface Item {
  university?: string;
  degree_program?: string;
  module_code?: number;
  ects?: string;
  degree_level?: string;
  module_name?: string;
  type?: string;
}

interface ModuleEditPopupProps {
  selectedItem: Item;
  onClose: () => void;
}

const ModuleEditPopup: React.FC<ModuleEditPopupProps> = ({
  selectedItem,
  onClose,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [updatedModule, setUpdatedModule] = useState<Item>(selectedItem);

  const jwtToken = sessionStorage.getItem("jwtToken");

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedModule((prevModule) => ({
      ...prevModule,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Call API to save changes
    fetch(`http://localhost:8000/api/v1/module/${selectedItem.module_code}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(updatedModule),
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
        console.error("Error updating module:", error);
      });
  };

  return (
    <div className="studInfo-detail">
      <div className="popup-backdrop">
        <div className="popup-content">
          <div className="title-popup mb-2">
            <h5 style={{ color: "white", textAlign: "left" }}>
              &nbsp;&nbsp;&nbsp;Information of "{selectedItem.module_code}-
              {selectedItem.module_name}"
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
            <p>01. Module Information</p>
            <div className="row">
              <div className="col">
                <strong>Name</strong>
                <input
                  type="text"
                  name="module_name"
                  value={
                    editMode
                      ? updatedModule.module_name
                      : selectedItem.module_name
                  }
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </div>
              <div className="col">
                <strong>Module code</strong>
                <input
                  type="text"
                  name="module_code"
                  value={
                    editMode
                      ? updatedModule.module_code
                      : selectedItem.module_code
                  }
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
                <strong>Degree Program</strong>
                <input
                  type="text"
                  name="degree_program"
                  value={
                    editMode
                      ? updatedModule.degree_program
                      : selectedItem.degree_program
                  }
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
                <strong>ECTS Credits</strong>
                <input
                  type="text"
                  name="ects"
                  value={editMode ? updatedModule.ects : selectedItem.ects}
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </div>
              <div className="col-sm">
                <strong>Degree Level</strong>
                <input
                  type="text"
                  name="degree_level"
                  value={
                    editMode
                      ? updatedModule.degree_level
                      : selectedItem.degree_level
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleEditPopup;
