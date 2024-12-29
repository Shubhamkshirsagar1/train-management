const db = require("../databaseConnection");

const seedSeats = async () => {
  try {
    const seats = [];
    for (let row = 1; row <= 12; row++) {
      const seatCount = row === 12 ? 3 : 7;
      for (let seat = 1; seat <= seatCount; seat++) {
        seats.push({
          seat_number: (row - 1) * 7 + seat,
          row,
        });
      }
    }
    await db.Seat.bulkCreate(seats);
    console.log("Seats seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding seats:", error);
    process.exit(1);
  }
};

seedSeats();
