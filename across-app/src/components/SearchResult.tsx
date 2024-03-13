import React, { useState, useEffect } from 'react';
import ModuleDetailPopup from '../components/ModuleDetailPopup';
import CompareModuleDetailPopup from '../components/CompareModuleDetailPopup';
import SuggestionPopup from '../components/SuggestionResultPopup';
import { SearchItem, SearchResponse } from "../services/searchServices";
import { postRecommended } from "../services/recommendedServices";
import { deleteRecommended } from "../services/recommendedServices";
import { SuggestionItem, getSuggestion } from "../services/suggestionServices";
import { useNavigate, useLocation } from 'react-router-dom';
import { usePopups } from '../PopupContext';

// Define the Item type based on your data structure
export interface Item {
    content?: string;
    university?: string;
    degree_program?: string;
    module_code?: number;
    ects?: string;
    degree_level?: string;
    module_name?: string;
    type?: string;
    module_id: string;
    is_recommended: boolean;
    no_of_recommend: number;
}

interface SearchResultProps {
    searchResult: SearchResponse;
}

const SearchResult: React.FC<SearchResultProps> = (props) => {
    
    //const isRecommendedInitially = true;
    
    const jwtToken = sessionStorage.getItem("jwtToken") || '';
    const user_role = sessionStorage.getItem('user_role'); // check to show comment section if student

    // Hook all popup control to PopupContext
    const { openModuleDetailPopup, isModuleDetailPopupOpen, openCompareModuleDetailPopup, isCompareModuleDetailPopupOpen, openSuggestionPopup, isSuggestionPopupOpen, closeAllPopups } = usePopups();
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [selectedCompareItems, setSelectedCompareItems] = useState<Item[]>([]);
    const [immediateVisualSelected, setImmediateVisualSelected] = useState<Item[]>([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [tempCompareItems, setTempCompareItems] = useState<Item[]>([]);
    const [items, setItems] = useState<SearchItem[] | undefined>(props.searchResult.items);

    const [suggestedItem, setSuggestedItem] = useState<SuggestionItem[] | undefined>([]);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const module_id = searchParams.get('module');
    
        // Ensure props.searchResult.items is defined and populated
        if (module_id && props.searchResult.items) {
            const moduleItem = props.searchResult.items.find(item => item.module_id === module_id);
            if (moduleItem) {
                setSelectedItem(moduleItem);
                openModuleDetailPopup(module_id);
            } else {
                // Handle case where no matching module is found
                console.log(`No module found with ID: ${module_id}`);
            }
        }
    }, [location.search, props.searchResult.items]); // Add props.searchResult.items to the dependency array to re-run when items are populated

    useEffect(() => {
        if (showConfirmPopup) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    
        // Cleanup function to ensure the class is removed when the component unmounts
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [showConfirmPopup]);

    useEffect(() => {
        setItems(props.searchResult.items);
    }, [props.searchResult.items]);

    const handleRowClick = (item: Item) => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('module', item.module_id!);
        navigate({ pathname: '/search', search: searchParams.toString() });
        setSelectedItem(item);
        openModuleDetailPopup(item.module_id || "default_module_id");
    };

    const closePopup = () => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.delete('module');
        navigate({ pathname: '/search', search: searchParams.toString() });
        setSelectedCompareItems([]);
        closeAllPopups();
    };

    const handleCompareClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, item: Item) => {
        event.preventDefault();
        event.stopPropagation(); // Prevent click from bubbling up
    
        // Prevent adding the item if it's already in the selection
        if (!selectedCompareItems.some(selectedItem => selectedItem.module_id === item.module_id)) {
            let newSelection = [...selectedCompareItems, item];
            
            // Proceed only if after adding, we have 2 or fewer items
            if (newSelection.length <= 2) {
                setSelectedCompareItems(newSelection);
                setImmediateVisualSelected(prev => [...prev, item]); // Ensure clicked items are visually marked
                setTempCompareItems(newSelection); // Temporarily store the selected items for comparison
    
                if (newSelection.length === 2) {
                    // Show confirmation popup only when two items are selected
                    setShowConfirmPopup(true);
                }
            }
        }
    };

    const isCompareDisabled = (item: Item) => {
        // Check if the current item is already selected
        const isAlreadySelected = selectedCompareItems.some(selectedItem => selectedItem.module_id === item.module_id);
    
        // Disable if 2 items are already selected or if the current item is already selected
        return selectedCompareItems.length >= 2 || isAlreadySelected;
    };

    const confirmComparison = () => {
        setShowConfirmPopup(false); // Close the confirmation popup
        if (tempCompareItems.length === 2) {
            openCompareModuleDetailPopup(tempCompareItems.map(item => item.module_id));
            setSelectedCompareItems([]); // Reset for new comparisons
            setImmediateVisualSelected([]); 
        }
    };
    
    const cancelComparison = () => {
        setShowConfirmPopup(false); // Close the popup
        setSelectedCompareItems([]); // Clear selections
        setImmediateVisualSelected([]); 
    };

    const handleRecommendedClick = async (event: React.MouseEvent<HTMLButtonElement>, item: Item) => {  
        event.preventDefault();
        event.stopPropagation();
    
        // Optimistically update the UI
        const updatedItems = items?.map((i) => {
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
        setItems(updatedItems);
    
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

    const handleSuggestionClick = async (event: React.MouseEvent<HTMLButtonElement>, item: Item) => {  
        event.preventDefault();
        event.stopPropagation();
    
        try {
            const response = await getSuggestion(item.module_id);
            if (response.suggested_module_items) {
                setSelectedItem(item);
                setSuggestedItem(response.suggested_module_items);
                openSuggestionPopup(response.suggested_module_items);

            } else {
                // Handle case where no suggested_module_items are present
                console.error("No suggestion items found.");
            }
        } catch (error) {
            console.error("Error handling recommendation:", error);
        }
    };
   
    return (
        <>
        {/*Search list*/}
        <section className="tm-content" style={{ margin: "0px"}} id="profileinformation">
            <div className="nav nav-tabs flex-row align-items-baseline" style={{ paddingLeft: "1%", width: "118%", paddingBottom: "2%"}}>
                <div className="about-thumb bg-white shadow-lg">
                    
                    <div className="search-header">
                        <div className="search-column"><strong>Module Code</strong></div>
                        <div className="search-column"><strong>Module Name</strong></div>
                        <div className="search-column"><strong>ECTS Credits</strong></div>
                        <div className="search-column"><strong>Degree Level</strong></div>
                        <div className="search-column"><strong>Module Type</strong></div>
                        <div className="search-column"><strong>University</strong></div>
                    </div>

                    {/*Display No Item*/}
                    {!props.searchResult.items &&
                        <h2 style={{ textAlign: "center", color: "red" , marginTop: "15px"}}> {props.searchResult.message} </h2>
                    }

                    {/*Display Items*/}
                    {items && items.map((item, index) => (
                        <div className="search-table" key={index}>
                            <div className="search-row" onClick={() => handleRowClick(item as Item)}>
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
                                {(user_role === 'student'|| user_role === 'sys-admin') ? (
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
                                    <button 
                                        className={`custom-btn-number btn custom-link ${item.no_of_suggested_modules === 0 ? 'disabled' : ''}`}
                                        onClick={(event) => handleSuggestionClick(event, item)}
                                        disabled={item.no_of_suggested_modules === 0}>
                                        <i className="bi bi-stars"></i> Suggestion Modules <span className="number-count">{item.no_of_suggested_modules}</span>
                                    </button>
                                    <button className={`btn custom-link ${immediateVisualSelected.includes(item) ? 'custom-btn-green-number' : 'custom-btn-grey-number'}`}
                                        onClick={(event) => handleCompareClick(event, item)}
                                        disabled={isCompareDisabled(item)}>
                                        Compare
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Conditionally render ModuleDetailPopup */}
                    {selectedItem && isModuleDetailPopupOpen && (
                        <ModuleDetailPopup 
                            content="" 
                            selectedItem={selectedItem} 
                            shouldShowShareButtons={true}
                        />
                    )} 

                    {isCompareModuleDetailPopupOpen && (
                        <CompareModuleDetailPopup 
                            content="" 
                            selectedItems={tempCompareItems} // Corrected prop name and passed the correct array
                        />
                    )}

                    {showConfirmPopup && (
                        <div className="confirmation-popup">
                            <p>Do you want to compare these selected Modules?</p>
                            <button className="custom-btn-green btn custom-link" onClick={confirmComparison}>Yes</button>&nbsp;&nbsp;
                            <button className="custom-btn-red btn custom-link"onClick={cancelComparison}>No</button>
                        </div>
                    )}

                    {isSuggestionPopupOpen && selectedItem && suggestedItem && (
                        <SuggestionPopup 
                            content="" 
                            selectedResultItem={selectedItem}
                            onClose={closePopup}
                            suggestionItems={suggestedItem} // Providing an empty array as a default
                        />
                    )}
                </div>
            </div>
        </section>
        </>
    );
};

export default SearchResult;