/**
 * app.js
 *
 * Express application configuration for CodeQuest API.
 */

const express = require("express");
const cors = require("cors");
const healthRoutes = require("./routes/healthRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

const clientOrigin = process.env.CLIENT_ORIGIN || "*";

// Middleware
app.use(
  cors({
    origin: clientOrigin,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Mount API routes
app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Root informational endpoint
app.get("/", (req, res) => {
  res.json({
    name: "CodeQuest API",
    version: "1.0.0",
    status: "active",
    endpoints: {
      health: "/api/health",
      databaseHealth: "/api/health/db",
      auth: "/api/auth",
      users: "/api/users",
    },
  });
});

// 404 Catch-all handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "API endpoint not found",
  });
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("[Server Error]", err.stack || err.message);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

module.exports = app;
