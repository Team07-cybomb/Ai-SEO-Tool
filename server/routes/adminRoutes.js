const express = require("express");
const router = express.Router();
const { createAdmin, adminLogin, getDashboardData } = require("../controllers/adminController");
const { verifyAdmin } = require("../middleware/authMiddleware");
 
router.post("/create-admin", createAdmin); // use Thunder Client once to create initial admin
router.post("/admin/login", adminLogin);
router.get("/admin/dashboard", verifyAdmin, getDashboardData);
 
module.exports = router; 