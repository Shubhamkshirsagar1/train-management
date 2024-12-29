const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

// const sequelize = new Sequelize(
//   process.env.DATABASE_DATABASE,
//   process.env.DATABASE_USERNAME,
//   process.env.DATABASE_PASSWORD,
//   {
//     host: process.env.DATABASE_URL,
//     port: process.env.DATABASE_PORT,
//     dialect: process.env.DATABASE_DIALECT || "postgres",
//     pool: {
//       max: 10,
//       min: 0,
//       acquire: 100000,
//       idle: 10000,
//     },
//     logging: console.log,
//   }
// );

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 100000,
    idle: 10000,
  },
  logging: console.log,
});

const db = {};

const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000;

async function connectWithRetry(retries = MAX_RETRIES) {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
    if (retries > 0) {
      console.log(`Retrying connection in ${RETRY_INTERVAL / 1000} seconds...`);
      setTimeout(() => connectWithRetry(retries - 1), RETRY_INTERVAL);
    } else {
      console.error("Max retries reached. Could not connect to the database.");
    }
  }
}

connectWithRetry();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

/* Import Models */
db.User = require("./app/models/user.model")(sequelize, DataTypes);
db.Seat = require("./app/models/seat.model")(sequelize, DataTypes);
db.Reservation = require("./app/models/reservation.model")(
  sequelize,
  DataTypes
);

/* Define Relationships */
db.User.hasMany(db.Reservation, { foreignKey: "user_id" });
db.Reservation.belongsTo(db.User, { foreignKey: "user_id" });

db.Seat.hasMany(db.Reservation, {
  foreignKey: "seat_number",
  sourceKey: "seat_number",
});
db.Reservation.belongsTo(db.Seat, {
  foreignKey: "seat_number",
  targetKey: "seat_number",
});

module.exports = db;
