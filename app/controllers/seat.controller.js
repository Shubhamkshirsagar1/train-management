const db = require("../../databaseConnection");
const authorizeUser = require("../utils/authorizeUser");

exports.reserveSeats = async (req, res) => {
  const { seat_count } = req.body;

  const userId = authorizeUser(req);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (seat_count < 1 || seat_count > 7) {
    return res
      .status(400)
      .json({ message: "You can book between 1 and 7 seats only." });
  }

  try {
    const availableSeats = await db.Seat.findAll({
      where: { status: "available" },
      order: [
        ["row", "ASC"],
        ["seat_number", "ASC"],
      ],
    });

    if (availableSeats.length < seat_count) {
      return res.status(400).json({ message: "Not enough seats available." });
    }

    const selectedSeats = availableSeats.slice(0, seat_count);
    const reservationPromises = selectedSeats.map((seat) =>
      db.Reservation.create({ user_id: userId, seat_number: seat.seat_number })
    );

    const updatePromises = selectedSeats.map((seat) =>
      seat.update({ status: "reserved" })
    );

    await Promise.all([...reservationPromises, ...updatePromises]);
    res
      .status(200)
      .json({ message: "Seats reserved successfully.", seats: selectedSeats });
  } catch (error) {
    res.status(500).json({ message: "Error reserving seats.", error });
  }
};

exports.cancelReservation = async (req, res) => {
  const { seat_number } = req.body;

  try {
    const userId = authorizeUser(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const reservation = await db.Reservation.findOne({
      where: { user_id: userId, seat_number },
    });

    if (!reservation) {
      return res.status(400).json({ message: "Reservation not found." });
    }

    await db.Seat.update({ status: "available" }, { where: { seat_number } });
    await reservation.destroy();

    res.status(200).json({ message: "Reservation cancelled successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling reservation.", error });
  }
};

exports.resetSeats = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden: Admin access required." });
    }

    await db.Seat.update({ status: "available" }, { where: {} });
    await db.Reservation.destroy({ where: {} });

    res.status(200).json({ message: "All seats have been reset." });
  } catch (error) {
    res.status(500).json({ message: "Error resetting seats.", error });
  }
};

exports.getAllSeats = async (req, res) => {
  try {
    const seats = await db.Seat.findAll();
    res.status(200).json(seats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching seats", error });
  }
};

exports.getUserSeats = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from the authenticated request

    // Fetch seats reserved by the user
    const reservations = await db.Reservation.findAll({
      where: { user_id: userId },
      include: [
        {
          model: db.Seat,
          attributes: ["seat_number", "row", "status"], // Include seat details
        },
      ],
    });

    if (reservations.length === 0) {
      return res
        .status(404)
        .json({ message: "No seats reserved by the user." });
    }

    // Map the reservations to return only relevant details
    const userSeats = reservations.map((reservation) => ({
      seat_number: reservation.Seat.seat_number,
      row: reservation.Seat.row,
      status: reservation.Seat.status,
    }));

    res.status(200).json(userSeats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user seats.", error });
  }
};
