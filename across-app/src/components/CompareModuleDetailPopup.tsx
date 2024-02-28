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
    onClose: () => void;
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


const CompareModuleDetailPopup: React.FC<ModuleDetailPopupProps> = ({ selectedItems }) => {
   
    const jwtToken = sessionStorage.getItem("jwtToken") || '';
    const user_role = sessionStorage.getItem('user_role'); // check to show comment section if student
    const navigate = useNavigate();
    const location = useLocation();
    const [config, setConfig] = useState<{ apiBaseUrl: string } | null>(null);
    const [moduleComments, setModuleComments] = useState<ModuleComment[]>([]);

    // Hook all popup control to PopupContext
    const { closeAllPopups } = usePopups();
    const [commentText, setCommentText] = useState('');
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

    //socia media sharing
    useEffect(() => {
        loadAppConfig()
          .then((loadedConfig) => {
            setConfig(loadedConfig);
          })
          .catch((error) => {
            console.error('Error loading the configuration:', error);
          });
      }, []);

    const openInNewWindow = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };
    
    // Function to generate Facebook share URL
    const shareOnFacebook = (url: string) => {
        if (!config) {
            console.error('Configuration has not been loaded yet.');
            return;
        }
         // Replace 'localhost:3000' or any local IP Address
        const baseUrl = new URL(config.apiBaseUrl);
        const originalUrl = new URL(url);

        // Construct the new URL using the base URL from config and the original URL's pathname and search
        const newUrl = `${baseUrl.protocol}//${baseUrl.host}${originalUrl.pathname}${originalUrl.search}`;

        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(newUrl)}`;
        openInNewWindow(facebookUrl);
    };
      
    // Function to generate Twitter share URL
    const shareOnTwitter = (url: string, text: string) => {
        if (!config) {
            console.error('Configuration has not been loaded yet.');
            return;
        }
         // Replace 'localhost:3000' or any local IP Address
        const baseUrl = new URL(config.apiBaseUrl);
        const originalUrl = new URL(url);

        // Construct the new URL using the base URL from config and the original URL's pathname and search
        const newUrl = `${baseUrl.protocol}//${baseUrl.host}${originalUrl.pathname}${originalUrl.search}`;

        const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(newUrl)}&text=${encodeURIComponent(text)}`;
        openInNewWindow(twitterUrl);
    };
    
    // Function to copy current URL to clipboard
    const copyToClipboard = (url: string) => {
        if (!config) {
            console.error('Configuration has not been loaded yet.');
            return;
        }
    
        const baseUrl = new URL(config.apiBaseUrl);
        const originalUrl = new URL(url);
        const newUrl = `${baseUrl.protocol}//${baseUrl.host}${originalUrl.pathname}${originalUrl.search}`;
    
        // Try using the Clipboard API first
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(newUrl).then(() => {
                alert('Link copied to clipboard');
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        } else {
            // Fallback: Copy the text using a temporary textarea
            const textarea = document.createElement('textarea');
            textarea.value = newUrl;
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            try {
                const successful = document.execCommand('copy');
                const msg = successful ? 'successful' : 'unsuccessful';
                console.log('Fallback: Copying text command was ' + msg);
                alert('Link copied to clipboard');
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
            }
            document.body.removeChild(textarea);
        }
    };
        
    return (
        <div className="module-detail">
            <div className="popup-content">
                <div className="popup-backdrop">
                    {selectedItems.map((item, index) => (
                        <div key={index} ref={popupRef} className="popup-content">
                            <div className="title-popup mb-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <h5 style={{ color: "white", textAlign: "left"}}>&nbsp;&nbsp;&nbsp;{item.module_code} {item.module_name}</h5>
                                <ul className="social-icon">
                                    <a href="#" className="social-icon-link bi-facebook" onClick={(e) => { e.preventDefault(); shareOnFacebook(window.location.href); }} aria-label="Share on Facebook">
                                    </a>
                                    <a href="#" className="social-icon-link bi-twitter" onClick={(e) => { e.preventDefault(); shareOnTwitter(window.location.href, 'Check out this module!'); }} aria-label="Share on Twitter">
                                    </a>
                                    <a href="#" className="social-icon-link bi bi-link-45deg" onClick={(e) => { e.preventDefault(); copyToClipboard(window.location.href); }} aria-label="Copy Link">
                                    </a>
                                </ul>
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
                        </div> 
                    ))}  
                </div>
            </div>
        </div>                    
    );
};

export default CompareModuleDetailPopup;