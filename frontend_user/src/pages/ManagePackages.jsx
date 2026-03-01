import React, { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "./styles/managepackages.css";

export default function ManagePackages() {
  const { user } = useContext(AuthContext);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ id: "", name: "", location: "", price: "", description: "" });
  const [editImage, setEditImage] = useState(null);

  const fetchMyPackages = async () => {
    try {
      const res = await API.get("/packages");
      const myData = res.data.filter(pkg => pkg.creator === user?._id);
      setPackages(myData);
      setLoading(false);
    } catch (err) {
      console.error("Error loading packages", err);
    }
  };

  useEffect(() => {
    if (user?._id) fetchMyPackages();
  }, [user]);

  const handleEditClick = (pkg) => {
    setEditForm({
      id: pkg._id,
      name: pkg.name,
      location: pkg.location,
      price: pkg.price,
      description: pkg.description
    });
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", editForm.name);
    formData.append("location", editForm.location);
    formData.append("price", editForm.price);
    formData.append("description", editForm.description);
    if (editImage) formData.append("image", editImage);

    try {
      await API.put(`/packages/${editForm.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Package updated successfully!");
      setIsEditing(false);
      fetchMyPackages(); 
    } catch (err) {
      alert("Update failed.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        await API.delete(`/packages/${id}`);
        fetchMyPackages();
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  return (
    <div className="business-wrapper">
      <div className="glass-container animate-slide-up" style={{maxWidth: '1100px', width: '95%'}}>
        <h2 className="page-title">My Travel Services</h2>
        
        {loading ? <p>Loading packages...</p> : (
          <div className="table-responsive">
            <table className="package-table">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map(pkg => (
                  <tr key={pkg._id}>
                    <td>
                      <img src={`http://localhost:5000${pkg.image}`} alt="pkg" 
                        style={{width: '60px', height: '40px', borderRadius: '5px', objectFit: 'cover'}} />
                    </td>
                    <td>{pkg.name}</td>
                    <td>{pkg.location}</td>
                    <td><span className="price-tag">${pkg.price}</span></td>
                    <td>
                      <button className="tool-btn edit-btn" style={{marginRight: '8px'}} 
                        onClick={() => handleEditClick(pkg)}>Edit</button>
                      <button className="tool-btn delete-btn" style={{padding: '5px 12px'}} 
                        onClick={() => handleDelete(pkg._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {packages.length === 0 && <p style={{textAlign: 'center', marginTop: '20px'}}>No packages posted yet.</p>}
          </div>
        )}
      </div>

      {isEditing && (
        <div className="edit-modal-overlay">
          <div className="glass-container edit-modal-content">
            <h3 className="page-title" style={{fontSize: '1.5rem'}}>Edit Package</h3>
            <form onSubmit={handleUpdate}>
              <input className="input-field" value={editForm.name} placeholder="Name" 
                onChange={e => setEditForm({...editForm, name: e.target.value})} required />
              
              <input className="input-field" value={editForm.location} placeholder="Location" 
                onChange={e => setEditForm({...editForm, location: e.target.value})} required />
              
              <input className="input-field" type="number" value={editForm.price} placeholder="Price" 
                onChange={e => setEditForm({...editForm, price: e.target.value})} required />
              
              <textarea className="input-field" value={editForm.description} placeholder="Description" rows="4"
                onChange={e => setEditForm({...editForm, description: e.target.value})} required />
              
              <label style={{fontSize: '0.8rem', color: '#00f2fe'}}>Change Image (Optional):</label>
              <input type="file" className="input-field" onChange={e => setEditImage(e.target.files[0])} />
              
              <div style={{display: 'flex', gap: '10px'}}>
                <button type="submit" className="btn-explore" style={{flex: 1}}>Update</button>
                <button type="button" className="logout" style={{flex: 1}} onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}