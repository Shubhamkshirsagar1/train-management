const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../databaseConnection");
require("dotenv").config();

exports.signup = async (req, res) => {
  const { first_name, last_name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role,
    });
    res
      .status(201)
      .json({ success: true, message: "User registered successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error registering user.", error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Include role in the token
    const token = jwt.sign(
      { id: user.id, role: user.role }, // Include role here
      process.env.JWT_SECRET,
      { expiresIn: "48h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};
