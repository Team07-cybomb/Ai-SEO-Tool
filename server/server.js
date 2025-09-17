const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
// const adminRoutes = require("./routes/adminRoutes");
//const pricingRoutes = require("./routes/pricingRoutes");
//const auditRoutes = require("./routes/auditRoutes");

require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });

console.log("JWT_SECRET loaded:", process.env.JWT_SECRET);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Use the authentication routes
app.use("/api", authRoutes);

// app.use("/api", adminRoutes);
//app.use("/api/pricing", pricingRoutes);
//app.use("/api", auditRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
