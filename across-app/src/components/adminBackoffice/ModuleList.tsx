import { useEffect, useState } from "react";
import { SuggestionItem, getSuggestion } from "../../services/suggestionServices";
import SuggestionPopup from '../../components/SuggestionResultPopup';
import { usePopups } from '../../PopupContext';

interface ModuleItem {
  university?: string;
  degree_program?: string;
  module_code?: number;
  ects?: string;
  degree_level?: string;
  module_name?: string;
  type?: string;
  no_of_recommend? : string;
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
  const { openSuggestionPopup, isSuggestionPopupOpen, closeAllPopups } = usePopups();
  const [selectedItem, setSelectedItem] = useState<null>(null);
  const [suggestedItem, setSuggestedItem] = useState<SuggestionItem[] | undefined>([]);
  const no_of_suggested_modules = 0; // Mock

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

  //Suggestion Module Session
  /*const handleSuggestionClick = async (event: React.MouseEvent<HTMLButtonElement>, item: Item) => {  
    event.preventDefault();
    event.stopPropagation();

    try {
        const response = await getSuggestion(item.module_id);
        if (response.suggested_module_items) {
            //setSelectedItem(item);
            setSuggestedItem(response.suggested_module_items);
            openSuggestionPopup(response.suggested_module_items);

        } else {
            // Handle case where no suggested_module_items are present
            console.error("No suggestion items found.");
        }
    } catch (error) {
        console.error("Error handling recommendation:", error);
    }
  };*/


  return (
    <div className="about-thumb bg-white shadow-lg">
      <h5 className="mb-3" style={{ color: "#1e5af5" }}>
        Module List
      </h5>
      <div className="search-header">
        <div className="search-column"><strong>Module Code</strong></div>
        <div className="search-column"><strong>Module Name</strong></div>
        <div className="search-column"><strong>ECTS Credits</strong></div>
        <div className="search-column"><strong>Degree Level</strong></div>
        <div className="search-column"><strong>Module Type</strong></div>
        <div className="search-column"><strong>University</strong></div>
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
                <div className="search-column" id="type">
                  {item.type}
                </div>
                <div className="search-column" id="university">
                  {item.university}
                </div>
              
                {/* Button Feature */}
                <div className="search-feature-control-btn">
                  <button 
                      className={`custom-btn-number btn custom-link ${no_of_suggested_modules === 0 ? 'disabled' : ''}`}
                      /*</div>onClick={(event) => handleSuggestionClick(event, item)}*/
                      disabled={no_of_suggested_modules === 0}>
                      <i className="bi bi-stars"></i> Suggestion Modules <span className="number-count">{no_of_suggested_modules}</span>
                  </button>
                </div>              
              </div>
            ))}
        </div>
      ) : (
        <p>No data</p>
      )}
      
      {isSuggestionPopupOpen && selectedItem && suggestedItem && (
        <SuggestionPopup 
            content="" 
            selectedResultItem={selectedItem}
            onClose={closeAllPopups}
            suggestionItems={suggestedItem} // Providing an empty array as a default
        />
      )}

    </div>
  );
}
