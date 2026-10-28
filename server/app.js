/**
 * app.js
 *
 * Express application configuration for CodeQuest API.
 */

const express = require("express");
const cors = require("cors");
const securityHeaders = require("./middleware/securityHeadersMiddleware");
const { mongoSanitize } = require("./middleware/mongoSanitizeMiddleware");
const { captureServerException, sanitizeErrorData } = require("./services/errorMonitoring");
const healthRoutes = require("./routes/healthRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

const app = express();

// Trust reverse proxy headers (e.g. Vercel edge network)
app.set("trust proxy", 1);

// Attach standard HTTP security headers
app.use(securityHeaders);

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
    allowedHeaders: ["Content-Type", "Authorization", "x-test-rate-limit", "X-Test-Rate-Limit"],
    exposedHeaders: [
      "X-Content-Type-Options",
      "X-Frame-Options",
      "Referrer-Policy",
      "Permissions-Policy",
      "Strict-Transport-Security",
      "X-XSS-Protection",
      "Retry-After",
    ],
    credentials: true,
  })
);

// Enforce request body size limit to prevent Denial of Service via large payloads
app.use(express.json({ limit: "100kb" }));

// Sanitize user inputs against NoSQL injection ($ and . operator tampering)
app.use(mongoSanitize);

// Mount API routes with both /api prefix and root for maximum serverless compatibility
app.use("/api", healthRoutes);
app.use("/", healthRoutes);

app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

app.use("/api/users", userRoutes);
app.use("/users", userRoutes);

app.use("/api/leaderboard", leaderboardRoutes);
app.use("/leaderboard", leaderboardRoutes);

app.use("/api/feedback", feedbackRoutes);
app.use("/feedback", feedbackRoutes);

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
      leaderboard: "/api/leaderboard",
      feedback: "/api/feedback",
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

// Global error handler (sanitizes logs, never leaks stack traces or secrets in responses)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // Handle payload size limit errors
  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      error: "Payload too large (maximum 100kb allowed)",
      message: "Payload too large (maximum 100kb allowed)",
    });
  }

  // Handle invalid JSON parsing syntax errors
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      error: "Invalid JSON in request body",
      message: "Invalid JSON in request body",
    });
  }

  const rawLog = err.stack || err.message || "";
  const safeLog = sanitizeErrorData(rawLog);
  console.error("[Server Error]", safeLog);

  const status =
    err.status ||
    (err.message && err.message.toLowerCase().includes("database") ? 503 : 500);

  // Capture exception via monitoring service (deduplicated & redacted)
  captureServerException(err, {
    status,
    route: req.originalUrl || req.url,
    method: req.method,
  });

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
