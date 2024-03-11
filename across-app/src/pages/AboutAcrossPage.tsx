import React, { useState } from "react";
import aboutAcrossBG from "../images/about-across-bg.png";
import Partners from "../images/projects/partners.png";


const AboutAcross: React.FC = () => {



  
  return (
    <>
    <div style={{ backgroundImage: `url(${aboutAcrossBG})` }} className="background-image"></div>
      <section className="about-across">
      <img src={Partners} style={{ width: '1000px', height: '471px' , marginTop: '12%'}} />
        <div className="text-content">
          <h2 style={{ color: "#1e5af5" }}>ACROSS</h2> <h5>ADVANCING EDUCATION ACROSS BORDERS</h5><br />
          <p>Across brings together nine European universities from Banja Luka, Bialystok, Chemnitz, Craiova, Girona, Nova Gorica, Perpignan, Udine, and Ruse, 
            along with an associated partner from Lviv. This coalition is built on the foundation of small to medium-sized institutions in cities close to borders, 
            creating a robust network. The real power of Across, however, lies in the varied expertise of its partners, covering a broad range of disciplines and specialties.</p>
            <br /><br />
          <h5>ACROSS VISION FOR EXCELLENCE IN EDUCATION</h5>
            <p>With our specialization in cross-border cooperation, Across address the distinct challenges present in border areas, providing students with an education that embodies 
            the European ethos. Our goal is to develop spaces that support continuous education, meeting the varied educational and professional aspirations of our students and learners. 
            Recognizing the need for adaptability, Across ensure our programs are flexible to accommodate the diverse circumstances of individuals. By embracing digital technologies for 
            instruction, learning, and communication, Across aim to eliminate geographical and language barriers, creating a European university that thrives on its diversity.</p>
            <br /><br /><br />
            <h5>MOTIVATION ABOUT ACROSS PROJECT</h5>
            <p>Us, "Victory Pie Solutions" team are part of a project at Technische Universität Chemnitz, working on the this project to promote cross-border 
              cooperation in Europe. Our aim is to create a comprehensive module catalog from these institutions, enhancing student learning opportunities and addressing areas 
              such as economic development, law, and cultural heritage.<br /><br />
              These involves integrating various university catalog data and applying ontology mapping, presenting unique challenges. We are investigating automated methods 
              to make this process more efficient and adaptable for potential new university partners in the alliance.<br /><br />
              Our team is passionate about expanding educational opportunities and breaking down barriers in Europe, whether they are political, educational, or cultural. 
              We prioritize openness, environmental responsibility, and high standards in all our endeavors, focusing on inclusivity and diverse learning options. Our commitment 
              to the 'ACROSS' project is driven by our belief in the transformative impact of education and our goal to facilitate continuous, accessible learning for a broad audience.
              </p>
        </div>
      </section>

    </>
  );
};

export default AboutAcross;
