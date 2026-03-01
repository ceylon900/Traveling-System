const Booking = require("../models/Booking");
const mongoose = require("mongoose");


exports.createBooking = async (req, res) => {
  try {
    const { packageId, startDate, endDate } = req.body;

    const existingBooking = await Booking.findOne({
      packageId,
      status: "Confirmed",
      $or: [
        { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }
      ]
    });

    if (existingBooking) {
      return res.status(400).json({ message: "Sorry, this package is already booked for the selected dates." });
    }

    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();
    
    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(500).json({ message: "Server error during booking", error: err.message });
  }
};

exports.checkAvailability = async (req, res) => {
  try {
    const { packageId, startDate, endDate } = req.query;
    const existing = await Booking.findOne({
      packageId,
      $or: [
        { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }
      ]
    });
    res.json({ available: !existing });
  } catch (err) {
    res.status(500).json({ message: "Error checking availability" });
  }
};

exports.getBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findById(id).populate('packageId');

        if (!booking) {
            return res.status(404).json({ message: "Booking record not found" });
        }

        res.status(200).json(booking);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.getMyBookings = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid or missing User ID" });
    }
    const bookings = await Booking.find({ 
      customerId: new mongoose.Types.ObjectId(userId) 
    })
    .populate("packageId")
    .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    console.error("Backend Error:", err); 
    res.status(500).json({ message: "Server error", error: err.message });
  }
};