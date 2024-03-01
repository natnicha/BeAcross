import React from "react";

// Define the Item type based on your data structure
interface Item {
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
                  disabled
                />
              </div>
              <div className="col">
                <strong>Surname</strong>
                <input
                  type="text"
                  name="last_name"
                  defaultValue={selectedItem.last_name}
                  disabled
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
                  disabled
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
                  disabled
                />
              </div>
              <div className="col-sm">
                <strong>Course of Study</strong>
                <input
                  type="text"
                  name="course_of_study"
                  defaultValue={selectedItem.course_of_study}
                  disabled
                />
              </div>
              <div className="col-sm">
                <strong>Study Semester</strong>
                <input
                  type="text"
                  name="semester"
                  defaultValue={selectedItem.semester}
                  disabled
                />
              </div>
            </div>
            {/* Grade Information */}
            <p>02. Grade Information</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudInfoDetailPopup;
