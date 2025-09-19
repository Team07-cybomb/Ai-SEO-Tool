const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyUser = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized - token missing" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");

    // ✅ Ensure correct user structure in JWT
    if (!decoded?.user?.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.user = { _id: decoded.user.id, role: decoded.user.role || "user" };
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(403).json({ message: "Forbidden - invalid token" });
  }
};

module.exports = { verifyUser };
