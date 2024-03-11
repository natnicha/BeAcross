import React, { useState } from "react";
import aboutAcrossBG from "../images/about-across-bg.png";


const AboutAcross: React.FC = () => {



  
  return (
    <>
    <img src={aboutAcrossBG} alt="Background" />
    <div className="background-image">
      <div className="text-content">
          <h1>Welcome to My Blog</h1>
          <p>This is a simple blog post example. It's positioned on the half-right side of the screen over a background image.</p>
      </div>
    </div>
    </>
  );
};

export default AboutAcross;
