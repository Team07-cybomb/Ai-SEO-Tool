const express = require("express");
const nodemailer = require("nodemailer");
const { connectDB } = require("../config/db.js");
const ContactMessage = require("../models/contactMessage.js");
const auth = require("../middleware/auth"); // ✅ your auth middleware

const router = express.Router();

router.post("/contact", auth, async (req, res) => {
  try {
    console.log("Received /contact request");
    console.log("Request body:", req.body);

    const { subject, message, priority, type } = req.body;

    // Validate input
    if (!subject || !message || !priority || !type) {
      console.error("Validation error: missing fields");
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    // Check if user exists from middleware
    if (!req.user || !req.user.id || !req.user.email) {
      console.error("Auth error: req.user is missing", req.user);
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    // Connect to DB
    await connectDB();
    console.log("MongoDB connected");

    // Create DB document
    let contactDoc;
    try {
      contactDoc = await ContactMessage.create({
        subject,
        message,
        priority,
        type,
        user: req.user.id,
      });
      console.log("Saved to DB:", contactDoc);
    } catch (dbErr) {
      console.error("DB save error:", dbErr);
      return res.status(500).json({ success: false, error: "DB save failed" });
    }

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send email
    try {
      await transporter.sendMail({
        from: `"RankSEO Support" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER,
        replyTo: req.user.email,
        subject: `[${priority.toUpperCase()}] ${subject}`,
        text: `From: ${req.user.name} <${req.user.email}>\nType: ${type}\nPriority: ${priority}\n\n${message}`,
      });
      console.log("Email sent successfully");
    } catch (mailErr) {
      console.error("Email send error:", mailErr);
      return res.status(500).json({ success: false, error: "Email send failed" });
    }

    res.json({ success: true, message: "Message saved and email sent" });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

module.exports = router;
