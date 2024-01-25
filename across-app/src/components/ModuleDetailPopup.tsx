import React from 'react';

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

type PopupProps = {
    content: string;
    onClose: () => void;
  };

  const ModuleDetailPopup: React.FC<ModuleDetailPopupProps & PopupProps> = ({ selectedItem, content, onClose }) => {
    return (
        <>
            <div className="popup-backdrop">
                <div className="popup-content">
                    <div className="title-popup mb-4">
                    <h5 style={{ color: "white"}}>{selectedItem.module_code} {selectedItem.module_name}</h5>
                    </div>
                    <button 
                        onClick={onClose} 
                        style={{ 
                            position: 'absolute', 
                            top: '10px', 
                            right: '10px', 
                            border: 'none', 
                            background: 'transparent', 
                            cursor: 'pointer' 
                        }}
                        >
                        X
                    </button>
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