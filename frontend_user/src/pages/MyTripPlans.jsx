import React, { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "./styles/mytripplans.css";

export default function MyTripPlans() {
  const { user } = useContext(AuthContext);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null); 

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await API.get(`/ai/user/${user._id || user.id}`);
        setTrips(res.data);
      } catch (err) {
        console.error("Failed to fetch trips");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchTrips();
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        await API.delete(`/ai/${id}`);
        setTrips(trips.filter(trip => trip._id !== id));
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  if (loading) return <div className="loader">Loading your adventures...</div>;

  return (
    <div className={`saved-trips-container ${selectedTrip ? "blur-bg" : ""}`}>
      <div className="trips-header">
        <h1>My Saved Adventures 🌍</h1>
        <p>Explore your AI-generated travel plans</p>
      </div>

      <div className="trips-grid">
        {trips.length > 0 ? (
          trips.map((trip) => (
            <div key={trip._id} className="trip-card animate-in">
              <div className="trip-card-top">
                <span className="date-tag">{new Date(trip.createdAt).toLocaleDateString()}</span>
                <h3>{trip.tripTitle}</h3>
              </div>
              
              <div className="trip-details-row">
                <span>💰 {trip.budget}</span>
                <span>📅 {trip.days} Days</span>
                <span>🚗 {trip.transport}</span>
              </div>

              <div className="plan-description-box">
                <p>{trip.fullPlanDescription.substring(0, 150)}...</p>
              </div>

              <div className="card-actions">
                <button className="view-btn" onClick={() => setSelectedTrip(trip)}>Full View</button>
                <button className="del-btn" onClick={() => handleDelete(trip._id)}>🗑️</button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-trips">
            <p>You haven't saved any plans yet.</p>
            <button onClick={() => window.location.href='/planner'}>Create Now</button>
          </div>
        )}
      </div>

      {/* --- MODAL POPUP SECTION --- */}
      {selectedTrip && (
        <div className="modal-overlay" onClick={() => setSelectedTrip(null)}>
          <div className="modal-content animate-pop" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedTrip(null)}>&times;</button>
            
            <div className="modal-header">
              <h2>{selectedTrip.tripTitle}</h2>
              <div className="modal-badges">
                <span>💰 {selectedTrip.budget}</span>
                <span>📅 {selectedTrip.days} Days</span>
                <span>🚗 {selectedTrip.transport}</span>
              </div>
            </div>

            <div className="modal-body">
              <h4>Full Itinerary Description</h4>
              <p className="full-desc">{selectedTrip.fullPlanDescription}</p>
            </div>

            <div className="modal-footer">
               <button className="primary-btn" onClick={() => window.print()}>Download as PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}