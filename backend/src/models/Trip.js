const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  tripTitle: String,
  totalEstimatedCost: String,
  fullPlanDescription: String, 
  budget: String,
  days: Number,
  members: Number,
  transport: String
}, { timestamps: true });

module.exports = mongoose.model("Trip", tripSchema);