import React, { useState, useRef, useEffect } from 'react';
import { usePopups } from '../PopupContext';
import { getComment } from '../services/commentServices';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadAppConfig } from '../services/configUtils';

//Uni logo
import bialystokUni from "../images/uni/bialystok-university-technology-bialystok-poland.png";
import chemnitzUni from "../images/uni/technische-universitat-chemnitz-germany.png";
import novaUni from "../images/uni/university-of-nova-gorica-slovenia.png";

// Define the Item type based on your data structure
interface Item {
    content?: string;
    university?: string;
    degree_program?: string;
    degree_level?: string;
    module_type?: string;
    module_code?: number;
    ects?: string;
    module_name?: string;
    module_id: string;
}

interface ModuleDetailPopupProps {
    selectedItems: Item[];
    content: string;
    onClose?: () => void;
}

interface Comment {
    id: number;
    text: string;
}

interface ModuleComment {
    user: string;
    message: string;
    created_at: string;
}


const CompareModuleDetailPopup: React.FC<ModuleDetailPopupProps> = ({ selectedItems, onClose }) => {
   
    const jwtToken = sessionStorage.getItem("jwtToken") || '';
    const navigate = useNavigate();
    const location = useLocation();
    const [config, setConfig] = useState<{ apiBaseUrl: string } | null>(null);
    const [moduleComments, setModuleComments] = useState<ModuleComment[]>([]);

    // Hook all popup control to PopupContext
    const { closeAllPopups } = usePopups();
    const popupRef = useRef<HTMLDivElement>(null);
       
    
    useEffect(() => {
        const fetchCommentsForModule = async (moduleId: string) => {
            try {
                const response = await getComment(moduleId, jwtToken);
                return response.items.map(item => ({
                    user: item.user,
                    message: item.message,
                    created_at: item.created_at.split('T')[0],
                }));
            } catch (error) {
                console.error(`Failed to fetch comments for module ${moduleId}:`, error);
                return [];
            }
        };
    
        const fetchAllComments = async () => {
            const allComments = await Promise.all(selectedItems.map(item => fetchCommentsForModule(item.module_id)));
            setModuleComments(allComments.flat()); // Flatten the array if you're aggregating comments from multiple modules
        };
    
        if (selectedItems.length > 0) {
            fetchAllComments();
        }
    }, [selectedItems, jwtToken]);
    
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

    const closePopup = () => {
        if (onClose)
        {
            onClose();
        }
        else
        {
            closeAllPopups();
        }
    };

    // Close the popup if clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            closePopup();
        }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [closePopup]);
      
    return (
        <div className="module-detail">
            <div className="popup-content">
                <div className="popup-backdrop">
                    {selectedItems.map((item, index) => (
                        <div key={index} ref={popupRef} className="popup-content">
                            <div className="title-popup mb-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <h5 style={{ color: "white", textAlign: "left"}}>&nbsp;&nbsp;&nbsp;{item.module_code} {item.module_name}</h5>
                            </div>
                            <button 
                                onClick={closePopup} 
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
                            {/*Module Details Section*/}
                            <div className="detail-table">
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div className="details">
                                        <div className="detail-row">
                                            <div className="detail-column"><strong>University offer:</strong></div>
                                            <div className="detail-column" id="university">
                                                {item.university}
                                            </div>
                                        </div>

                                        <div className="detail-row">
                                            <div className="detail-column"><strong>Degree Program:</strong></div>
                                            <div className="detail-column" id="degreeProgram">
                                                {item.degree_program}
                                            </div>
                                        </div>

                                        <div className="detail-row">
                                            <div className="detail-column"><strong>Degree Level:</strong></div>
                                            <div className="detail-column" id="degreeLevel">
                                                {item.degree_level}
                                            </div>
                                        </div>

                                        <div className="detail-row">
                                            <div className="detail-column"><strong>Module Type:</strong></div>
                                            <div className="detail-column" id="moduleTypr">
                                                {item.module_type}
                                            </div>
                                        </div>

                                        <div className="detail-row">
                                            <div className="detail-column"><strong>ECTS credit:</strong></div>
                                            <div className="detail-column" id="ectCredit">
                                                {item.ects}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="details">
                                        <img
                                            src={handleUniLogo(item.university ?? "")}
                                            className="uni-logo"
                                            alt="University Logo"
                                        />
                                    </div>
                                </div>
                                <div className="detail-row">
                                        <div className="detail-column"><strong>Module Content:</strong></div>
                                        <div className="detail-column" id="content">
                                            {item.content}
                                        </div>
                                    </div>
                            </div>  

                            {/*Comment Section*/}
                            <div className="feedback-section">
                                <h6 id="uniqueCommentFeedback">Feedback from Students</h6>
                                <div className="detail-table" style={{ height: '40%' }}>
                                    {moduleComments.length > 0 ? (
                                        moduleComments.map((comment, index) => (
                                            <div key={index} className="comments">
                                                <div className="detail-row" style={{ border: '1px solid #ddd', width: '98%' }}>
                                                    <div className="detail-column-date" id="user">
                                                        <i className="bi bi-person-circle"></i>&nbsp;&nbsp;<strong>{comment.user}</strong>
                                                    </div>
                                                    <div className="detail-column-date" id="date">
                                                        <span style={{ fontSize: '12px', fontStyle: 'italic', marginLeft: '0%' }}>Date: {comment.created_at}</span>
                                                    </div>
                                                    <div className="comment-control">
                                                        {comment.message}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <h6 style={{ color: '#717275', marginTop: '5px' }}>There is no feedback for this module yet.</h6>
                                    )}
                                </div>
                            </div>
                        </div> 
                    ))}  
                </div>
            </div>
        </div>                    
    );
};

export default CompareModuleDetailPopup;