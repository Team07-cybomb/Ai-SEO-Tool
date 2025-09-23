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

    // ✅ Fix: use decoded.user.id instead of decoded.id
    req.user = {
  _id: decoded.user?.id || decoded.id,
  role: decoded.user?.role || decoded.role || "user",
};

    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(403).json({ message: "Forbidden - invalid token" });
  }
};

module.exports = { verifyUser };
