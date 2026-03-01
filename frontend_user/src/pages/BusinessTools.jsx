import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./styles/BusinessTools.css";

export default function BusinessTools() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.accountType !== "business") {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="business-wrapper">
      <div className="dashboard-container animate-fade-in">
        
        <header className="dashboard-header">
          <h1>Business Dashboard <span className="badge">Pro</span></h1>
          <p>Welcome back, <strong>{user?.name || "Partner"}</strong>! Manage your travel services here.</p>
        </header>

        <div className="analytics-grid">
          <div className="stat-card">
            <h3>Total Bookings</h3>
            <p className="stat-number">128</p>
            <span className="stat-label">+12% this month</span>
          </div>
          <div className="stat-card">
            <h3>Revenue</h3>
            <p className="stat-number">$4,250</p>
            <span className="stat-label">+5.4% growth</span>
          </div>
          <div className="stat-card">
            <h3>Active Ads</h3>
            <p className="stat-number">05</p>
            <span className="stat-label">Running now</span>
          </div>
        </div>

        <div className="tools-grid">
          <div className="tool-card" onClick={() => navigate("/addpackage")}>
            <div className="icon">📢</div>
            <h3>Post New Package</h3>
            <p>Promote your services to thousands of travelers.</p>
            <button className="tool-btn">Create Ad</button>
          </div>

          <div className="tool-card" onClick={() => navigate("/managepackages")}>
            <div className="icon">📋</div>
            <h3>Manage Pachages</h3>
            <p>Update Details and information.</p>
            <button className="tool-btn">View All</button>
          </div>

          <div className="tool-card" onClick={() => navigate("/businessplace")}>
            <div className="icon">🏢</div>
            <h3>Business Place</h3>
            <p>Own business Place.</p>
            <button className="tool-btn">View</button>
          </div>

          <div className="tool-card" onClick={() => navigate("/seller-bookings")}>
            <div className="icon">🏢</div>
            <h3>All Booking</h3>
            <p>View and manage all bookings for your packages.</p>
            <button className="tool-btn">View</button>
          </div>

        </div>

      </div>
    </div>
  );
}