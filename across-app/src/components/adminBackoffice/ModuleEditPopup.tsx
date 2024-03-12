import React, { useState } from "react";

// Define the Item type based on your data structure
interface Item {
  module_id?: string;
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
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true); // Start loading

    fetch(`http://localhost:8000/api/v1/module/${selectedItem.module_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(updatedModule),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Updated data:", data);
        onClose();
        window.location.reload();
        setEditMode(false);
      })
      .catch((error) => {
        console.error("Error updating module:", error);
      })
      .finally(() => {
        setIsLoading(false); // End loading
      });
  };

  return (
    <div className="studInfo-detail">
      <div className="popup-backdrop">
        <div className="popup-content" style={{ width: "50%" }}>
          <div className="title-popup mb-2">
            <h5 style={{ color: "white", textAlign: "left" }}>
              &nbsp;&nbsp;&nbsp;Information of &nbsp; "{selectedItem.module_code}&nbsp;-&nbsp;
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

          <div
            className="container"
            style={{
              padding: "10px 20px",
            }}
          >
            {/* personal Information */}
            <h5 className="mb-3" style={{ color: "#1e5af5" }}>
              01. Module Information
            </h5>
            <div className="row mb-3 mt-10">
              <div className="col">
                <strong>Name :&nbsp;</strong>
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
                <strong>Module Code :&nbsp;</strong>
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
            <div className="row mb-3 ">
              <div className="col">
                <strong>Degree Program :</strong>
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
              <div className="col">
                <strong>ECTS Credits :</strong>
                <input
                  type="text"
                  name="ects"
                  value={editMode ? updatedModule.ects : selectedItem.ects}
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </div>
              <div className="col">
                <strong>Degree Level :</strong>
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
              <button
                className="custom-btn-green-number btn custom-link"
                onClick={handleSave}
                style={{ position: "absolute", top: "50px", right: "10px" }}
              >
                Save
              </button>
            ) : (
              <button
                className="custom-btn-number btn custom-link"
                onClick={handleEditToggle}
                style={{ position: "absolute", top: "50px", right: "10px" }}
              >
                Edit
              </button>
            )}{" "}
          </div>
          {
            isLoading && (
              <div className="loader-container">
                <p>Re-calculating Similarity logic, please do not close this popup.</p>
                <div className="loader"></div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default ModuleEditPopup;
