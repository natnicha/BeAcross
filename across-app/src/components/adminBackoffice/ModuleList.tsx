import { useEffect, useState } from "react";
import ModuleEditPopup from "./ModuleEditPopup";

interface ModuleItem {
  module_id?: string;
  university?: string;
  degree_program?: string;
  module_code?: number;
  ects?: string;
  degree_level?: string;
  module_name?: string;
  type?: string;
}

interface ModuleData {
  data: {
    message?: string;
    total_items?: number;
    total_results?: number;
    items?: ModuleItem[];
  };
}

export default function ModuleList() {
  const [moduleData, setModuleDatas] = useState<ModuleData | null>(null);
  const [selectedItem, setSelectedItem] = useState<ModuleItem | null>(null);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);

  const jwtToken = sessionStorage.getItem("jwtToken");

  // Functions to open/close the register popup
  const openDetailPopup = () => setIsDetailPopupOpen(true);
  const closeDetailPopup = () => setIsDetailPopupOpen(false);

  const handleRowClick = (item: ModuleItem) => {
    setSelectedItem(item);
    openDetailPopup();
  };

  useEffect(() => {
    fetch(
      `http://localhost:8000/api/v1/module/search/advanced?term=("university":Chemnitz)`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((data: ModuleData) => {
        setModuleDatas(data);
      })
      .catch((error) => {
        console.error("Error fetching module list data:", error);
      });
  }, []);

  const handleDeleteStud = (id: string) => {
    if (window.confirm("Do you want to delete this module?")) {
      fetch(`http://localhost:8000/api/v1/module/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete module");
          }

          // Remove the deleted module from state
          setModuleDatas((prevModuleData) => {
            if (
              !prevModuleData ||
              !prevModuleData.data ||
              !prevModuleData.data.items
            )
              return null;
            const updatedItems = prevModuleData.data.items.filter(
              (item) => item.module_id !== id
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

  return (
    <div className="about-thumb bg-white shadow-lg">
      <h5 className="mb-3" style={{ color: "#1e5af5" }}>
        Module List
      </h5>
      <div className="search-header">
        <div className="search-column">
          <strong>Module Code</strong>
        </div>
        <div className="search-column">
          <strong>Module Name</strong>
        </div>
        <div className="search-column">
          <strong>ECTS Credits</strong>
        </div>
        <div className="search-column">
          <strong>Degree Level</strong>
        </div>
        <div className="search-column">
          <strong>University</strong>
        </div>
      </div>
      {/*Display Items*/}
      {moduleData ? (
        <div className="search-table">
          {moduleData.data.items &&
            moduleData.data.items.map((item, index) => (
              <div className="search-row" key={index}>
                <div className="search-column" id="moduleCode">
                  {item.module_code}
                </div>
                <div className="search-column" id="moduleName">
                  {item.module_name}
                </div>
                <div className="search-column" id="ect">
                  {item.ects}
                </div>
                <div className="search-column" id="degree">
                  {item.degree_level}
                </div>
                <div className="search-column" id="university">
                  {item.university}
                </div>
                <div className="search-feature-control-btn">
                  <button className="custom-btn-number btn custom-link">
                    <i className="bi bi-stars"></i> Suggestion Modules
                  </button>
                  <button
                    className="custom-btn-number btn custom-link"
                    onClick={() => handleRowClick(item)}
                  >
                    Edit{" "}
                  </button>
                  <button
                    className="custom-btn-red-number btn custom-link"
                    onClick={() => handleDeleteStud(item.module_id!)}
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
        <ModuleEditPopup
          selectedItem={selectedItem}
          onClose={closeDetailPopup}
        />
      )}
    </div>
  );
}
