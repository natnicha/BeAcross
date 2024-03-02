import React, { useState, useRef, useEffect } from 'react';
import { usePopups } from '../PopupContext';
import { getComment } from '../services/commentServices';
import { postComment } from '../services/commentServices';
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
    selectedItem: Item;
    content: string;
    onClose?: () => void;
    shouldShowShareButtons: boolean;
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


const ModuleDetailPopup: React.FC<ModuleDetailPopupProps> = ({ selectedItem, shouldShowShareButtons, onClose }) => {
   
    const moduleId = selectedItem.module_id || "defaultId";
    const jwtToken = sessionStorage.getItem("jwtToken") || '';
    const user_role = sessionStorage.getItem('user_role'); // check to show comment section if student
    const navigate = useNavigate();
    const location = useLocation();
    const [config, setConfig] = useState<{ apiBaseUrl: string } | null>(null);

    // Hook all popup control to PopupContext
    const { closeAllPopups } = usePopups();
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState('');
    const popupRef = useRef<HTMLDivElement>(null);
    const [moduleComments, setModuleComments] = useState<ModuleComment[]>([]);
    const [showPersonalPlanPopup, setShowPersonalPlanPopup] = useState(false);
       
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await getComment(moduleId, jwtToken);
                // Map the response to match the ModuleComment type
                const mappedComments = response.items.map(item => ({
                    user: item.user,
                    message: item.message,
                    created_at: item.created_at.split('T')[0],
                }));
                setModuleComments(mappedComments);
            } catch (error) {
                console.error('Failed to fetch comments:', error);
            }
        };
        fetchComments();
    }, [moduleId, jwtToken]);
    
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

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;
    
        try {
            const response = await postComment(moduleId, jwtToken, commentText);
            alert(response.message); // Show success or error message
            setCommentText(''); // Clear the comment box after submission
        } catch (error) {
            console.error("Failed to submit comment:", error);
        }
    };

    const closePopup = () => {
        
        if (onClose)
        {
            onClose();
        } 
        else
        {
            const searchParams = new URLSearchParams(location.search);
            searchParams.delete('module');
            navigate({ pathname: '/search', search: searchParams.toString() });
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

    const handlePersonalPlan = async (e: React.FormEvent) => {
        setShowPersonalPlanPopup(true);
    };

    const confirmPersonalPlan = () => {
        setShowPersonalPlanPopup(false); // Close the popup

    };
    
    const cancelPersonalPlan = () => {
        setShowPersonalPlanPopup(false); // Close the popup

    };
    
    
    return (
        <div className="module-detail">
            <div className="popup-backdrop">
                <div ref={popupRef} className="popup-content">
                    <div className="title-popup mb-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h5 style={{ color: "white", textAlign: "left"}}>&nbsp;&nbsp;&nbsp;{selectedItem.module_code} {selectedItem.module_name}</h5>
                        {shouldShowShareButtons && (
                            <ul className="social-icon">
                                {/*Personal Plan*/}
                                <a href="#" className="social-icon-link bi bi-calendar-plus-fill" onClick={handlePersonalPlan} aria-label="Add to Personal Plan">
                                </a>
                                
                                <a href="#" className="social-icon-link bi-facebook" onClick={(e) => { e.preventDefault(); shareOnFacebook(window.location.href); }} aria-label="Share on Facebook">
                                </a>
                                <a href="#" className="social-icon-link bi-twitter" onClick={(e) => { e.preventDefault(); shareOnTwitter(window.location.href, 'Check out this module!'); }} aria-label="Share on Twitter">
                                </a>
                                <a href="#" className="social-icon-link bi bi-link-45deg" onClick={(e) => { e.preventDefault(); copyToClipboard(window.location.href); }} aria-label="Copy Link">
                                </a>
                            </ul>)
                        }
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
                                    <div className="detail-column"><strong>Degree Level:</strong></div>
                                    <div className="detail-column" id="degreeLevel">
                                        {selectedItem.degree_level}
                                    </div>
                                </div>

                                <div className="detail-row">
                                    <div className="detail-column"><strong>Module Type:</strong></div>
                                    <div className="detail-column" id="moduleTypr">
                                        {selectedItem.module_type}
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
                    
                    {/*Comment Box Section*/}
                    {
                        user_role === 'student' && (
                            <div className="comment-box">
                            <h6>You can share your feedback here..</h6>
                            <p>The comment will post as an anonymous</p>
                            <form onSubmit={handleCommentSubmit} className="comment-form">
                                <textarea
                                className="comment-input"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write a comment..."
                                />
                                <button 
                                    type="submit" 
                                    className="custom-btn-green btn custom-link" 
                                    disabled={!commentText.trim()}>
                                Submit
                                </button>
                            </form>
                            <ul className="comments-list">
                                {comments.map((comment) => (
                                <li key={comment.id} className="comment">
                                    {comment.text}
                                </li>
                                ))}
                            </ul>
                            </div>
                        )
                    }

                    {showPersonalPlanPopup && (
                        <div className="confirmation-popup">
                            <p>My Personal Plan</p>
                            <div>
                              <label>
                                <input 
                                  type="checkbox" 
                                  className="pointer-checkbox" 
                                  name="semester" 
                                  value="Summer 2025" 
                                  onChange={handlePersonalPlan}
                              /> 
                                &nbsp;Bialystok University Of Technology
                                </label>
                              <label>
                                <input 
                                  type="checkbox" 
                                  className="pointer-checkbox" 
                                  name="semester" 
                                  value="Winter 2024/25" 
                                  onChange={handlePersonalPlan}
                                />
                                &nbsp;Technische Universitat Chemnitz
                                </label>
                              <label>
                                <input 
                                  type="checkbox" 
                                  className="pointer-checkbox" 
                                  name="semester" 
                                  value="Summer 2024" 
                                  onChange={handlePersonalPlan}
                                /> 
                                &nbsp;University of Nova Gorica
                                </label>
                          </div>
                          <button className="custom-btn-green btn custom-link" onClick={confirmPersonalPlan}>Yes</button>&nbsp;&nbsp;
                        <button className="custom-btn-red btn custom-link"onClick={cancelPersonalPlan}>No</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModuleDetailPopup;