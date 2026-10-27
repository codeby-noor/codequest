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

// Trust reverse proxy headers (e.g. Vercel edge network)
app.set("trust proxy", 1);

// CORS configuration
const configuredOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map((o) => o.trim())
  : [];

const defaultAllowedOrigins = [
  "https://codequest-virid.vercel.app",
  "http://localhost",
  "http://localhost:3000",
  "http://localhost:5000",
  "http://127.0.0.1",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. serverless internal, curl, mobile)
      if (!origin) return callback(null, true);
      if (
        configuredOrigins.includes("*") ||
        configuredOrigins.includes(origin) ||
        defaultAllowedOrigins.includes(origin) ||
        origin === "http://localhost" ||
        origin === "http://127.0.0.1" ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:") ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Mount API routes with both /api prefix and root for maximum serverless compatibility
app.use("/api", healthRoutes);
app.use("/", healthRoutes);

app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

app.use("/api/users", userRoutes);
app.use("/users", userRoutes);

// Root informational endpoint
app.get(["/", "/api"], (req, res) => {
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

// 404 Catch-all handler for unmatched API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "API endpoint not found",
    message: "API endpoint not found",
  });
});

// Global error handler (never leaks stack traces in production)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("[Server Error]", err.stack || err.message);
  const status =
    err.status ||
    (err.message && err.message.toLowerCase().includes("database") ? 503 : 500);

  const message =
    status === 503
      ? "Database service unavailable. Cloud progress is saved locally."
      : status === 500 && process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message || "Internal server error";

  res.status(status).json({
    success: false,
    error: message,
    message: message,
  });
});

module.exports = app;
