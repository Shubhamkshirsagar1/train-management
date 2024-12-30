const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const setupRoutes = require("./routes");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const serverless = require("serverless-http");

const PORT = process.env.PORT;
console.log(PORT);

require("./databaseConnection");

setupRoutes(app);

app.get("/", (req, res) => {
  console.log("Inside routes");
  return res.json({
    healthly: true,
  });
});

app.listen(8080, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = serverless(app);
