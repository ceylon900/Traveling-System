import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style/ManageMaster.css";

export default function ManageMasterData() {
  const [activeTab, setActiveTab] = useState("locations");
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const API_BASE = "http://localhost:5000/api";

  const fetchData = async () => {
    try {
      const endpoint = activeTab === "locations" ? "/features/alllocation" : "/features/all";
      const res = await axios.get(API_BASE + endpoint);
      setData(res.data);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  useEffect(() => {
    fetchData();
    setFormData({ name: "", description: "" });
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = activeTab === "locations" ? "/features/createlocation" : "/features/create";
      await axios.post(API_BASE + endpoint, formData);
      setFormData({ name: "", description: "" });
      fetchData();
      alert("Success!");
    } catch (err) {
      alert("Error saving data");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      const endpoint = activeTab === "locations" ? `/features/deletelocation/${id}` : `/features/delete/${id}`;
      await axios.delete(API_BASE + endpoint);
      fetchData();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="master-container">
      <div className="tab-switcher">
        <button className={activeTab === "locations" ? "active" : ""} onClick={() => setActiveTab("locations")}>📍 Locations</button>
        <button className={activeTab === "categories" ? "active" : ""} onClick={() => setActiveTab("categories")}>📁 Categories</button>
      </div>

      <div className="content-grid">
        {/* Form Section */}
        <div className="card form-card">
          <h3>Add New {activeTab === "locations" ? "Location" : "Category"}</h3>
          <form onSubmit={handleSubmit}>
            <input 
              type="text" placeholder="Name" required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <textarea 
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
            <button type="submit" className="add-btn">Add Now</button>
          </form>
        </div>

        {/* List Section */}
        <div className="card list-card">
          <h3>Existing {activeTab === "locations" ? "Locations" : "Categories"}</h3>
          <div className="list-wrapper">
            {data.map((item) => (
              <div key={item._id} className="list-item">
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.description}</p>
                </div>
                <button className="del-btn" onClick={() => handleDelete(item._id)}>🗑️</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}