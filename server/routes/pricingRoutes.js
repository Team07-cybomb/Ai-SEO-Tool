const express = require("express");
const { createPayment, checkProStatus } = require("../controllers/pricingController");

const router = express.Router();

// Create payment & activate Pro
router.post("/create", createPayment);

// Check expiry and deactivate Pro if expired
router.get("/check-pro-status", checkProStatus);

module.exports = router;
