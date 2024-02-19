import React, { useState, useRef, useEffect } from 'react';
import { usePopups } from '../PopupContext';
import { getComment } from '../services/commentServices';
import { postComment } from '../services/commentServices';

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


const ModuleDetailPopup: React.FC<ModuleDetailPopupProps> = ({ selectedItem }) => {
   
    const jwtToken = sessionStorage.getItem("jwtToken") || '';

    // Hook all popup control to PopupContext
    const { closeAllPopups } = usePopups();
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState('');
    const popupRef = useRef<HTMLDivElement>(null);
    const [moduleComments, setModuleComments] = useState<ModuleComment[]>([]);
    
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await getComment(selectedItem.module_id, jwtToken);
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
    }, [selectedItem.module_id, jwtToken]);
    
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
            const response = await postComment(selectedItem.module_id, jwtToken, commentText);
            alert(response.message); // Show success or error message
            // Optionally refresh comments here or update UI to show the new comment
            setCommentText(''); // Clear the comment box after submission
        } catch (error) {
            console.error("Failed to submit comment:", error);
        }
    };

    // Close the popup if clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            closeAllPopups();
        }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [closeAllPopups]);
    
    return (
        <div className="module-detail">
            <div className="popup-backdrop">
                <div ref={popupRef} className="popup-content">
                    <div className="title-popup mb-2">
                    <h5 style={{ color: "white", textAlign: "left"}}>&nbsp;&nbsp;&nbsp;{selectedItem.module_code} {selectedItem.module_name}</h5>
                    </div>
                    <button 
                        onClick={closeAllPopups} 
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
                    <div className="comment-box">
                        <h6>You can share your feedback here..</h6><p>The comment will post as an anonymous</p>
                        <form onSubmit={handleCommentSubmit} className="comment-form">
                            <textarea
                            className="comment-input"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..."
                            />
                            <button type="submit" className="custom-btn-green btn custom-link" disabled={!commentText.trim()}>Submit</button>
                        </form>
                        <ul className="comments-list">
                            {comments.map((comment) => (
                            <li key={comment.id} className="comment">
                                {comment.text}
                            </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModuleDetailPopup;