import React from 'react';

const Footer: React.FC = () => {
    return (
        <>
            <footer className="site-footer">
            <div className="container">
                <div className="row">
                        
                    <div className="col-lg-6 col-12">
                        <div className="site-footer-wrap d-flex align-items-center">
                            <p className="copyright-text mb-0 me-4">
                                Copyright © 2024 European Cross-Border University
                            </p>

                            <ul className="social-icon">
                                <li><a href="#" className="social-icon-link bi-facebook"></a></li>
                                <li><a href="#" className="social-icon-link bi-twitter"></a></li>
                                <li><a href="#" className="social-icon-link bi-instagram"></a></li>
                                <li><a href="#" className="social-icon-link bi-linkedin"></a></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="col-lg-6 col-12">
                    	<p className="copyright-text text-center mx-auto mb-0 me-4">
                            This website design by &nbsp; 
                            <a style={{ color: "#ef7f0a" }} href="https://www.victorypiesolutions.com/" target="_blank">Victory Pie Solutions</a>
                        </p>
                    </div>

                </div>
            </div>
        </footer>
        </>
    );
};

export default Footer;