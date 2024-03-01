import React, { useState, useRef, useEffect } from 'react';
import { usePopups } from '../PopupContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { deleteRecommended, postRecommended } from '../services/recommendedServices';
import ModuleDetailPopup from './ModuleDetailPopup';

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
    selectedResultItem: SuggestionItem;
    onClose: () => void;
    suggestionItems: SuggestionItem[]; // item from search result
    content?: string;
}

const SuggestionResultPopup: React.FC<PopupProps> = (props) => {
   
    const navigate = useNavigate();
    const location = useLocation();
    const user_role = sessionStorage.getItem('user_role');
    const jwtToken = sessionStorage.getItem("jwtToken") || '';
    const [suggestedList, setSuggestedList] = useState<SuggestionItem[]>(props.suggestionItems);
    const [selectedSuggestedItem, setSuggestedItem] = useState<SuggestionItem>(props.selectedResultItem); // item from suggestion result
    const [selectedCompareItems, setSelectedCompareItems] = useState<SuggestionItem[]>([props.selectedResultItem]);

    const [immediateVisualSelected, setImmediateVisualSelected] = useState<SuggestionItem[]>([]); // use in compare feature
    const [tempCompareItems, setTempCompareItems] = useState<SuggestionItem[]>([]); // use in compare feature

    // Hook all popup control to PopupContext
    const { openModuleDetailPopup, isModuleDetailPopupOpen, openCompareModuleDetailPopup, isCompareModuleDetailPopupOpen, openSuggestionPopup, isSuggestionPopupOpen, closeAllPopups } = usePopups();
    const popupRef = useRef<HTMLDivElement>(null);

    const closePopup = () => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.delete('module');
        navigate({ pathname: '/search', search: searchParams.toString() });
        closeAllPopups();
    };

    const handleRowClick = (item: SuggestionItem) => {
        setSuggestedItem(item);
        openModuleDetailPopup(item.module_id || "default_module_id");
    };

    const handleRecommendedClick = async (event: React.MouseEvent<HTMLButtonElement>, item: SuggestionItem) => {  
        event.preventDefault();
        event.stopPropagation();
    
        // Optimistically update the UI
        const updatedList = suggestedList?.map((i) => {
            if (i.module_id === item.module_id) {
                // Toggle the recommendation status and update the count
                return {
                    ...i,
                    is_recommended: !i.is_recommended,
                    no_of_recommend: i.is_recommended ? i.no_of_recommend - 1 : i.no_of_recommend + 1,
                };
            }
            return i;
        });
    
        // Update the state with the new items array
        setSuggestedList(updatedList);
    
        try {
            if (item.is_recommended) {
                await deleteRecommended(item.module_id, jwtToken);
            } else {
                await postRecommended(item.module_id, jwtToken);
            }
        } catch (error) {
            console.error("Error handling recommendation:", error);
        }
    };

    const handleCompareClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, item: SuggestionItem) => {
        event.preventDefault();
        event.stopPropagation(); // Prevent click from bubbling up
    
        let newSelection = [...selectedCompareItems, item];
        if (newSelection.length <= 2) {
            setSelectedCompareItems(newSelection);
            setImmediateVisualSelected(prev => [...prev, item]); // Ensure clicked items are visually marked
            setTempCompareItems(newSelection); // Temporarily store the selected items for comparison
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
                    
                    {suggestedList && suggestedList.map((item, index) => (
                        <div className="search-table" key={index}>
                            <div className="search-row" onClick={() => handleRowClick(item as SuggestionItem)}>
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
                                
                                <div className="search-feature-control-btn">
                                    {user_role === 'student' ? (
                                        <button 
                                            className={`btn custom-link ${item.is_recommended ? 'custom-btn-green-number' : 'custom-btn-yellow-number'}`}
                                            onClick={(event) => handleRecommendedClick(event, item)}
                                        >
                                            <i className="bi bi-hand-thumbs-up"></i> Recommended <span className="number-count">{item.no_of_recommend}</span>
                                        </button>
                                        ) : (
                                        <button className="custom-btn-grey-number btn custom-link" disabled>
                                            <i className="bi bi-hand-thumbs-up"></i> Recommended <span className="number-count">{item.no_of_recommend}</span>
                                        </button>
                                    )}

                                    <button className={`btn custom-link ${immediateVisualSelected.includes(item) ? 'custom-btn-green-number' : 'custom-btn-grey-number'}`}
                                        onClick={(event) => handleCompareClick(event, item)}>
                                        Compare
                                    </button>
                                </div>
                            </div>
                        </div>))}

                        {/* Conditionally render ModuleDetailPopup */}
                        {selectedSuggestedItem && isModuleDetailPopupOpen && (
                            <ModuleDetailPopup 
                                shouldShowShareButtons={false}
                                content="" 
                                selectedItem={selectedSuggestedItem} 
                                onClose={closePopup} 
                            />
                        )} 
                </div>
            </div>
        </div>
    );
};

export default SuggestionResultPopup;