const express = require("express");
const router = express.Router();
const { 
  createAdmin, 
  adminLogin, 
  getDashboardData,
  getAllUsers 
} = require("../controllers/adminController");
const { verifyAdmin } = require("../middleware/authMiddleware");

router.post("/create-admin", createAdmin);
router.post("/admin/login", adminLogin);
router.get("/admin/dashboard", verifyAdmin, getDashboardData);
router.get("/admin/users", verifyAdmin, getAllUsers);

module.exports = router;