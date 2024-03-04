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
  const [editScore, setEditScore] = useState(0);
  const [updatedStudInfo, setUpdatedStudInfo] = useState<Item>(selectedItem);

  const [chevron, setChevron] = useState(true);
  const [chevron2, setChevron2] = useState(true);
  const [chevron3, setChevron3] = useState(true);
  const [chevron4, setChevron4] = useState(true);

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
        <div className="popup-content" style={{ width: "60%" }}>
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

          <div
            className="container"
            style={{
              padding: "10px 20px",
            }}
          >
            {/* personal Information */}
            <h5 className="mb-3" style={{ color: "#1e5af5" }}>
              01. Personal Infomation
            </h5>
            <div className="row mb-3">
              <div className="col">
                <strong>Name </strong>
                <input
                  type="text"
                  name="first_name"
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
                <strong>Surname </strong>
                <input
                  type="text"
                  name="last_name"
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
            <div className="row mb-3">
              <div className="col">
                <strong>Email </strong>
                <input
                  type="text"
                  name="email"
                  value={editMode ? updatedStudInfo.email : selectedItem.email}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  style={{ width: "35%" }}
                />
              </div>
            </div>
            <div className="row mb-4">
              <div className="col-sm">
                <strong>Registration Number</strong>
                <input
                  type="text"
                  name="registration_number"
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
                  value={
                    editMode ? updatedStudInfo.semester : selectedItem.semester
                  }
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </div>
            </div>

            {/* Grade Information */}
            <h5 className="mb-3" style={{ color: "#1e5af5" }}>
              02. Grade Information
            </h5>
            <table>
              <thead>
                <tr>
                  <th>Modules Name</th>
                  <th>Status</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tr
                data-bs-toggle="collapse"
                data-bs-target="#collapseFocusModules"
                aria-expanded="false"
                aria-controls="collapseFocusModules"
                style={{ cursor: "pointer" }}
                onClick={() => setChevron(!chevron)}
              >
                <td colSpan={3}>
                  <i
                    className={
                      chevron ? "bi bi-chevron-down" : "bi bi-chevron-up"
                    }
                  ></i>
                  &nbsp;&nbsp;Focus modules - 25.0 credits
                </td>
              </tr>
              <tbody className="collapse show" id="collapseFocusModules">
                <tr>
                  <td>
                    553010 - Current Trends in Web Engineering - Core elective -
                    5.0 credits
                  </td>
                  {editScore > 4 ? (
                    <td style={{ color: "red" }}>Failed</td>
                  ) : (
                    <td style={{ color: "blue" }}>Passed</td>
                  )}
                  <td>
                    {editMode ? (
                      <select
                        onChange={(e) =>
                          setEditScore(parseFloat(e.target.value))
                        }
                      >
                        <option value={"0,0"}>0,0</option>
                        <option value={"1,0"}>1,0</option>
                        <option value={"2,0"}>2,0</option>
                        <option selected value={"3,0"}>
                          3,0
                        </option>
                        <option value={"4,0"}>4,0</option>
                        <option value={"5,0"}>5,0</option>
                      </select>
                    ) : (
                      "3,0"
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    563050 - Databases and web technologies - Core elective -
                    5.0 credits
                  </td>
                  <td style={{ color: "blue" }}>Passed</td>
                  <td>
                    {editMode ? (
                      <select>
                        <option value={"0,0"}>0,0</option>
                        <option value={"1,0"}>1,0</option>
                        <option selected value={"2,0"}>
                          2,0
                        </option>
                        <option value={"3,0"}>3,0</option>
                        <option value={"4,0"}>4,0</option>
                        <option value={"5,0"}>5,0</option>
                      </select>
                    ) : (
                      "2,0"
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    553050 - Cloud & Web applications - Core elective - 5.0
                    credits
                  </td>
                  <td style={{ color: "red" }}>Failed</td>
                  <td>
                    {editMode ? (
                      <select>
                        <option value={"0,0"}>0,0</option>
                        <option value={"1,0"}>1,0</option>
                        <option value={"2,0"}>2,0</option>
                        <option value={"3,0"}>3,0</option>
                        <option value={"4,0"}>4,0</option>
                        <option selected value={"5,0"}>
                          5,0
                        </option>
                      </select>
                    ) : (
                      "5,0"
                    )}
                  </td>
                </tr>
              </tbody>

              <tr
                data-bs-toggle="collapse"
                data-bs-target="#collapseAdvanceModules"
                aria-expanded="false"
                aria-controls="collapseAdvanceModules"
                style={{ cursor: "pointer" }}
                onClick={() => setChevron2(!chevron2)}
              >
                <td colSpan={2}>
                  <i
                    className={
                      chevron2 ? "bi bi-chevron-down" : "bi bi-chevron-up"
                    }
                  ></i>
                  &nbsp;&nbsp;Advance modules - 25.0 credits
                </td>
              </tr>
              <tbody className="collapse show" id="collapseAdvanceModules">
                <tr>
                  <td>
                    553030 - Design of distributed systems - Core elective - 5.0
                    credits
                  </td>
                  <td style={{ color: "blue" }}>Passed</td>
                  <td>
                    {editMode ? (
                      <select>
                        <option value={"0,0"}>0,0</option>
                        <option value={"1,0"}>1,0</option>
                        <option value={"2,0"}>2,0</option>
                        <option selected value={"3,0"}>
                          3,0
                        </option>
                        <option value={"4,0"}>4,0</option>
                        <option value={"5,0"}>5,0</option>
                      </select>
                    ) : (
                      "3,0"
                    )}
                  </td>
                </tr>
              </tbody>

              <tr
                data-bs-toggle="collapse"
                data-bs-target="#collapseSeminarModules"
                aria-expanded="false"
                aria-controls="collapseSeminarModules"
                style={{ cursor: "pointer" }}
                onClick={() => setChevron3(!chevron3)}
              >
                <td colSpan={3}>
                  <i
                    className={
                      chevron3 ? "bi bi-chevron-down" : "bi bi-chevron-up"
                    }
                  ></i>
                  &nbsp;&nbsp;Seminar modules - 7.0 credits
                </td>
              </tr>
              <tbody className="collapse show" id="collapseSeminarModules">
                <tr>
                  <td>
                    500410 Seminar Web Engineering - Compulsory elective - 5.0
                    credits
                  </td>
                  <td style={{ color: "blue" }}>Passed</td>
                  <td>
                    {editMode ? (
                      <select>
                        <option value={"0,0"}>0,0</option>
                        <option selected value={"1,0"}>
                          1,0
                        </option>
                        <option value={"2,0"}>2,0</option>
                        <option value={"3,0"}>3,0</option>
                        <option value={"4,0"}>4,0</option>
                        <option value={"5,0"}>5,0</option>
                      </select>
                    ) : (
                      "1,0"
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    500420 Preparatory seminar business game web engineering -
                    Compulsory elective - 2.0 credits
                  </td>
                  <td style={{ color: "blue" }}>Passed</td>
                  <td>
                    {editMode ? (
                      <select>
                        <option value={"0,0"}>0,0</option>
                        <option selected value={"1,0"}>
                          1,0
                        </option>
                        <option value={"2,0"}>2,0</option>
                        <option value={"3,0"}>3,0</option>
                        <option value={"4,0"}>4,0</option>
                        <option value={"5,0"}>5,0</option>
                      </select>
                    ) : (
                      "1,0"
                    )}
                  </td>
                </tr>
              </tbody>

              <tr
                data-bs-toggle="collapse"
                data-bs-target="#collapseCompetence"
                aria-expanded="false"
                aria-controls="collapseCompetence"
                style={{ cursor: "pointer" }}
                onClick={() => setChevron4(!chevron4)}
              >
                <td colSpan={3}>
                  <i
                    className={
                      chevron4 ? "bi bi-chevron-down" : "bi bi-chevron-up"
                    }
                  ></i>
                  &nbsp;&nbsp;Competence - 8.0 credits
                </td>
              </tr>
              <tbody className="collapse show" id="collapseCompetence">
                <tr>
                  <td>
                    136130 German as a foreign language I (level A1) - Core
                    elective - 4.0 credits
                  </td>
                  <td style={{ color: "blue" }}>Passed</td>
                  <td>
                    {editMode ? (
                      <select>
                        <option value={"0,0"}>0,0</option>
                        <option value={"1,0"}>1,0</option>
                        <option value={"2,0"}>2,0</option>
                        <option value={"3,0"}>3,0</option>
                        <option selected value={"4,0"}>
                          4,0
                        </option>
                        <option value={"5,0"}>5,0</option>
                      </select>
                    ) : (
                      "4,0"
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    136135 German as a foreign language II (level A2) - Core
                    elective - 4.0 credits
                  </td>
                  <td style={{ color: "red" }}>Failed</td>
                  <td>
                    {editMode ? (
                      <select>
                        <option value={"0,0"}>0,0</option>
                        <option value={"1,0"}>1,0</option>
                        <option value={"2,0"}>2,0</option>
                        <option value={"3,0"}>3,0</option>
                        <option value={"4,0"}>4,0</option>
                        <option selected value={"5,0"}>
                          5,0
                        </option>
                      </select>
                    ) : (
                      "5,0"
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ position: "absolute", top: "50px", right: "20px" }}>
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
      </div>
    </div>
  );
};

export default StudInfoDetailPopup;
