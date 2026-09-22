/**
 * healthController.js
 *
 * Health check endpoints for API server and MongoDB connection.
 */

const { pingDB } = require("../config/database");

/**
 * GET /api/health
 * Returns API server health status.
 */
function getHealth(req, res) {
  res.status(200).json({
    success: true,
    message: "CodeQuest API is running",
  });
}

/**
 * GET /api/health/db
 * Verifies MongoDB connection with a lightweight ping command.
 */
async function getDbHealth(req, res) {
  try {
    const health = await pingDB();

    if (health.connected) {
      return res.status(200).json({
        success: true,
        database: "connected",
      });
    }

    return res.status(503).json({
      success: false,
      database: "disconnected",
      message: health.error || "Database connection unavailable",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      database: "error",
      message: "An unexpected error occurred while checking database health",
    });
  }
}

module.exports = {
  getHealth,
  getDbHealth,
};
