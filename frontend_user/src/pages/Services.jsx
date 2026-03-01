import React from 'react';
import './styles/SubPages.css';

export default function Services() {
  return (
    <div className="page-wrapper">
      <div className="glass-container animate-slide-up">
        <h1 className="page-title">Our World-Class Services</h1>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginTop: '40px'}}>
          <div className="service-box" style={{padding: '20px', borderLeft: '4px solid #00f2fe', background: 'rgba(255,255,255,0.02)'}}>
            <h3>Flight Booking</h3>
            <p style={{color: '#cbd5e1', marginTop: '10px'}}>Instantly book flights to over 200 countries with the best price guarantee.</p>
          </div>
          <div className="service-box" style={{padding: '20px', borderLeft: '4px solid #00f2fe', background: 'rgba(255,255,255,0.02)'}}>
            <h3>Luxury Hotels</h3>
            <p style={{color: '#cbd5e1', marginTop: '10px'}}>Exclusive partnerships with top-rated hotels for a comfortable stay.</p>
          </div>
          <div className="service-box" style={{padding: '20px', borderLeft: '4px solid #00f2fe', background: 'rgba(255,255,255,0.02)'}}>
            <h3>Tour Packages</h3>
            <p style={{color: '#cbd5e1', marginTop: '10px'}}>Customized travel plans designed specifically for your interests.</p>
          </div>
        </div>
      </div>
    </div>
  );
}