const express = require("express");
const nodemailer = require("nodemailer");
const { connectDB } = require("../lib/mongodb.js");
const ContactMessage = require("../models/contactMessage.js");

const router = express.Router();

router.post("/contact", async (req, res) => {
  try {
    const { subject, message, priority, type } = req.body;

    await connectDB();
    await ContactMessage.create({ subject, message, priority, type });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // smtp.hostinger.com
      port: process.env.SMTP_PORT, // 465
      secure: true, // true for port 465, false for 587
      auth: {
        user: process.env.SMTP_USER, // forms@cybomb.com
        pass: process.env.SMTP_PASS, // your password
      },
    });


    await transporter.sendMail({
      from: `"RankSEO Support" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: `[${priority.toUpperCase()}] ${subject}`,
      text: `Type: ${type}\nPriority: ${priority}\n\n${message}`,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

module.exports = router;
