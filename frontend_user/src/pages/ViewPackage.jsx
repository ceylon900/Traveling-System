import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./styles/viewpackage.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function ViewPackage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Data States
  const [pkg, setPkg] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  // Review States
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  // Booking States
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [daysCount, setDaysCount] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchFullDetails = async () => {
      try {
        setLoading(true);
        const pkgRes = await API.get(`/packages/${id}`);
        setPkg(pkgRes.data);

        try {
          const bizRes = await API.get(`/business/package-info/${id}`);
          if (bizRes.data) setBusiness(bizRes.data);
        } catch (err) {
          console.warn("No business found.");
        }

        const revRes = await API.get(`/reviews/${id}`);
        setReviews(revRes.data);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFullDetails();
  }, [id]);

  // Booking Calculation & Availability Check
  useEffect(() => {
    if (startDate && endDate && pkg) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end >= start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setDaysCount(diffDays);
        setTotalPrice(diffDays * pkg.price);
        checkAvailability(startDate, endDate);
      } else {
        setDaysCount(0);
        setTotalPrice(0);
      }
    }
  }, [startDate, endDate, pkg]);

  const checkAvailability = async (start, end) => {
    try {
      const res = await API.get(`/bookings/check?packageId=${id}&startDate=${start}&endDate=${end}`);
      setIsAvailable(res.data.available);
    } catch (err) {
      console.error("Availability check failed");
    }
  };

  const handleBooking = async () => {
    if (!user) return alert("Please login to book this package!");
    setBookingLoading(true);
    try {
      const bookingData = {
        packageId: id,
        customerId: user._id,
        startDate,
        endDate,
        numberOfDays: daysCount,
        chargePerUnit: pkg.price,
        totalCharge: totalPrice,
      };
      const res = await API.post("/bookings", bookingData);
      alert("Booking saved! Redirecting to payment...");
      navigate(`/payment/${res.data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed.");
    } finally {
      setBookingLoading(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to review!");
    try {
      const res = await API.post("/reviews", {
        packageId: id,
        userId: user._id,
        userName: user.name || "Guest",
        rating,
        comment,
      });
      setReviews([res.data, ...reviews]);
      setComment("");
      alert("Review posted! 🎉");
    } catch (err) {
      alert("Error posting review.");
    }
  };

  const handleReaction = async (reviewId, type) => {
    if (!user) return alert("Please login to react!");
    try {
      const res = await API.post("/reviews/reaction", { reviewId, userId: user._id, type });
      setReviews(reviews.map((r) => (r._id === reviewId ? res.data : r)));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading-screen">✨ Loading Experience...</div>;
  if (!pkg) return <div className="error-screen">Package not found!</div>;

  return (
    <div className="view-container">
      {/* Hero Section */}
      <section 
        className="pkg-hero" 
        style={{ backgroundImage: `linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.1) 50%, rgba(0,0,0,0.1) 100%), url(http://localhost:5000${pkg.image})` }}
      >
        <div className="hero-content">
          <span className="cat-badge">{pkg.category?.name || "Tour"}</span>
          <h1>{pkg.name}</h1>
          <div className="hero-meta">
            <span>📍 {pkg.location}</span>
            <span className="price-tag">Rs. {pkg.price} / day</span>
          </div>
        </div>
      </section>

      <div className="view-content-grid">
        <div className="left-column">
          
          {/* 1. About Section */}
          <div className="details-card">
            <h2>About this Journey</h2>
            <p className="description-text">{pkg.description}</p>
          </div>

          {/* 2. BOOKING SECTION (New) */}
          <div className="booking-card animate-in">
            <h3>📅 Reserve Your Spot</h3>
            <div className="booking-form-grid">
              <div className="date-input-group">
                <label>Booking-Start-Day</label>
                <input 
                  type="date" 
                  min={new Date().toISOString().split("T")[0]} 
                  onChange={(e) => setStartDate(e.target.value)} 
                />
              </div>
              <div className="date-input-group">
                <label>Booking-End_Day</label>
                <input 
                  type="date" 
                  min={startDate || new Date().toISOString().split("T")[0]} 
                  onChange={(e) => setEndDate(e.target.value)} 
                />
              </div>
            </div>

            {daysCount > 0 && (
              <div className="price-summary animate-pop">
                <div className="price-row">
                  <span>Price per day</span>
                  <span>Rs. {pkg.price}</span>
                </div>
                <div className="price-row">
                  <span>Total Duration</span>
                  <span>{daysCount} Days</span>
                </div>
                <div className="total-row">
                  <span>Total Amount</span>
                  <span>Rs. {totalPrice}</span>
                </div>
                {!isAvailable && <p className="error-msg">❌ These dates are already booked.</p>}
              </div>
            )}

            <button 
              className="book-now-btn" 
              disabled={!startDate || !endDate || !isAvailable || bookingLoading}
              onClick={handleBooking}
            >
              {bookingLoading ? "Processing..." : isAvailable ? "Confirm & Pay Now" : "Unavailable"}
            </button>
          </div>

          {/* 3. Business Info & Map */}
          {business && (
            <div className="business-info-card">
              <div className="biz-header">
                <h3>Provided by {business.name}</h3>
                <span className="biz-badge">{business.category}</span>
              </div>
              <p className="biz-desc">{business.description}</p>
              <div className="biz-contact-grid">
                <span>📞 {business.contact}</span>
                <span>📧 {business.email}</span>
                <span className="full-addr">🏠 {business.address}</span>
              </div>

              {business.latitude && business.longitude && (
                <div className="map-wrapper">
                  <h4>Location on Map</h4>
                  <MapContainer 
                    center={[business.latitude, business.longitude]} 
                    zoom={15} 
                    className="leaflet-map-container"
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[business.latitude, business.longitude]}>
                      <Popup><strong>{business.name}</strong><br/>{business.address}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. Right Column: Reviews */}
        <div className="reviews-card">
          <h3>Community Reviews ({reviews.length})</h3>

          {user ? (
            <form onSubmit={submitReview} className="modern-rev-form">
              <div className="stars">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span key={n} onClick={() => setRating(n)} className={rating >= n ? "star active" : "star"}>★</span>
                ))}
              </div>
              <textarea 
                placeholder="Share your experience..." 
                value={comment} 
                onChange={(e) => setComment(e.target.value)} 
                required 
              />
              <button type="submit" className="submit-rev-btn">Post Review</button>
            </form>
          ) : (
            <p className="login-hint">Please login to write a review.</p>
          )}

          <div className="reviews-list">
            {reviews.map((rev) => (
              <div key={rev._id} className="single-review animate-in">
                <div className="rev-user">
                  <div className="avatar">{rev.userName?.charAt(0)}</div>
                  <strong>{rev.userName}</strong>
                  <div className="rev-stars">{"⭐".repeat(rev.rating)}</div>
                </div>
                <p>{rev.comment}</p>
                <div className="rev-actions">
                  <button onClick={() => handleReaction(rev._id, "likes")}>👍 {rev.likes?.length || 0}</button>
                  <button onClick={() => handleReaction(rev._id, "dislikes")}>👎 {rev.dislikes?.length || 0}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}