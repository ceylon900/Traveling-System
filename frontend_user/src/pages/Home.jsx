import React, { useEffect } from "react";
import "./styles/Home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const sections = document.querySelectorAll(".section");

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        } else {

        }
      });
    }, { threshold: 0.3 });

    sections.forEach(section => observer.observe(section));
  }, []);

  return (
    <div className="container-snap">

      <section className="section hero">
        <div className="hero-content">
          <h1 className="reveal-item">Explore The World</h1>
          <p className="reveal-item">Discover beautiful places and create memories that last forever.</p>
          <div className="reveal-item">
            <button onClick={() => navigate("/packages")} className="btn-explore">
              Get Started
            </button>
          </div>
        </div>
      </section>

      <section className="section places">
        <h2 className="reveal-item">Best Visiting Places</h2>
        <div className="places-grid">
          <div className="card reveal-item">Bali</div>
          <div className="card reveal-item">Maldives</div>
          <div className="card reveal-item">Paris</div>
        </div>
      </section>

      <section className="section services">
        <h2 className="reveal-item">Our Services</h2>
        <div className="services-list">
          <div className="card reveal-item">Flight Booking</div>
          <div className="card reveal-item">Hotel Reservations</div>
          <div className="card reveal-item">Tour Guides</div>
        </div>
      </section>

      <section className="section footer">
        <h2 className="reveal-item">Travel System</h2>
        <p className="reveal-item">© 2026 All Rights Reserved</p>
      </section>

    </div>
  );
}