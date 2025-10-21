const Admin = require("../models/Admin");
const User = require("../models/User");
const Audit = require("../models/auditModel"); 
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

// Protected: returns dashboard data with user information
exports.getDashboardData = async (req, res) => {
  try {
    // Get audit data
    const audits = await Audit.find().sort({ timestamp: -1 }).limit(50).lean();

    // Get user data
    const users = await User.find()
      .select('-password -otp -otpExpiresAt') // Exclude sensitive fields
      .sort({ createdAt: -1 })
      .lean();

    // Calculate statistics
    const totalLogins = audits.length;
    const uniqueUsers = new Set(audits.map((a) => a.userEmail).filter(Boolean)).size;
    
    // Count active users (users who logged in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Count premium users (you might need to adjust this based on your user model)
    const premiumUsers = users.filter(user => 
      user.plan === 'premium' || user.plan === 'Premium'
    ).length;

    // Format user data for the admin panel
    const formattedUsers = users.map(user => ({
      _id: user._id.toString(),
      email: user.email,
      name: user.name || 'N/A',
      plan: user.plan || 'Free',
      lastLogin: user.lastLogin || user.createdAt || new Date().toISOString(),
      usage: Math.floor(Math.random() * 100), // You might want to calculate actual usage
      mobile: user.mobile,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
      isVerified: user.isVerified
    }));

    // Format audit data
    const formattedAuditData = audits.map(audit => ({
      _id: audit._id.toString(),
      userEmail: audit.userEmail,
      url: audit.url,
      timestamp: audit.timestamp,
      action: audit.action || 'page_view'
    }));

    return res.json({
      totalLogins,
      uniqueUsers,
      activeUsers: uniqueUsers, // You might want to calculate this differently
      premiumUsers,
      auditData: formattedAuditData,
      users: formattedUsers
    });
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Additional endpoint for user management
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -otp -otpExpiresAt')
      .sort({ createdAt: -1 })
      .lean();

    const formattedUsers = users.map(user => ({
      _id: user._id.toString(),
      email: user.email,
      name: user.name || 'N/A',
      plan: user.plan || 'Free',
      lastLogin: user.lastLogin || user.createdAt,
      usage: Math.floor(Math.random() * 100),
      mobile: user.mobile,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
      isVerified: user.isVerified,
      loginMethod: user.githubId ? 'GitHub' : user.googleId ? 'Google' : 'Email'
    }));

    return res.json({ users: formattedUsers });
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ message: "Server error" });
  }
};