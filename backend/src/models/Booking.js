const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    numberOfDays: { type: Number, required: true },
    chargePerUnit: { type: Number, required: true },
    totalCharge: { type: Number, required: true },
    status: { type: String, default: "Pending" }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);