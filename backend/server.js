const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // IMPORTANT

// Routes
app.use("/api/auth", authRoutes);
const qrRoutes = require("./routes/qrRoutes");
app.use("/api/qr", qrRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
