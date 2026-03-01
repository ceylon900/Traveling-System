import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style/UserManagement.css";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [selectedBiz, setSelectedBiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/business/businesses");
      setUsers(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleViewBusiness = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/business/user/${userId}`);
      setSelectedBiz(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Business details not found.");
    }
  };

  const handleSuspendBusiness = async (bizId) => {
    if (window.confirm("Are you sure you want to suspend this business?")) {
      try {
        await axios.delete(`http://localhost:5000/api/business/business/suspend/${bizId}`);
        setSelectedBiz(null);
        alert("Business profile suspended successfully!");
      } catch (err) { alert("Operation failed."); }
    }
  };

  return (
    <div className="mgmt-wrapper">
      <div className="mgmt-header-section">
        <div>
          <h2>User Directory</h2>
          <p>Manage platform users and their associated business profiles.</p>
        </div>
        <div className="stats-mini">
          <span>Total Users: <strong>{users.length}</strong></span>
        </div>
      </div>

      <div className="table-card">
        <table className="modern-table">
          <thead>
            <tr>
              <th>User Info</th>
              <th>Account Status</th>
              <th>Member Since</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>
                  <div className="user-info-cell">
                    <div className="avatar">{u.username.charAt(0)}</div>
                    <div>
                      <div className="username">{u.username}</div>
                      <div className="email">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`status-pill ${u.accountType}`}>
                    {u.accountType}
                  </span>
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="text-right">
                  {u.accountType === "business" ? (
                    <button className="btn-primary-sm" onClick={() => handleViewBusiness(u._id)}>
                      🏢 View Profile
                    </button>
                  ) : (
                    <span className="no-action">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedBiz && (
        <div className="glass-modal-overlay" onClick={() => setSelectedBiz(null)}>
          <div className="modern-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-banner">
              <div className="banner-content">
                <h3>{selectedBiz.name}</h3>
                <span className="category-tag">{selectedBiz.category}</span>
              </div>
              <button className="close-icon-btn" onClick={() => setSelectedBiz(null)}>&times;</button>
            </div>
            
            <div className="modal-details-grid">
              <div className="detail-box">
                <label>Location</label>
                <p>📍 {selectedBiz.location?.name || "Not Specified"}</p>
              </div>
              <div className="detail-box">
                <label>Contact Number</label>
                <p>📞 {selectedBiz.contact}</p>
              </div>
              <div className="detail-box full-width">
                <label>Official Email</label>
                <p>✉️ {selectedBiz.email}</p>
              </div>
              <div className="detail-box full-width">
                <label>Business Address</label>
                <p>🏠 {selectedBiz.address}</p>
              </div>
              <div className="detail-box full-width">
                <label>About the Business</label>
                <div className="description-well">{selectedBiz.description}</div>
              </div>
            </div>

            <div className="modal-actions-bar">
              <button className="btn-danger" onClick={() => handleSuspendBusiness(selectedBiz._id)}>
                Suspend Profile
              </button>
              <button className="btn-secondary" onClick={() => setSelectedBiz(null)}>Dismiss</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}