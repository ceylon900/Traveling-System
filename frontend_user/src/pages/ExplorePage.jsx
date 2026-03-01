import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import "./styles/explore.css";

export default function ExplorePage() {
  const [packages, setPackages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();
  
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(""); 
  const [maxPrice, setMaxPrice] = useState(100000); // Default Max Price එක 100,000 ලෙස සැකසීම වඩාත් සුදුසුයි

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pkgRes, catRes, locRes] = await Promise.all([
          API.get("/packages"),
          API.get("/packages/categories"),
          API.get("/locations")
        ]);
        setPackages(pkgRes.data);
        setCategories(catRes.data);
        setLocations(locRes.data);
      } catch (err) {
        console.error("Data loading error:", err);
      }
    };
    fetchData();
  }, []);

  const filteredPackages = packages.filter(pkg => {
    const matchesCategory = selectedCategory === "" || pkg.category?._id === selectedCategory;
    const matchesLocation = selectedLocation === "" || pkg.location === selectedLocation;
    const matchesPrice = pkg.price <= maxPrice;

    return matchesCategory && matchesLocation && matchesPrice;
  });

  return (
    <div className="explore-container">
      <aside className="filter-sidebar">
        <h3>Filters</h3>
        
        <div className="filter-group">
          <label>Category</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Location</label>
          <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
            <option value="">All Locations</option>
            {locations.map(loc => (
              <option key={loc._id} value={loc.name}>{loc.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Max Price: Rs{maxPrice}</label>
          <input 
            type="range" 
            min="0" 
            max="100000" 
            step="1000" 
            value={maxPrice} 
            onChange={(e) => setMaxPrice(Number(e.target.value))} 
          />
        </div>

        <button className="reset-btn" onClick={() => {
          setSelectedCategory("");
          setSelectedLocation("");
          setMaxPrice(100000);
        }}>Clear Filters</button>

        {/* නිවැරදි කළ Link කොටස */}
        <Link to="/tripplan" style={{ textDecoration: 'none' }}>
          <button className="reset-btn" style={{ marginTop: "10px", backgroundColor: "#6366f1", color: "white" }}>
            Trip Planner 🤖
          </button>
        </Link>
      </aside>

      <main className="packages-display">
        <div className="grid-header">
            <h2>Recommended Packages ({filteredPackages.length})</h2>
        </div>
        
        <div className="explore-grid">
          {filteredPackages.length > 0 ? (
            filteredPackages.map(pkg => (
              <div key={pkg._id} className="matte-card">
                <div className="card-img">
                  <img src={`http://localhost:5000${pkg.image}`} alt={pkg.name} />
                </div>
                <div className="card-info">
                  <h4>{pkg.name}</h4>
                  <p className="loc">📍 {pkg.location}</p>
                  <div className="price-box">
                      <span className="amt">Rs{pkg.price}</span>
                      <button className="view-btn" onClick={() => navigate(`/viewpackage/${pkg._id}`)}>
                        View Details
                      </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">No packages found matching your filters.</p>
          )}
        </div>
      </main>
    </div>
  );
}