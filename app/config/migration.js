const db = require("../../databaseConnection");

db.sequelize
  .sync({ alter: true, logging: console.log })
  .then(() => {
    console.log("Tables synchronized successfully.");
  })
  .catch((error) => {
    console.error("Error synchronizing tables:", error);
  });
