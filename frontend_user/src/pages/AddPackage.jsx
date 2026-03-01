import React, { useState, useEffect, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "./styles/managepackages.css";

export default function AddPackage() {
  const { user } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [image, setImage] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    location: "", 
  });

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const [catRes, locRes] = await Promise.all([
          API.get("/packages/categories"),
          API.get("/locations")
        ]);
        setCategories(catRes.data);
        setLocations(locRes.data);
      } catch (err) {
        console.error("Error fetching form data", err);
      }
    };
    fetchFormData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("location", form.location); 
    formData.append("creator", user?._id);
    if (image) formData.append("image", image);

    try {
      await API.post("/packages", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Package Published Successfully! 🎉");
      setForm({ name: "", description: "", price: "", category: "", location: "" });
      setImage(null);
      e.target.reset();
    } catch (err) {
      alert("Failed to publish package.");
    }
  };

  return (
    <div className="business-wrapper">
      <div className="glass-container animate-slide-up" style={{ maxWidth: "600px" }}>
        <h2 className="page-title">Post New Service</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            className="input-field"
            placeholder="Package Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <textarea
            className="input-field"
            placeholder="Description"
            rows="4"
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div style={{ display: "flex", gap: "15px" }}>
            <input
              className="input-field"
              type="number"
              placeholder="Price ($)"
              required
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            
            <select
              className="input-field"
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            >
              <option value="">Select District</option>
              {locations.map((loc) => (
                <option key={loc._id} value={loc.name}> 
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          <select
            className="input-field"
            required
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className="file-input-wrapper">
            <label style={{ color: "#fff", marginBottom: "5px", display: "block" }}>
              Package Image:
            </label>
            <input
              type="file"
              accept="image/*"
              className="input-field"
              required
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <button type="submit" className="btn-explore" style={{ width: "100%", marginTop: "10px" }}>
            Publish Package
          </button>
        </form>
      </div>
    </div>
  );
}