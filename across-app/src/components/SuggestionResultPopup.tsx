import React, { useState, useRef, useEffect } from 'react';
import { usePopups } from '../PopupContext';
import { useNavigate, useLocation } from 'react-router-dom';

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

export interface SuggestionItem {
    content?: string;
    university?: string;
    degree_program?: string;
    module_code?: number;
    ects?: string;
    degree_level?: string;
    module_name?: string;
    type?: string;
    no_of_recommend: number;
    no_of_suggested_modules?: number;
    module_id: string;
    is_recommended: boolean;
} 

interface PopupProps {
    selectedItem: Item | null;
    onClose: () => void;
    suggestionItems?: SuggestionItem[]; // New property to hold suggestion items
    content?: string;
}

const SuggestionResultPopup: React.FC<PopupProps> = ({ selectedItem, suggestionItems }) => {
   
    //const moduleId = selectedItem.module_id || "defaultId";
    const jwtToken = sessionStorage.getItem("jwtToken") || '';
    const user_role = sessionStorage.getItem('user_role'); // check to show comment section if student
    const navigate = useNavigate();
    const location = useLocation();

    // Hook all popup control to PopupContext
    const { closeAllPopups } = usePopups();
    const popupRef = useRef<HTMLDivElement>(null);

    const closePopup = () => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.delete('module');
        navigate({ pathname: '/search', search: searchParams.toString() });
        closeAllPopups();
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
            <div className="popup-backdrop">
                <div ref={popupRef} className="popup-content">
                    <div className="title-popup mb-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                    
                    {/*Search Result*/}
                    {suggestionItems && suggestionItems.length > 0 && (
                    <div>
                        <h5>Suggested Modules</h5>
                        <ul>
                            {suggestionItems.map((item, index) => (
                                <li key={index}>
                                    {item.module_name} - {item.university}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
};

export default SuggestionResultPopup;