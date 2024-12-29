const express = require("express");
const authRoutes = require("./app/routes/auth.route");
const seatRoutes = require("./app/routes/seat.route");

function setupRoutes(app) {
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/seats", seatRoutes);
}

module.exports = setupRoutes;
