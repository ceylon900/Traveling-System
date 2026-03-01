import React from 'react';
import './styles/SubPages.css';

export default function About() {
  return (
    <div className="page-wrapper">
      <div className="glass-container animate-slide-up">
        <h1 className="page-title">About Travel System</h1>
        <div style={{textAlign: 'center', maxWidth: '800px', margin: '0 auto'}}>
          <p style={{fontSize: '1.1rem', lineHeight: '1.8', color: '#e2e8f0'}}>
            Launched in 2026, Travel System is your ultimate companion for global exploration. 
            We combine cutting-edge technology with a passion for travel to provide 
            seamless, secure, and unforgettable experiences.
          </p>
          <div style={{display: 'flex', justifyContent: 'space-around', marginTop: '50px'}}>
            <div><h2 style={{color: '#00f2fe'}}>150+</h2><p>Partners</p></div>
            <div><h2 style={{color: '#00f2fe'}}>12k+</h2><p>Travelers</p></div>
            <div><h2 style={{color: '#00f2fe'}}>24/7</h2><p>Support</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}