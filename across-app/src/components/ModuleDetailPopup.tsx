import React from 'react';
import { SearchResponse  } from "../services/searchServices";

// Define the Item type based on your data structure
interface Item {
    content?: string;
    university?: string;
    degree_program?: string;
    module_code?: number;
    ects?: number;
    degree_level?: string;
    module_name?: string;
}

interface ModuleDetailPopupProps {
    selectedItem: Item; // Corrected prop type
}

const ModuleDetailPopup: React.FC<ModuleDetailPopupProps> = ({ selectedItem }) => {
    return (
        <>
            <div className="popup-backdrop">
                <div className="popup-content">
                    <div className="title-popup mb-4">
                    <h5 style={{ color: "white"}}>{selectedItem.module_code} {selectedItem.module_name}</h5>
                    </div>
                <div className="search-table">
                    <div className="search-row">
                        <div className="search-column" id="degreeProgram">
                            
                        </div>
                        <div className="search-column" id="ectCredit">
                            Master
                        </div>
                        <div className="search-column" id="content">
                           5
                        </div>
                        <div className="search-column" id="university">
                            Summer
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </>
    );
};

export default ModuleDetailPopup;