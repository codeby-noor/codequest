/**
 * server.js
 *
 * CodeQuest Backend API Server entry point.
 */

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const app = require("./app");
const { connectDB, closeDB } = require("./config/database");

const PORT = parseInt(process.env.PORT, 10) || 5000;

async function startServer() {
  // Attempt non-blocking connection to database on startup
  try {
    const dbStatus = await connectDB();
    if (!dbStatus.connected) {
      console.log("[Server] Database not connected yet. Ready to connect when MONGODB_URI is provided.");
    }
  } catch (err) {
    console.warn(`[Server] Non-critical database startup warning: ${err.message}`);
  }

  const server = app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`🚀 CodeQuest API Server running on port ${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`💾 DB Health:     http://localhost:${PORT}/api/health/db`);
    console.log(`========================================`);
  });

  // Graceful shutdown
  const shutdown = async (signal) => {
    console.log(`\n[Server] ${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await closeDB();
      console.log("[Server] HTTP server closed.");
      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  return server;
}

if (require.main === module) {
  startServer();
}

module.exports = { startServer };
