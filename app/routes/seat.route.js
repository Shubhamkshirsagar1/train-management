const express = require("express");
const router = express.Router();
const seatController = require("../controllers/seat.controller");
const { protect, authorize } = require("../middlewares/auth");

// Routes for seat management
router.get("/", seatController.getAllSeats);
router.get("/user-seats", protect, seatController.getUserSeats);
router.post("/reserve", protect, seatController.reserveSeats);
router.post("/cancel", protect, seatController.cancelReservation);
// router.post("/reset", protect, authorize(["admin"]), seatController.resetSeats);
router.get("/booked-users", protect, authorize(["admin"]), seatController.getBookedUsers);
router.post("/reset-seats", protect, authorize(["admin"]), seatController.resetAllSeats);

module.exports = router;
