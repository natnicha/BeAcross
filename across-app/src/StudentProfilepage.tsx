import React, { useState, useEffect, useRef } from 'react';

const StudentProfilepage: React.FC = () => {

    const [activeNav, setActiveNav] = useState('home'); // State to track the active navigation item

    // Function to handle navigation item click
    const handleNavClick = (navItem: string) => {
        setActiveNav(navItem);
    };

    return (
        <>         
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
        </>
    );
};

export default StudentProfilepage;
