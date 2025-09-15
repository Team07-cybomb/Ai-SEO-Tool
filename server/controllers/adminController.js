// server/controllers/adminController.js
const Admin = require("../models/Admin");
const Audit = require("../models/Audit");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

exports.createAdmin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email & password required" });

  try {
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: "Admin already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const admin = new Admin({ email, password: hashed });
    await admin.save();

    return res.status(201).json({ message: "Admin created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email & password required" });

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: "1d" });
    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Protected: returns dashboard data
exports.getDashboardData = async (req, res) => {
  try {
    const audits = await Audit.find().sort({ timestamp: -1 }).lean();

    const totalLogins = audits.length;
    const uniqueUsers = new Set(audits.map((a) => a.userEmail).filter(Boolean)).size;

    return res.json({ totalLogins, uniqueUsers, auditData: audits });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
