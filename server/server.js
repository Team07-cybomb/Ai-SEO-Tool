require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http"); // ⬅️ Add this
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// DB connect
connectDB();

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

// ✅ Root route to check backend
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// Routes
app.use("/api", authRoutes);

const PORT = process.env.PORT || 5000;

// ⬇️ Create HTTP server and set timeout
const server = http.createServer(app);

// default in Node is 2 minutes, increase to 5 minutes (300000 ms)
server.setTimeout(5 * 60 * 1000);

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
