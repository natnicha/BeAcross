import React, { useState, useEffect } from 'react';
import ModuleDetailPopup from '../components/ModuleDetailPopup';
import CompareModuleDetailPopup from '../components/CompareModuleDetailPopup';
import { SearchResponse } from "../services/searchServices";
import { useNavigate, useLocation } from 'react-router-dom';
import { usePopups } from '../PopupContext';

// Define the Item type based on your data structure
interface Item {
    content?: string;
    university?: string;
    degree_program?: string;
    module_code?: number;
    ects?: string;
    degree_level?: string;
    module_name?: string;
    type?: string;
    module_id: string;
}

interface SearchResultProps {
    searchResult: SearchResponse;
}

const SearchResult: React.FC<SearchResultProps> = (props) => {

    // Hook all popup control to PopupContext
    const { openModuleDetailPopup, isModuleDetailPopupOpen, openCompareModuleDetailPopup, isCompareModuleDetailPopupOpen, closeAllPopups } = usePopups();
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [selectedCompareItems, setSelectedCompareItems] = useState<Item[]>([]);
    const [immediateVisualSelected, setImmediateVisualSelected] = useState<Item[]>([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [tempCompareItems, setTempCompareItems] = useState<Item[]>([]);

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
    
        let newSelection = [...selectedCompareItems, item];
        if (newSelection.length <= 2) {
            setSelectedCompareItems(newSelection);
            setTempCompareItems(newSelection); // Temporarily store the selected items for comparison
    
            if (newSelection.length === 2) {
                // Show confirmation popup only when two items are selected
                setShowConfirmPopup(true);
            }
        }
    };

    const isCompareDisabled = (item: Item) => selectedCompareItems.length >= 2 && !selectedCompareItems.includes(item);

    const confirmComparison = () => {
        setShowConfirmPopup(false); // Close the confirmation popup
        if (tempCompareItems.length === 2) {
            openCompareModuleDetailPopup(tempCompareItems.map(item => item.module_id));
            setSelectedCompareItems([]); // Reset for new comparisons
        }
    };
    
    const cancelComparison = () => {
        setShowConfirmPopup(false); // Close the popup
        setSelectedCompareItems([]); // Clear selections
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
                    {props.searchResult.items && props.searchResult.items.map((item, index) => (
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
                                    <button className="custom-btn-yellow-number btn custom-link">                                       
                                        <i className="bi bi-hand-thumbs-up"></i> Recommended <span className="number-count">{item.no_of_recommend}</span>
                                    </button>
                                    <button className="custom-btn-number btn custom-link">                                       
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
                        onClose={closePopup} 
                    />
                    )} 

                    {isCompareModuleDetailPopupOpen && (
                        <CompareModuleDetailPopup 
                            content="" 
                            selectedItems={selectedCompareItems} // Corrected prop name and passed the correct array
                            onClose={closePopup} 
                        />
                    )}

                    {showConfirmPopup && (
                        <div className="confirmation-popup">
                            <p>Do you want to compare these selected Modules?</p>
                            <button className="custom-btn-green btn custom-link" onClick={confirmComparison}>Yes</button>
                            <button className="custom-btn-red btn custom-link"onClick={cancelComparison}>No</button>
                        </div>
                    )}
                </div>
            </div>
        </section>
        </>
    );
};

export default SearchResult;