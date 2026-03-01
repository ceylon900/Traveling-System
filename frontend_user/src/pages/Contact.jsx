import React from 'react';
import './styles/SubPages.css';

export default function Contact() {
  return (
    <div className="page-wrapper">
      <div className="glass-container animate-slide-up" style={{maxWidth: '700px'}}>
        <h1 className="page-title">Get In Touch</h1>
        <p style={{textAlign: 'center', marginBottom: '30px', color: '#cbd5e1'}}>Have questions? We are here to help you 24/7.</p>
        <form>
          <input type="text" className="input-field" placeholder="Full Name" required />
          <input type="email" className="input-field" placeholder="Email Address" required />
          <textarea className="input-field" rows="6" placeholder="Your Message..."></textarea>
          <button className="btn-explore" style={{width: '100%', padding: '15px', marginTop: '10px'}}>
            Send Inquiry
          </button>
        </form>
      </div>
    </div>
  );
}