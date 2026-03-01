import React, { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext"; 
import "./styles/tripplanner.css";

export default function TripPlanner() {
  const { user } = useContext(AuthContext); 
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    budget: "", days: "", transport: "Private Car", members: "1", keywords: ""
  });
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await API.post("/ai/generate-plan", formData);
      setPlan(res.data);
      setStep(5);
    } catch (err) {
      alert("AI Plan generation failed!");
    } finally {
      setLoading(false);
    }
  };

const handleSaveTrip = async () => {
    if (!user) {
      alert("Please login to save your trip plan!");
      return;
    }

    setSaveLoading(true);
    try {
      const fullDescription = plan.itinerary.map(day => 
        `Day ${day.day}: ${day.destination} - ${day.activities.join(", ")}. Stay: ${day.accommodation}`
      ).join("\n");

      await API.post("/ai/save", {
        userId: user._id || user.id,
        planData: {
          ...plan,
          fullDescription: fullDescription 
        },
        formData: formData
      });
      alert("Success! Full trip plan description saved. ✈️");
    } catch (err) {
      alert("Failed to save the trip.");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="planner-hero">
      {/* Background Decor */}
      <div className="circle-bg circle-1"></div>
      <div className="circle-bg circle-2"></div>

      <div className="main-card">
        {step < 5 && (
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${(step / 4) * 100}%` }}></div>
          </div>
        )}

        {/* STEP 1: Budget */}
        {step === 1 && (
          <div className="step-box animate-in">
            <span className="icon-badge">💰</span>
            <h2>What's your total budget?</h2>
            <p>Enter the amount you plan to spend for the whole trip in LKR</p>
            <input 
              name="budget" 
              type="text" 
              placeholder="e.g. 50,000 LKR" 
              value={formData.budget} 
              onChange={handleChange} 
              className="giant-input"
            />
            <button className="primary-btn" onClick={() => setStep(2)} disabled={!formData.budget}>
              Next: Trip Duration ➔
            </button>
          </div>
        )}

        {/* STEP 2: Days */}
        {step === 2 && (
          <div className="step-box animate-in">
            <span className="icon-badge">📅</span>
            <h2>How many days?</h2>
            <input 
              name="days" 
              type="number" 
              placeholder="Number of days" 
              value={formData.days} 
              onChange={handleChange} 
              className="giant-input"
            />
            <div className="flex-btns">
              <button className="sec-btn" onClick={() => setStep(1)}>Back</button>
              <button className="primary-btn" onClick={() => setStep(3)} disabled={!formData.days}>Next ➔</button>
            </div>
          </div>
        )}

        {/* STEP 3: Travel Details */}
        {step === 3 && (
          <div className="step-box animate-in">
            <span className="icon-badge">🚗</span>
            <h2>Travel Details</h2>
            <p>Who is coming and how do you travel?</p>
            <div className="input-row">
                <input 
                  name="members" 
                  type="number" 
                  value={formData.members}
                  placeholder="Travelers" 
                  onChange={handleChange} 
                  className="giant-input half" 
                />
                <select name="transport" value={formData.transport} onChange={handleChange} className="giant-input half">
                  <option value="Private Car">Private Car</option>
                  <option value="Public Transport">Public Transport</option>
                  <option value="Tuk Tuk">Tuk Tuk</option>
                </select>
            </div>
            <div className="flex-btns">
              <button className="sec-btn" onClick={() => setStep(2)}>Back</button>
              <button className="primary-btn" onClick={() => setStep(4)}>Last Step ➔</button>
            </div>
          </div>
        )}

        {/* STEP 4: Personalize */}
        {step === 4 && (
          <div className="step-box animate-in">
            <span className="icon-badge">🏝️</span>
            <h2>Personalize your trip</h2>
            <textarea 
              name="keywords" 
              placeholder="e.g. Surfing, Tea estates, Ancient temples..." 
              value={formData.keywords}
              onChange={handleChange} 
              className="giant-textarea"
            />
            <div className="flex-btns">
              <button className="sec-btn" onClick={() => setStep(3)}>Back</button>
              <button className="generate-btn" onClick={handleSubmit} disabled={loading}>
                {loading ? "AI is Thinking..." : "Generate Magic Trip ✨"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: View Result & Save Option */}
        {step === 5 && plan && (
          <div className="itinerary-view animate-up">
            <div className="header-view">
                <h1>{plan.tripTitle}</h1>
                <span className="total-badge">Total Cost: {plan.totalEstimatedCost}</span>
            </div>
            
            <div className="timeline">
              {plan.itinerary.map((day, i) => (
                <div key={i} className="timeline-item">
                  <div className="time-line-day">Day {day.day}</div>
                  <div className="timeline-content">
                    <h4>📍 {day.destination}</h4>
                    <p className="act-list">{day.activities.join(" • ")}</p>
                    <div className="hotel-info">🏨 Stay at: {day.accommodation}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons for Saving and Restarting */}
            <div className="flex-btns" style={{ marginTop: "30px", gap: "15px" }}>
              <button className="reset-btn" onClick={() => setStep(1)}>
                Plan Another Trip
              </button>
              
              <button 
                className="save-btn-ai" 
                onClick={handleSaveTrip} 
                disabled={saveLoading}
              >
                {saveLoading ? "Saving..." : "Save to My Trips 📁"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}