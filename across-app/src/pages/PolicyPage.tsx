import React from "react";
import aboutAcrossBG from "../images/about-across-bg.png";


const Policy: React.FC = () => {

  return (
    <>
    <div style={{ backgroundImage: `url(${aboutAcrossBG})` }} className="background-image"></div>
      <section className="policy">
        <div className="privacy-policy">
          <h2 style={{ color: "#1e5af5" }}>Privacy Policy</h2><br />
          <h5>I. DATA PROTECTION</h5><br />
          <p>Thank you for visiting our website Victory Pie Solutions attaches great importance to the protection of your personal data.  
            It has therefore taken technical and organizational measures to ensure that the regulations on data protection are observed and complied with.<br />
            Personal data is only processed (collected, stored, and used) if and as long as this is necessary for the services offered on the website. Afterwards, 
            the data will be deleted immediately. All data will be treated confidentially by Victory Pie Solutions and by the partners commissioned with the technical processing.</p>
            <br />
            <h5>II. CONTACT DETAILS OF THE DATA PROTECTION</h5>
            <p>Victory Pie Solutions<br />
              Saleh Ghraiyib<br />
              09126 Chemnitz<br />
              Tel. 015736206861<br />
              E-mail: <a href="mailto:saleh.ghraiyib@s2022.tu-chemnitz.de">saleh.ghraiyib@s2022.tu-chemnitz.de</a>
            </p><br />
            <h5>III. TECHNICAL IMPLEMENTATION OF THE WEBSITE</h5>
            <p>The technical development and maintenance of the website are managed externally by Victory Pie Solutions, in conjunction with the webmaster of Across. 
              For assistance or inquiries, the Across webmaster can be contacted through the following email address: <a href="mailto:Victorypiesolutions@outlook.com">Victorypiesolutions@outlook.com</a></p>
            <br />
            <h5>IV. GENERAL INFORMATION ON DATA PROCESSING</h5>
            <p>a) The use of contact forms, order forms and other online services requires the entry of personal data in order to fulfill the requested services. All personal data is collected and 
              stored exclusively for the respective purpose.<br />
              You should note that if data is transmitted over the Internet in unencrypted form, there is a possibility that third parties may take note of it or falsify it. For this reason, 
              the SSL (Secure Socket Layer) encryption procedure is offered for interactive offers.<br />
              If you wish to send the Victory Pie Solutions e-mails containing confidential information, please note that encryption cannot be offered for this at present and transmission 
              would not be secure.<br />
              The legislator has enacted a wide range of retention obligations and periods. After these periods have expired, the corresponding data is routinely deleted if it is no longer 
              required for the fulfillment of tasks.<br />
              To protect your transmitted data in the best possible way, this website uses SSL encryption. All data that you transmit to this website cannot be read by third parties thanks to SSL encryption.
              <br /><br />
              b) Victory Pie Solutions endeavors to ensure that all information and data on its website is accurate and up to date. With the abundance of information to be processed, errors or incompleteness 
              cannot be avoided despite careful processing. A liability or guarantee for the topicality, correctness and completeness of the information and data provided is excluded. 
              Victory Pie Solutions reserves the right to make changes or additions at any time without prior notice.<br />
              This notice also applies to all other websites referred to by hyperlinks. For all links on this website, we expressly emphasize that Victory Pie Solutions has no influence on the design 
              and content of the linked pages. Therefore, we hereby expressly distance ourselves from all contents of all linked pages on this website. However, when linking to these Internet offers for the first time, 
              Victory Pie Solutions checked the external content to see whether it could trigger any possible liability under civil or criminal law.
            </p><br />
            <h5>V. LINK TO THIRD - PARTY WEBSITES</h5>
            <p>Our website includes links to sites and services owned and operated by third parties (Social Media):<br /><br />
            <p>
              Facebook (Facebook Inc., USA, California, San Jose): 
              <a href="https://www.facebook.com/privacy/policy/?entry_point=comet_dropdown" target="_blank" rel="noopener noreferrer">https://www.facebook.com/privacy/policy/?entry_point=comet_dropdown</a>
              <br />
              Twitter (Twitter Inc., 1355 Market Street, Suite 900, San Francisco, CA 94103, USA): 
              <a href="https://twitter.com/en/privacy" target="_blank" rel="noopener noreferrer">https://twitter.com/en/privacy</a>
              <br />
            </p>
              These external sites are developed and maintained independently by such third parties, over whom we have no control regarding their design, content, or functionality. 
              We explicitly dissociate ourselves from the content of all linked third-party websites. It's important to note that these third-party sites may use their own cookies, 
              which could be placed on your device to gather personal data. Unfortunately, we have no control over these cookies or the data collection practices of these sites. 
              Should you have concerns regarding how your data is handled by these third-party sites, we recommend contacting the respective site owners directly for more information.
            </p>
          </div>
      </section>
    </>
  );
};

export default Policy;
