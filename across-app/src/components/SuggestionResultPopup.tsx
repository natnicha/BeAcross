import React, { useState, useRef, useEffect } from 'react';
import { usePopups } from '../PopupContext';
import { deleteRecommended, postRecommended } from '../services/recommendedServices';
import ModuleDetailPopup from './ModuleDetailPopup';
import CompareModuleDetailPopup from './CompareModuleDetailPopup';
import { deleteTransferable, postTransferable } from '../services/suggestionServices';
import { useLocation } from 'react-router-dom';

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
   
    const location = useLocation();
    const user_role = sessionStorage.getItem('user_role');
    const jwtToken = sessionStorage.getItem("jwtToken") || '';
    const [suggestedList, setSuggestedList] = useState<SuggestionItem[]>(props.suggestionItems);
    const [selectedSuggestedItem, setSuggestedItem] = useState<SuggestionItem>(props.selectedResultItem); // item from suggestion result
    const [isLoading, setIsLoading] = useState(false);
    
    const [selectedCompareItems, setSelectedCompareItems] = useState<SuggestionItem[]>([props.selectedResultItem]); // use in compare feature
    const [tempCompareItems, setTempCompareItems] = useState<SuggestionItem[]>([]); // use in compare feature
    const [immediateVisualSelected, setImmediateVisualSelected] = useState<SuggestionItem[]>([]); // use in compare feature

    // Hook all popup control to PopupContext
    const { openModuleDetailFromSuggestionPopup, isModuleDetailFromSuggestionPopup, openCompareDetailFromSuggestionPopup, isCompareDetailFromSuggestionPopup, closeAllPopups, closeEverythingThatOpenFromSuggestionPopup } = usePopups();
    const popupRef = useRef<HTMLDivElement>(null);
    const [responseMessages, setResponseMessages] = useState<{ [key: string]: { message: string; style: React.CSSProperties } }>({});
    const [checkedStates, setCheckedStates] = useState<{ [module_id: string]: boolean }>({});

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
        setIsLoading(true); // start loading
        event.preventDefault();
        event.stopPropagation();
    
        const isChecked = event.target.checked;
        // Directly update the checkedStates with the current isChecked value
        setCheckedStates(prevState => ({ ...prevState, [item.module_id]: isChecked }));
    
        let response;
    
        // Decide which API to call based on the isChecked value
        if (isChecked) {
            // If the checkbox is now checked, call postTransferable API
            response = await postTransferable(props.selectedResultItem.module_id, item.module_id);
        } else {
            // If the checkbox is now unchecked, call deleteTransferable API
            response = await deleteTransferable(props.selectedResultItem.module_id, item.module_id);
        }
    
        // Prepare to update the response message based on the API response
        let newResponseMessages = { ...responseMessages };
    
        // Update or delete the message for this specific item based on the response
        if (response && response.message) {
            newResponseMessages[item.module_id] = {
                message: response.message,
                style: {
                    margin: "15px",
                    color: isChecked ? "green" : "red" // Adjusted to directly use isChecked for color determination
                }
            };
        } else {
            // If no message from response, consider removing the message for this item
            delete newResponseMessages[item.module_id];
        }
    
        // Update the state with the new response messages
        setIsLoading(false); //end loading
        setResponseMessages(newResponseMessages);
    };

    useEffect(() => {
        const initialCheckedStates = props.suggestionItems.reduce((acc, item) => {
          acc[item.module_id] = true; // Set each item as checked by default
          return acc;
        }, {} as { [module_id: string]: boolean });
        setCheckedStates(initialCheckedStates);
      }, [props.suggestionItems]);

    const shouldDisableRowClick = () => {
    const currentUrl = window.location.href;
    return currentUrl.includes("http://localhost:3000/admin/list");
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
                                <div className="search-row" onClick={() => !shouldDisableRowClick() && handleRowClick(item as SuggestionItem)}>
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
                                    
                                    {responseMessages[item.module_id] && (
                                    <p style={responseMessages[item.module_id].style}>
                                        {responseMessages[item.module_id].message}
                                    </p>
                                    )}
                                    <div className="search-feature-control-btn">
                                        {/* Button-like Checkbox for Transferability */}
                                        {(user_role === 'uni-admin' || user_role === 'sys-admin') && location.pathname === '/admin/list' && (
                                            <label className="button-like-checkbox" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                                                <input 
                                                type="checkbox" 
                                                className="hidden-checkbox"
                                                checked={checkedStates[item.module_id]} // Controlled component
                                                onChange={(event) => handleCheckboxChange(event, item)}
                                                id={`checkbox-${item.module_id}`}
                                                />
                                                <span>Transferable&nbsp;&nbsp;</span>
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
                            <br /><br />
                            {
                                isLoading && (
                                <div className="loader-container">
                                    <p>Re-calculating Similarity logic, please do not close this popup.</p>
                                    <div className="loader"></div>
                                </div>
                                )
                            }
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