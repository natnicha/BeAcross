import React from 'react';

//Uni logo
import bialystokUni from "../images/uni/bialystok-university-technology-bialystok-poland.png";
import chemnitzUni from "../images/uni/technische-universitat-chemnitz-germany.png";
import novaUni from "../images/uni/university-of-nova-gorica-slovenia.png";

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
    selectedItem: Item;
    content: string;
    onClose: () => void;
}

const ModuleDetailPopup: React.FC<ModuleDetailPopupProps> = ({ selectedItem, content, onClose }) => {
    
    const handleUniLogo = (university: string) => {
        switch (university) {
            case "Technische Universitat Chemnitz":
                return chemnitzUni;
            case "University of Nova Gorica":
                return novaUni;
            case "Bialystok University Of Technology":
                return bialystokUni;
            default:
                return ""; // Default image or handling
        }
    };
    
    return (
        <div className="module-detail">
            <div className="popup-backdrop">
                <div className="popup-content">
                    <div className="title-popup mb-2">
                    <h5 style={{ color: "white", alignItems:"left"}}>{selectedItem.module_code} {selectedItem.module_name}</h5>
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
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                            <div className="details">
                                <img
                                    src={handleUniLogo(selectedItem.university ?? "")}
                                    className="uni-logo"
                                    alt="University Logo"
                                />
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