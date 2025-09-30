const express = require("express");
const nodemailer = require("nodemailer");
const { connectDB } = require("../lib/mongodb.js");
const ContactMessage = require("../models/contactMessage.js");
const auth = require("../middleware/auth"); // ✅ import your existing middleware

const router = express.Router();

router.post("/contact", auth, async (req, res) => {
  try {
    const { subject, message, priority, type } = req.body;

    await connectDB();
    await ContactMessage.create({
      subject,
      message,
      priority,
      type,
      user: req.user.id, // ✅ save sender in DB
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"RankSEO Support" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: req.user.email, // ✅ logged-in user's email
      subject: `[${priority.toUpperCase()}] ${subject}`,
      text: `From: ${req.user.name} <${req.user.email}>\nType: ${type}\nPriority: ${priority}\n\n${message}`,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

module.exports = router;
