import React, { useState, useRef, useEffect } from 'react';
import { usePopups } from '../PopupContext';
import { deleteRecommended, postRecommended } from '../services/recommendedServices';
import ModuleDetailPopup from './ModuleDetailPopup';
import CompareModuleDetailPopup from './CompareModuleDetailPopup';
import { deleteTransferable, postTransferable } from '../services/suggestionServices';

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
   
    const user_role = sessionStorage.getItem('user_role');
    const jwtToken = sessionStorage.getItem("jwtToken") || '';
    const [suggestedList, setSuggestedList] = useState<SuggestionItem[]>(props.suggestionItems);
    const [selectedSuggestedItem, setSuggestedItem] = useState<SuggestionItem>(props.selectedResultItem); // item from suggestion result
    
    const [selectedCompareItems, setSelectedCompareItems] = useState<SuggestionItem[]>([props.selectedResultItem]); // use in compare feature
    const [tempCompareItems, setTempCompareItems] = useState<SuggestionItem[]>([]); // use in compare feature
    const [immediateVisualSelected, setImmediateVisualSelected] = useState<SuggestionItem[]>([]); // use in compare feature
    const [responseMessage, setResponseMessage] = useState('');
    const [responseStyle, setResponseStyle] = useState({ margin: "15px", color: "green" });

    // Hook all popup control to PopupContext
    const { openModuleDetailFromSuggestionPopup, isModuleDetailFromSuggestionPopup, openCompareDetailFromSuggestionPopup, isCompareDetailFromSuggestionPopup, closeAllPopups, closeEverythingThatOpenFromSuggestionPopup } = usePopups();
    const popupRef = useRef<HTMLDivElement>(null);

    const closeCurrentContextPopup = () => {
        closeEverythingThatOpenFromSuggestionPopup();
    };

    const closeAllPopup = () => {
        closeAllPopups();
    };

    const handleRowClick = (item: SuggestionItem) => {
        setSuggestedItem(item);
        openModuleDetailFromSuggestionPopup();
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

        // part of logic in confirmComparison() in SearchResult.tsx
        if (newSelection.length === 2) {
            openCompareDetailFromSuggestionPopup();
            setSelectedCompareItems([props.selectedResultItem]); // Reset for new comparisons
            setImmediateVisualSelected([]); 
        }
    };
    
    // Close the popup if clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                closeAllPopup();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => { document.removeEventListener('mousedown', handleClickOutside); };
    }, [closeAllPopup]);

    //approved/Unapprved transferibility
    const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>, item: SuggestionItem) => {
        event.preventDefault();
        event.stopPropagation(); // Prevent click from bubbling up

        if (event.target.checked) {
        // Checkbox is checked - call postTransferable API
        const response = await postTransferable(props.selectedResultItem.module_id,item.module_id);
        if (response.status == 409 || response.status == 200 )
        {
            setResponseMessage(response.message);
            setResponseStyle({ margin: "15px", color: "green"}); // Set to green when add or no update
        }
        } else {
        // Checkbox is unchecked - call deleteTransferable API
        const response = await deleteTransferable(props.selectedResultItem.module_id,item.module_id);
        setResponseMessage(response.message);
        setResponseStyle({ margin: "15px", color: "red"}); // Set to red when delete
        }
    };

    return (
        <div className="module-detail">
            <div className="popup-backdrop">
                <div ref={popupRef} className="popup-content">
                    <div className="title-popup mb-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h5 style={{ color: "white", textAlign: "left"}}>&nbsp;&nbsp;&nbsp;Suggestion modules of &nbsp;" {selectedSuggestedItem.module_code} {selectedSuggestedItem.module_name} "</h5>
                    </div>
                    <button 
                        onClick={closeAllPopup} 
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
                    <div className="about-thumb bg-white shadow-lg" style={{ width: '95%' }}>
                        <div className="search-header">
                            <div className="search-column"><strong>Module Code</strong></div>
                            <div className="search-column"><strong>Module Name</strong></div>
                            <div className="search-column"><strong>ECTS Credits</strong></div>
                            <div className="search-column"><strong>Degree Level</strong></div>
                            <div className="search-column"><strong>Module Type</strong></div>
                            <div className="search-column"><strong>University</strong></div>
                        </div>
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
                                    
                                    <p style={responseStyle}>{responseMessage}</p>
                                    <div className="search-feature-control-btn">
                                        {user_role === 'uni-admin' && (                                               
                                            <label className="transferibity">
                                            <input 
                                                type="checkbox" 
                                                className="pointer-checkbox" 
                                                name="transferbility" 
                                                value="" 
                                                onChange={(event) => handleCheckboxChange(event, item)}
                                            /> 
                                            Transferable
                                            </label>
                                        )}
                                        
                                        {user_role === 'student' ? (
                                            <button 
                                                className={`btn custom-link ${item.is_recommended ? 'custom-btn-green-number' : 'custom-btn-yellow-number'}`}
                                                style={{ width: '20%' }}
                                                onClick={(event) => handleRecommendedClick(event, item)}
                                            >
                                                <i className="bi bi-hand-thumbs-up"></i> Recommended <span className="number-count">{item.no_of_recommend}</span>
                                            </button>
                                            ) : (
                                            <button className="custom-btn-grey-number btn custom-link" style={{ width: '20%'}} disabled>
                                                <i className="bi bi-hand-thumbs-up"></i> Recommended <span className="number-count">{item.no_of_recommend}</span>
                                            </button>
                                        )}    
                                        <button className="custom-btn-green-number btn custom-link"
                                            onClick={(event) => handleCompareClick(event, item)}>
                                            Compare
                                        </button>
                                    </div>
                                </div>
                            </div>))}
                         </div>   

                        {/* Conditionally render ModuleDetailPopup */}
                        {selectedSuggestedItem && isModuleDetailFromSuggestionPopup && (
                            <ModuleDetailPopup 
                                shouldShowShareButtons={false}
                                content="" 
                                selectedItem={selectedSuggestedItem} 
                                onClose={closeCurrentContextPopup} 
                            />
                        )}

                        {isCompareDetailFromSuggestionPopup && (
                            <CompareModuleDetailPopup 
                                content="" 
                                selectedItems={tempCompareItems} // Corrected prop name and passed the correct array
                                onClose={closeCurrentContextPopup} 
                            />
                        )}
                </div>
            </div>
        </div>
    );
};

export default SuggestionResultPopup;