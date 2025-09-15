const User = require("../models/User");
const connectDB = require("../config/db");

exports.signup = async (req, res) => {
  await connectDB();
  const { name, email, phone, password } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = new User({ name, email, phone, password });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  await connectDB();
  const { email, phone, emailOrPhone, password } = req.body;
  try {
    const identifier = emailOrPhone || email || phone;
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }]
    });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.password !== password)
      return res.status(400).json({ message: "Wrong password" });
    res.json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
