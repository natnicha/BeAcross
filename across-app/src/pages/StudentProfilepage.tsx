import React, { useState, useEffect, useRef } from 'react';

//thumbnail images
import personalplanImage from '../images/projects/personal-plan.png';
import examResultImage from '../images/projects/exam-result.png';
import editProfileImage from '../images/projects/edit-profile.png';

const StudentProfilepage: React.FC = () => {

    const [activeNav, setActiveNav] = useState('home'); // State to track the active navigation item
    const [showProfileInformation, setShowProfileInformation] = useState(false); // State to manage visibility of the sections

    // Function to handle navigation item click
    const homeNavClick = (navItem: string) => {
        setActiveNav(navItem);
        setShowProfileInformation(false);
    };
    const planNavClick = (navItem: string) => {
        setActiveNav(navItem);
        setShowProfileInformation(false);
    };
    const examNavClick = (navItem: string) => {
        setActiveNav(navItem);
        setShowProfileInformation(false);
    };
    const profileNavClick = (navItem: string) => {
        setActiveNav(navItem);
        setShowProfileInformation(true);
    };
 
    // Event handler for the 'Edit Profile' button
    const handleEditProfileClick = () => {
        setShowProfileInformation(true);
    };

    return (
        <>         
            <div className="profile-container">
                {/*Sidebar menu*/}
                <section className="tm-sidebar" id="tm-sidebar">
                        <nav className="tm-nav" id="tm-nav">            
                            <ul className="tm-nav-items">
                                <li className={`tm-nav-item ${activeNav === 'home' ? 'active' : ''}`} onClick={() => homeNavClick('home')}>
                                    <a href="#home" className="tm-nav-link">&nbsp;&nbsp;
                                    <i className="bi bi-house-door"></i> Home
                                    </a>
                                </li>
                                <li className={`tm-nav-item ${activeNav === 'mypersonalplan' ? 'active' : ''}`} onClick={() => planNavClick('mypersonalplan')}>
                                    <a href="#mypersonalplan" className="tm-nav-link">&nbsp;&nbsp;
                                    <i className="bi bi-bookmark"></i> My Personal Plan
                                    </a>
                                </li>
                                <li className={`tm-nav-item ${activeNav === 'myexamresult' ? 'active' : ''}`} onClick={() => examNavClick('myexamresult')}>
                                    <a href="#myexamresult" className="tm-nav-link">&nbsp;&nbsp;
                                    <i className="bi bi-file-earmark-text"></i> My Exam Results
                                    </a>
                                </li>
                            </ul>
                            <ul>
                                <li className={`tm-nav-item ${activeNav === 'profile' ? 'active' : ''}`} onClick={() => profileNavClick('profile')}>
                                    <a href="#profile" className="tm-nav-link">&nbsp;&nbsp;
                                    <i className="bi bi-file-person"></i>    Profile
                                    </a>
                                </li>
                            </ul>   
                        </nav>
                </section> 
                
                {/*Menu card*/}
                {/* Conditional rendering for menu card section */}
                {!showProfileInformation && (
                    <section className="tm-content" id="menucard">
                            <div className="nav nav-tabs flex-row align-items-baseline">
                                
                                <button className="nav-link active" id="personalplan">
                                    <img src={personalplanImage} className="img-fluid projects-image" alt="Personal Plan" /> 
                                    
                                    
                                    <a className="click-scroll" href="#personal-plan"> 
                                            <i className="bi bi-bookmark"></i> <strong> &nbsp; Personal Plan</strong>
                                        </a>
                                    
                                </button>  

                                <button className="nav-link active" id="examresult">
                                    <img src={examResultImage} className="img-fluid projects-image" alt="Personal Plan" /> 
                                     
                                        <a className="click-scroll" href="#exam-result"> 
                                            <i className="bi bi-file-earmark-text"></i> <strong> &nbsp; Exam Result</strong>
                                        </a>
                                    
                                </button>  

                                <button className="nav-link active" id="editprofile" onClick={handleEditProfileClick}>
                                    <img src={editProfileImage} className="img-fluid projects-image" alt="Edit Profile" /> 
                                     
                                        <a className="click-scroll" href="#edit-profile"> 
                                            <i className="bi bi-file-earmark-text"></i> <strong> &nbsp; Edit Profile</strong>
                                        </a>
                                    
                                </button> 
                            </div>
                    </section>
                )}

                {/*Profile Information*/}
                {/* Conditional rendering for profile information section */}
                {showProfileInformation && (
                    <section className="tm-content" id="profileinformation">
                        <div className="nav nav-tabs flex-row align-items-baseline">
                            <div className="about-thumb bg-white shadow-lg">
                                <h5 className="mb-3" style={{ color: '#1e5af5' }}>Personal Information</h5>
                                <div className="personal-info-container">
                                    <div className="personal-info-section">
                                        <p>First Name:</p>
                                        <input
                                            type="text"
                                            className="firstname full-width-input"
                                            placeholder=""
                                        />
                                    </div>

                                    <div className="personal-info-section">
                                        <p>Last Name:</p>
                                        <input
                                            type="text"
                                            className="lastname full-width-input"
                                            placeholder=""
                                        />
                                    </div>
                                </div>
                                <div className="personal-info-section">
                                    <p>Email:</p>
                                    <input
                                        type="text"
                                        className="email full-width-input"
                                        placeholder="firstname.lastname@tu-chemnitz.de"               
                                        disabled 
                                    />
                                </div>
                                <div className="personal-info-container">
                                    <div className="personal-info-section">
                                        <p>Password:</p>
                                        <input
                                            type="text"
                                            className="password full-width-input"
                                            placeholder="*****"
                                            disabled 
                                        />
                                    </div>
                                    <button
                                        className="custom-btn btn custom-link mt-4">                                       
                                        Change Password
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </>
    );
};

export default StudentProfilepage;
