import React from "react";

export default function AdminDashboard() {
  const admin = JSON.parse(localStorage.getItem("adminData"));

  return (
    <div className="dashboard-content">
      <header className="content-header">
        <h2>Welcome back, {admin?.username || "Admin"}! 👋</h2>
        <p>Here's what's happening with your platform today.</p>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">1,240</p>
          <span className="stat-label">👥 +12% from last month</span>
        </div>
        <div className="stat-card">
          <h3>Active Packages</h3>
          <p className="stat-number">45</p>
          <span className="stat-label">🌍 5 new added today</span>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-number">Rs. 245,000</p>
          <span className="stat-label">💰 Updated real-time</span>
        </div>
      </section>

      <section className="table-section">
        <h3>Recent Business Registrations</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Business Name</th>
              <th>Owner</th>
              <th>Category</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Blue Water Hotel</td>
              <td>Sunil Perera</td>
              <td>Hotel</td>
              <td><span className="status-badge active">Active</span></td>
            </tr>
            <tr>
              <td>Wild Safari Tours</td>
              <td>Nimal Silva</td>
              <td>Transport</td>
              <td><span className="status-badge pending">Pending</span></td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}