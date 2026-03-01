import React, { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "./styles/sellerBookings.css";

export default function SellerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlip, setSelectedSlip] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    if (!user?._id) return;
    try {
      const res = await API.get(`/seller-bookings/all?sellerId=${user._id}`);
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this as ${newStatus}?`)) return;
    try {
      await API.patch(`/seller-bookings/update/${id}`, { status: newStatus });
      fetchBookings(); 
    } catch (err) {
      alert("Status update failed!");
    }
  };

  const viewSlip = async (bookingId) => {
    try {
      const res = await API.get(`/seller-bookings/slip/${bookingId}`);
      setSelectedSlip(res.data);
    } catch (err) {
      alert("Slip detail is not available for this booking.");
    }
  };

  if (loading) return (
    <div className="loader-container">
      <div className="custom-loader"></div>
      <p>Syncing your business data...</p>
    </div>
  );

  return (
    <div className="seller-dashboard">
      <div className="dashboard-hero">
        <div className="hero-content">
          <h1>Welcome, {user?.username || "Business Partner"}! 👋</h1>
          <p>You have <strong>{bookings.filter(b => b.status === "Pending").length}</strong> pending requests to handle.</p>
        </div>
      </div>

      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-val">{bookings.length}</span>
          <span className="stat-label">Total Orders</span>
        </div>
        <div className="stat-item">
          <span className="stat-val text-green">
            {bookings.filter(b => b.status === "Confirmed").length}
          </span>
          <span className="stat-label">Confirmed</span>
        </div>
        <div className="stat-item">
          <span className="stat-val text-blue">
            LKR {(bookings.filter(b => b.paymentStatus === "Completed").reduce((acc, curr) => acc + curr.totalCharge, 0)).toLocaleString()}
          </span>
          <span className="stat-label">Total Revenue</span>
        </div>
      </div>

      <div className="glass-table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Package</th>
              <th>Date Range</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Booking Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((b) => (
                <tr key={b._id} className="hover-row">
                  <td className="user-info-cell">
                    <div className="avatar-sm">{b.customerId?.username?.charAt(0).toUpperCase()}</div>
                    <div>
                      <span className="name-txt">{b.customerId?.username}</span>
                      <span className="email-txt">{b.customerId?.email}</span>
                    </div>
                  </td>
                  <td><span className="pkg-badge">{b.packageId?.name}</span></td>
                  <td>
                    <div className="date-stack">
                      <span>{new Date(b.startDate).toLocaleDateString()}</span>
                      <small>to {new Date(b.endDate).toLocaleDateString()}</small>
                    </div>
                  </td>
                  <td className="price-bold">Rs. {b.totalCharge.toLocaleString()}</td>
                  
                  <td>
                    <span className={`pay-status-tag ${b.paymentStatus?.toLowerCase()}`}>
                      {b.paymentStatus === "Completed" ? "Paid ✅" : "Pending ⏳"}
                    </span>
                  </td>

                  <td>
                    <div className={`status-indicator ${b.status.toLowerCase()}`}>
                      {b.status}
                    </div>
                  </td>
                  
                  <td>
                    <div className="action-group">
                      {b.status === "Pending" ? (
                        <>
                          <button className="icon-btn check" onClick={() => handleStatusUpdate(b._id, "Confirmed")}>✔</button>
                          <button className="icon-btn cross" onClick={() => handleStatusUpdate(b._id, "Cancelled")}>✖</button>
                        </>
                      ) : b.status === "Confirmed" ? (
                        <button className="slip-btn-modern" onClick={() => viewSlip(b._id)}>View Invoice</button>
                      ) : (
                        <span className="disabled-txt">N/A</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "40px" }}>No bookings found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedSlip && (
        <div className="modal-overlay blur" onClick={() => setSelectedSlip(null)}>
          <div className="invoice-card" onClick={(e) => e.stopPropagation()}>
            <div className="invoice-header">
              <div className="brand">TRAVEL<span>SYSTEM</span></div>
              <div className="invoice-title">OFFICIAL INVOICE</div>
            </div>
            
            <div className="invoice-body">
              <div className="invoice-section">
                <label>Customer Details</label>
                <p>{selectedSlip.customerName}</p>
              </div>
              <div className="invoice-grid">
                <div><label>Travel Package</label><p>{selectedSlip.packageName}</p></div>
                <div><label>Total Amount</label><p className="amt">Rs. {selectedSlip.amount?.toLocaleString()}</p></div>
                <div><label>Duration</label><p>{new Date(selectedSlip.startDate).toLocaleDateString()} - {new Date(selectedSlip.endDate).toLocaleDateString()}</p></div>
                <div><label>Receipt No</label><p>#{selectedSlip._id.slice(-6).toUpperCase()}</p></div>
              </div>
            </div>
            <div className="invoice-footer">
              <button className="print-action" onClick={() => window.print()}>Print Receipt</button>
              <button className="close-action" onClick={() => setSelectedSlip(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}