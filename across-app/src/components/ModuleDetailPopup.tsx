import React, { useState, useRef, useEffect } from 'react';
import { usePopups } from '../PopupContext';

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

const ModuleDetailPopup: React.FC<ModuleDetailPopupProps> = ({ selectedItem }) => {
    
    // Hook all popup control to PopupContext
    const { closeAllPopups } = usePopups();
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState('');
    const popupRef = useRef<HTMLDivElement>(null);
    
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

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        const newComment: Comment = {
          id: Date.now(), // Simple ID generation
          text: commentText,
        };
        setComments([...comments, newComment]);
        setCommentText(''); // Clear the input after submission
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
                    <h6 style={{ textAlign: 'left' }}>Comment Feedback from Student</h6>
                    <div className="detail-table">
                        <div>
                            <div className="details">
                                <div className="detail-row">
                                    <div className="detail-column"><strong>Date:</strong></div>
                                    <div className="detail-column" id="university">
                                        19-02-2024
                                    </div>
                                </div>
                                <div className="detail-row">
                                    <div className="detail-column"><strong>Date:</strong></div>
                                    <div className="detail-column" id="university">
                                        18-02-2024
                                    </div>
                                </div>
                                <div className="detail-row">
                                    <div className="detail-column"><strong>Date:</strong></div>
                                    <div className="detail-column" id="university">
                                        20-02-2024
                                    </div>
                                </div>
                                <div className="detail-row">
                                    <div className="detail-column"><strong>Date:</strong></div>
                                    <div className="detail-column" id="university">
                                        21-02-2024
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="comment-box">
                        <form onSubmit={handleCommentSubmit} className="comment-form">
                            <textarea
                            className="comment-input"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..."
                            />
                            <button type="submit" className="submit-btn">Post Comment</button>
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