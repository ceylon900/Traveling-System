const express = require("express");
const router = express.Router();
const { createBooking, checkAvailability, getBookingById, getMyBookings } = require("../controllers/bookingController");

router.post("/", createBooking);
router.get("/check", checkAvailability);
router.get("/my-bookings", getMyBookings);
router.get("/:id", getBookingById);


module.exports = router;