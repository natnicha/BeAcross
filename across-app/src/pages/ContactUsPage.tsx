import React, { useState, FormEvent } from 'react';
import aboutAcrossBG from "../images/about-across-bg.png";

const ContactUs: React.FC = () => {

  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Prevent the default form submission

    try {
      const response = await fetch('http://localhost:8000/api/v1/contact-us', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        // Handle success response
        alert('Email sent successfully!');
        setForm({ name: '', email: '', message: '' }); // Reset form
      } else {
        // Handle server errors or invalid responses
        alert('Failed to send email. Please try again later.');
      }
    } catch (error) {
      // Handle network errors
      console.error('Network error:', error);
      alert('Network error. Please try again later.');
    }
  };
   
  return (
    <>
    <div style={{ backgroundImage: `url(${aboutAcrossBG})` }} className="background-image"></div>
    <section className="contact">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2990 320"><path fill="#f9c10b" fill-opacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>

    <div className="contact-container-wrap">
        <div className="container">
            <div className="row">
                <div className="col-lg-6 col-12">
                    <form className="custom-form contact-form" onSubmit={handleSubmit}>
                        <h2 className="mb-3">Contact Us</h2>
                        <p>We value your input and are eager to hear from you. Whether you have questions, feedback, or simply want to reach out, don't hesitate to get in touch with us</p>
                        <div className="row">
                          <div className="col-lg-6 col-md-6 col-12">                                    
                            <input type="text" name="name" value={form.name} onChange={handleChange} className="form-control" placeholder="Name" required />
                          </div>

                          <div className="col-lg-6 col-md-6 col-12">         
                            <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" placeholder="email@domain.xx" pattern="[^ @]*@[^ @]*" required />
                          </div>

                          <div className="col-12">
                            <textarea className="form-control" rows={7} id="message" name="message" value={form.message} onChange={handleChange} placeholder="Message"></textarea>
                            <button type="submit" className="form-control">Submit</button>
                          </div>
                        </div>
                    </form>
                </div>

                <div className="col-lg-6 col-12">
                    <div className="contact-thumb">               
                        <div className="contact-info bg-white shadow-lg">
                            <h4 className="mb-4">Reichenhainer Str. 70, 09126 Chemnitz</h4>
                            <h5>
                                <a href="mailto:Victorypiesolutions@outlook.com" className="footer-link">
                                    <i className="bi-envelope-fill contact-icon me-2"></i>
                                    Victorypiesolutions@outlook.com
                                </a>
                            </h5>
                            <ul className="social-icon">
                                <li><a href="https://www.facebook.com/victorypiesolutions" className="social-icon-link bi-facebook"></a></li>
                                <li><a href="https://x.com/VictoryPie2023" className="social-icon-link bi-twitter"></a></li>
                                <li><a href="https://www.instagram.com/victorypiesolutions/" className="social-icon-link bi-instagram"></a></li>
                                <li><a href="https://www.linkedin.com/in/victory-pie-solutions-493516299/" className="social-icon-link bi-linkedin"></a></li>
                            </ul>
                            <iframe className="google-map mt-4" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2520.8054961362877!2d12.928331700000001!3d50.816242300000006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a7472b0ade30d5%3A0xcf1cfa7ca41c7210!2sTechnische%20Universit%C3%A4t%20Chemnitz!5e0!3m2!1sen!2sde!4v1710205531605!5m2!1sen!2sde" width="100%" height="300" loading="lazy"></iframe>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</section>

    </>
  );
};

export default ContactUs;
