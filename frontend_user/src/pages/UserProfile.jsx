import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "./styles/profile.css";

export default function UserProfile() {
  const { user, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ username: user.username, email: user.email });
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.put(`/user/update/${user._id}`, formData);

      setUser(res.data); 
      setIsEditing(false);
      alert("Profile Updated Successfully!");

    } catch (err) {
      alert(err.response?.data?.message || "Update failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-glass-card">
        <div className="profile-header">
          <div className="avatar-circle">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <h2>My Profile</h2>
          <p className="account-badge">{user?.accountType} Account</p>
        </div>

        <div className="profile-content">
          {!isEditing ? (
            <div className="view-mode animate-in">
              <div className="info-box">
                <label>Username</label>
                <p>{user?.username}</p>
              </div>

              <div className="info-box">
                <label>Email Address</label>
                <p>{user?.email}</p>
              </div>

              <button
                className="edit-toggle-btn"
                onClick={() => setIsEditing(true)}
              >
                Change User Details
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="edit-mode animate-in">
              <div className="field">
                <label>New Username</label>
                <input
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                />
              </div>

              <div className="field">
                <label>New Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="navigate-edit">
                <Link to="/editpassword" className="update-password">Update Password</Link>
              </div>

              <div className="btn-group">
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? "Updating..." : "Update"}
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
