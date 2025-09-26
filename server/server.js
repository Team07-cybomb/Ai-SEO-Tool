const express = require("express");
const cors = require("cors");
const path = require("path");
const next = require("next");
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const auditRoutes = require("./routes/auditRoutes");
const adminRoutes = require("./routes/adminRoutes");
const pricingRoutes = require("./routes/pricingRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const keywordRoutes = require("./routes/keyWordRoutes");

require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });

console.log("JWT_SECRET loaded:", process.env.JWT_SECRET);

const dev = process.env.NODE_ENV !== "production";
const appNext = next({ dev });
const handle = appNext.getRequestHandler();

const PORT = process.env.PORT || 3000;

appNext.prepare().then(() => {
  const app = express();

  // Body parser
  app.use(express.json());

  // CORS
  app.use(
    cors({
      origin: ["http://localhost:3000"], // ✅ frontend + prod
      credentials: true,
    })
  );

  // Connect to MongoDB
  connectDB();

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date() });
  });

  app.get("/api/key-checker", (req, res) => {
  res.json({ success: true, message: "Key is valid" });
});

  // Routes
  app.use("/api", authRoutes);
  app.use("/api", auditRoutes);
  app.use("/api", adminRoutes);
  app.use("/api", pricingRoutes);
  app.use("/api", subscriptionRoutes);
  app.use("/api", keywordRoutes);

  // Let Next.js handle everything else
  app.all("*", (req, res) => {
    return handle(req, res);
  });

  app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`🚀 Server + Next.js running at http://localhost:${PORT}`);
  });
});
