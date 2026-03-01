import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style/UserManagement.css";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/accountmanagement/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (id) => {
    if (window.confirm("Are you sure you want to suspend this user? This action cannot be undone.")) {
      try {
        await axios.delete(`http://localhost:5000/api/accountmanagement/users/suspend/${id}`);
        fetchUsers();
        setSelectedUser(null);
      } catch (err) {
        alert("Suspend failed!");
      }
    }
  };

  if (loading) return <div className="admin-loader"><span></span></div>;

  return (
    <div className="mgmt-page-container">
      <header className="mgmt-page-header">
        <div className="header-text">
          <h1>User Directory</h1>
          <p>Manage and monitor platform participants</p>
        </div>
        <div className="header-stats">
          <div className="stat-pill">Total: {users.length}</div>
        </div>
      </header>

      <div className="data-card">
        <div className="table-responsive">
          <table className="modern-data-table">
            <thead>
              <tr>
                <th>Identity</th>
                <th>Email Address</th>
                <th>Privilege</th>
                <th>Registration</th>
                <th className="action-col">Operations</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="user-profile-cell">
                      <div className="mini-avatar">{user.username.charAt(0)}</div>
                      <span className="username-text">{user.username}</span>
                    </div>
                  </td>
                  <td className="email-cell">{user.email}</td>
                  <td>
                    <span className={`status-tag tag-${user.accountType}`}>
                      {user.accountType}
                    </span>
                  </td>
                  <td className="date-cell">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="action-col">
                    <button className="btn-details" onClick={() => setSelectedUser(user)}>
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="overlay-blur" onClick={() => setSelectedUser(null)}>
          <div className="profile-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top-bar">
              <h3>Member Profile</h3>
              <button className="btn-close" onClick={() => setSelectedUser(null)}>&times;</button>
            </div>
            
            <div className="modal-content-area">
              <div className="profile-hero">
                <div className="large-avatar">{selectedUser.username.charAt(0)}</div>
                <h4>{selectedUser.username}</h4>
                <span className={`hero-tag tag-${selectedUser.accountType}`}>{selectedUser.accountType}</span>
              </div>

              <div className="details-grid">
                <div className="data-item">
                  <label>Database Reference</label>
                  <p>{selectedUser._id}</p>
                </div>
                <div className="data-item">
                  <label>Email ID</label>
                  <p>{selectedUser.email}</p>
                </div>
              </div>
            </div>

            <div className="modal-footer-area">
              <button className="btn-suspend-action" onClick={() => handleSuspend(selectedUser._id)}>
                Suspend Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}