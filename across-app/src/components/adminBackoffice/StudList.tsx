import { useEffect, useState } from "react";
import StudInfoDetailPopup from "../StudInfoDetailPopup";

interface StudInfo {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  registration_number: string; //for the student
  course_of_study: string;
  semester: string;
}

interface StudInfoData {
  total_results: number;
  total_items: number;
  items: StudInfo[];
}

export default function StudList() {
  const [studInfoData, setStudInfoDatas] = useState<StudInfoData | null>(null);
  const [selectedItem, setSelectedItem] = useState<StudInfo | null>(null);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);

  const jwtToken = sessionStorage.getItem("jwtToken");

  // Functions to open/close the register popup
  const openDetailPopup = () => setIsDetailPopupOpen(true);
  const closeDetailPopup = () => setIsDetailPopupOpen(false);

  const handleRowClick = (item: StudInfo) => {
    setSelectedItem(item);
    openDetailPopup();
  };

  //Delete selected student
  const handleDeleteStud = (id: string) => {
    if (window.confirm("Do you want to delete the student?")) {
      fetch(`http://localhost:8000/api/v1/user/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete sutudent");
          }

          // Remove the deleted module from state
          setStudInfoDatas((prevModuleData) => {
            if (!prevModuleData) return null;
            const updatedItems = prevModuleData.items.filter(
              (item) => item.id !== id
            );
            return { ...prevModuleData, items: updatedItems };
          });
        })
        .catch((error) => {
          console.error("Error deleting sutudent:", error);
        });
    } else {
    }
  };

  //Get student list
  useEffect(() => {
    fetch("http://localhost:8000/api/v1/user/profile/list", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then((response) => response.json())
      .then((data: StudInfoData) => {
        setStudInfoDatas(data);
      })
      .catch((error) => {
        console.error("Error fetching studunt list data:", error);
      });
  }, [jwtToken]);

  return (
    <div className="about-thumb bg-white shadow-lg">
      <h5 className="mb-3" style={{ color: "#1e5af5" }}>
        Student List
      </h5>{" "}
      <div className="search-header">
        <div className="search-column">
          <strong>Name and Surname</strong>
        </div>
        <div className="search-column">
          <strong>Registrarion Nr.</strong>
        </div>
        <div className="search-column">
          <strong>Course of study</strong>
        </div>
        <div className="search-column">
          <strong>Study semester</strong>
        </div>
      </div>
      {/*Display Items*/}
      {studInfoData ? (
        <div className="search-table">
          {studInfoData.items.map((studInfo) => (
            <div className="search-row" key={studInfo.email}>
              <div className="search-column" id="name">
                {studInfo.first_name + " " + studInfo.last_name}
              </div>
              <div className="search-column" id="registrationNr">
                {studInfo.registration_number}
              </div>
              <div className="search-column" id="course">
                {studInfo.course_of_study}
              </div>
              <div className="search-column" id="semester">
                {studInfo.semester}
              </div>

              <div className="search-feature-control-btn">
                <div className="search-column-email" id="email">
                  Email: {studInfo.email}
                </div>
                <button
                  className="custom-btn-number btn custom-link"
                  onClick={() => handleRowClick(studInfo)}
                >
                  Edit{" "}
                </button>
                <button
                  className="custom-btn-red-number btn custom-link"
                  onClick={() => handleDeleteStud(studInfo.id)}
                >
                  Delete{" "}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No data</p>
      )}
      {/* Conditionally render ModuleDetailPopup */}
      {selectedItem && isDetailPopupOpen && (
        <StudInfoDetailPopup
          selectedItem={selectedItem}
          onClose={closeDetailPopup}
        />
      )}
    </div>
  );
}
