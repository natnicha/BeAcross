import React from 'react';

// Define the Item type based on your data structure
interface Item {
    content?: string;
    university?: string;
    degree_program?: string;
    module_code?: number;
    ects?: number;
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
        <div className="module-detail">
            <div className="popup-backdrop">
                <div className="popup-content">
                    <div className="title-popup mb-2">
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
                    <div className="detail-table">
                        <div className="details">
                            <div className="detail-row">
                                <div className="detail-column"><strong>University offer:</strong></div>
                                <div className="detail-column" id="university">
                                    {selectedItem.university}
                                </div>
                            </div>

                            <div className="detail-row">
                                <div className="detail-column"><strong>Degree Program:</strong></div>
                                <div className="detail-column" id="degreeProgram">
                                    {selectedItem.degree_program}
                                </div>
                            </div>

                            <div className="detail-row">
                                <div className="detail-column"><strong>ECTS credit:</strong></div>
                                <div className="detail-column" id="ectCredit">
                                    {selectedItem.ects}
                                </div>
                            </div>
                        </div>
                        <div className="detail-row">
                                <div className="detail-column"><strong>Module Content:</strong></div>
                                <div className="detail-column" id="content">
                                    {selectedItem.content}
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModuleDetailPopup;