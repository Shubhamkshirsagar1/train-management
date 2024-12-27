const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DATABASE_DATABASE,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: process.env.DATABASE_DIALECT,
    pool: {
      max: 10,
      min: 0,
      acquire: 100000,
      idle: 10000,
    },
    logging: console.log,
  }
);

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

module.exports = db;
