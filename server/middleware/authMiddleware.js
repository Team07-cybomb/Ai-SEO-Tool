// server/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized - token missing" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");
    req.adminId = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Forbidden - invalid token" });
  }
};

module.exports = { verifyAdmin };
