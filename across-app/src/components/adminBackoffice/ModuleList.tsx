import { useEffect, useState, useRef } from "react";
import {
  SuggestionItem,
  getSuggestion,
} from "../../services/suggestionServices";
import SuggestionPopup from "../../components/SuggestionResultPopup";
import { usePopups } from "../../PopupContext";
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
  no_of_suggested_modules?: number;
  is_recommended: boolean;
  no_of_recommend: number;
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

  //Suggestion Module Session
  const { openSuggestionPopup, isSuggestionPopupOpen, closeAllPopups } =
    usePopups();
  const [suggestedItem, setSuggestedItem] = useState<
    SuggestionItem[] | undefined
  >([]);
  const popupRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<ModuleItem | null>(null);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredModuleItem, setFilteredModuleItem] = useState<ModuleItem[]>(
    []
  );

  const jwtToken = sessionStorage.getItem("jwtToken");

  // Functions to open/close the register popup
  const openDetailPopup = () => setIsDetailPopupOpen(true);
  const closeDetailPopup = () => setIsDetailPopupOpen(false);

  const handleRowClick = (item: ModuleItem) => {
    setSelectedItem(item);
    openDetailPopup();
  };

  //Get Module List
  useEffect(() => {
    fetch(
      `http://localhost:8000/api/v1/module/search/advanced?term=("university":Chemnitz)&limit=200`,
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

  // Filter module based on search query
  useEffect(() => {
    if (!moduleData) return;
    const filteredModules = moduleData.data.items?.filter((module) =>
      `${module.module_code} ${module.module_name}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    setFilteredModuleItem(filteredModules || []);
  }, [searchQuery, moduleData]);

  //Suggestion Module Session
  const handleSuggestionClick = async (
    event: React.MouseEvent<HTMLButtonElement>,
    item: ModuleItem
  ) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const response = await getSuggestion(item.module_id ?? "");
      if (response.suggested_module_items) {
        setSelectedItem(item);
        setSuggestedItem(response.suggested_module_items);
        openSuggestionPopup(response.suggested_module_items);
      } else {
        // Handle case where no suggested_module_items are present
        console.error("No suggestion items found.");
      }
    } catch (error) {
      console.error("Error handling recommendation:", error);
    }
  };

  // Close the popup if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        closeAllPopups();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeAllPopups]);

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
      <div
        className="searchbar"
        style={{ float: "right", padding: "10px", width: "100%" }}
      >
        <input
          type="text"
          placeholder="Search module name or code"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ float: "right", width: "45%" }}
        />
        <i className="bi bi-search" style={{ float: "right" }}></i>
      </div>
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
      {filteredModuleItem ? (
        <div className="search-table">
          {filteredModuleItem &&
            filteredModuleItem.map((item, index) => (
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

                {/* Button Feature */}
                <div className="search-feature-control-btn">
                  <button
                    className={"custom-btn-number btn custom-link"}
                    onClick={(event) => handleSuggestionClick(event, item)}
                    disabled={item.no_of_suggested_modules === 0}
                  >
                    <i className="bi bi-stars"></i> Suggestion Modules{" "}
                    <span className="number-count">
                      {item.no_of_suggested_modules}
                    </span>
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

      {isSuggestionPopupOpen && selectedItem && suggestedItem && (
        <SuggestionPopup
          content=""
          selectedResultItem={selectedItem as SuggestionItem} // Fix: Update the type of selectedItem
          onClose={closeAllPopups}
          suggestionItems={suggestedItem} // Providing an empty array as a default
        />
      )}
    </div>
  );
}
