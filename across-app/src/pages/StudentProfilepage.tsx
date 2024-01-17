import React, { useState, useEffect, useRef } from 'react';

//thumbnail images
import personalplanImage from '../images/projects/personal-plan.png';
import examResultImage from '../images/projects/exam-result.png';
import editProfileImage from '../images/projects/edit-profile.png';

const StudentProfilepage: React.FC = () => {

    const [activeNav, setActiveNav] = useState('home'); // State to track the active navigation item

    // Function to handle navigation item click
    const handleNavClick = (navItem: string) => {
        setActiveNav(navItem);
    };

    return (
        <>         
            <div className="profile-container">
                {/*Sidebar menu*/}
                <section className="tm-sidebar" id="tm-sidebar">
                        <nav className="tm-nav" id="tm-nav">            
                            <ul className="tm-nav-items">
                                <li className={`tm-nav-item ${activeNav === 'home' ? 'active' : ''}`} onClick={() => handleNavClick('home')}>
                                    <a href="#home" className="tm-nav-link">
                                    <i className="bi bi-house-door"></i> Home
                                    </a>
                                </li>
                                <li className={`tm-nav-item ${activeNav === 'mypersonalplan' ? 'active' : ''}`} onClick={() => handleNavClick('mypersonalplan')}>
                                    <a href="#mypersonalplan" className="tm-nav-link">
                                    <i className="bi bi-bookmark"></i> My Personal Plan
                                    </a>
                                </li>
                                <li className={`tm-nav-item ${activeNav === 'myexamresult' ? 'active' : ''}`} onClick={() => handleNavClick('myexamresult')}>
                                    <a href="#myexamresult" className="tm-nav-link">
                                    <i className="bi bi-file-earmark-text"></i> My Exam Results
                                    </a>
                                </li>
                            </ul>
                            <ul>
                                <li className={`tm-nav-item ${activeNav === 'profile' ? 'active' : ''}`} onClick={() => handleNavClick('profile')}>
                                    <a href="#profile" className="tm-nav-link">
                                    <i className="bi bi-file-person"></i>    Profile
                                    </a>
                                </li>
                            </ul>   
                        </nav>
                </section> 

                {/*Menu card*/}
                <section className="tm-content" id="tm-sidebar">
                        <div className="nav nav-tabs flex-row align-items-baseline">
                            <button className="nav-link active">
                                <img src={personalplanImage} className="img-fluid projects-image" alt="Personal Plan" /> 
                                <span> <br></br>
                                <a className="click-scroll" href="#personal-plan"> 
                                        <i className="bi bi-bookmark"></i> <strong> &nbsp; Personal Plan</strong>
                                    </a>
                                </span>
                            </button>  

                            <button className="nav-link active">
                                <img src={examResultImage} className="img-fluid projects-image" alt="Personal Plan" /> 
                                <span> <br></br>
                                    <a className="click-scroll" href="#exam-result"> 
                                        <i className="bi bi-file-earmark-text"></i> <strong> &nbsp; Exam Result</strong>
                                    </a>
                                </span>
                            </button>  

                            <button className="nav-link active">
                                <img src={editProfileImage} className="img-fluid projects-image" alt="Edit Profile" /> 
                                <span> <br></br>
                                    <a className="click-scroll" href="#edit-profile"> 
                                        <i className="bi bi-file-earmark-text"></i> <strong> &nbsp; Edit Profile</strong>
                                    </a>
                                </span>
                            </button> 
                        </div>
                </section>
            </div>
        </>
    );
};

export default StudentProfilepage;
