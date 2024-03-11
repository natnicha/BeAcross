import { useEffect, useState } from "react";
import StudInfoDetailPopup from "./StudInfoDetailPopup";

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
  const [studInfoData, setStudInfoData] = useState<StudInfoData | null>(null);
  const [selectedItem, setSelectedItem] = useState<StudInfo | null>(null);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredStudInfo, setFilteredStudInfo] = useState<StudInfo[]>([]);

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
            throw new Error("Failed to delete student");
          }

          // Remove the deleted student from state
          setStudInfoData((prevStudInfoData) => {
            if (!prevStudInfoData) return null;
            const updatedItems = prevStudInfoData.items.filter(
              (item) => item.id !== id
            );
            return { ...prevStudInfoData, items: updatedItems };
          });
        })
        .catch((error) => {
          console.error("Error deleting student:", error);
        });
    }
  };

  //Get student list
  useEffect(() => {
    fetch(`http://localhost:8000/api/v1/user/profile/list`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then((response) => response.json())
      .then((data: StudInfoData) => {
        setStudInfoData(data);
        setFilteredStudInfo(data?.items || []);
      })
      .catch((error) => {
        console.error("Error fetching student list data:", error);
      });
  }, [jwtToken]);

  // Filter students based on search query
  useEffect(() => {
    if (!studInfoData) return;
    const filteredStudents = studInfoData.items.filter((student) =>
      `${student.first_name} ${student.last_name} ${student.registration_number}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    setFilteredStudInfo(filteredStudents);
  }, [searchQuery, studInfoData]);

  return (
    <div className="about-thumb bg-white shadow-lg">
      <h5 className="mb-3" style={{ color: "#1e5af5" }}>
        Student List
      </h5>
      <div
        className="searchbar"
        style={{ float: "right", padding: "10px", width: "100%" }}
      >
        <input
          type="text"
          placeholder="Search student's name or registration number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ float: "right", width: "45%" }}
        />
        <i className="bi bi-search" style={{ float: "right" }}></i>
      </div>
      <div className="search-header">
        <div className="search-column">
          <strong>Name and Surname</strong>
        </div>
        <div className="search-column">
          <strong>Registration Nr.</strong>
        </div>
        <div className="search-column">
          <strong>Course of study</strong>
        </div>
        <div className="search-column">
          <strong>Study semester</strong>
        </div>
      </div>
      {/*Display Items*/}
      {filteredStudInfo ? (
        <div className="search-table">
          {filteredStudInfo.map((studInfo) => (
            <div className="search-row" key={studInfo.email}>
              <div className="search-column" id="name">
                {studInfo.first_name} {studInfo.last_name}
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
        <p>Loading...</p>
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
