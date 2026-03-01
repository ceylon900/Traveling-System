import React, { useState, useEffect, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "./styles/business.css";

export default function BusinessPlace() {
  const { user } = useContext(AuthContext);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    name: "", description: "", category: "Hotel", location: "",
    longitude: "", latitude: "", address: "", contact: "", email: ""
  });
  const [isUpdate, setIsUpdate] = useState(false);
  const [businessId, setBusinessId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const locRes = await API.get("/locations");
      setLocations(locRes.data);
      
      const bizRes = await API.get(`/business/user/${user._id}`);
      if (bizRes.data) {
        setFormData(bizRes.data);
        setBusinessId(bizRes.data._id);
        setIsUpdate(true);
      }
    };
    fetchData();
  }, [user._id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isUpdate) {
        await API.put(`/business/${businessId}`, formData);
        alert("Business Profile Updated! ✅");
      } else {
        await API.post("/business", { ...formData, owner: user._id });
        alert("Business Registered Successfully! 🚀");
        setIsUpdate(true);
      }
    } catch (err) { alert("Action failed!"); }
  };

  return (
    <div className="biz-container">
      <div className="biz-card">
        <div className="biz-header">
          <h2>{isUpdate ? "Manage Your Business" : "Register Your Business"}</h2>
          <p>Grow your travel service with our platform</p>
        </div>

        <form onSubmit={handleSubmit} className="biz-form">
          <div className="form-grid">
            <div className="input-group">
              <label>Business Name</label>
              <input name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option>Hotel</option>
                <option>Guides</option>
                <option>Rent a Car</option>
              </select>
            </div>

            <div className="input-group full-width">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Nearby Location</label>
              <select name="location" value={formData.location} onChange={handleChange} required>
                <option value="">Select Area</option>
                {locations.map(loc => <option key={loc._id} value={loc._id}>{loc.name}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label>Contact Number</label>
              <input name="contact" value={formData.contact} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Latitude</label>
              <input type="number" step="any" name="latitude" value={formData.latitude} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Longitude</label>
              <input type="number" step="any" name="longitude" value={formData.longitude} onChange={handleChange} required />
            </div>

            <div className="input-group full-width">
              <label>Full Address</label>
              <input name="address" value={formData.address} onChange={handleChange} required />
            </div>

            <div className="input-group full-width">
              <label>Business Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="biz-submit-btn">
            {isUpdate ? "Update Business Profile" : "Register Business Now"}
          </button>
        </form>
      </div>
    </div>
  );
}