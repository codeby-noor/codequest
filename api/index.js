/**
 * api/index.js
 *
 * Vercel Serverless Function entry point for CodeQuest API.
 * Bridges serverless HTTP requests to the Express app, ensures MongoDB
 * connection pooling across serverless invocations, and normalizes route URLs.
 */

const app = require("../server/app");
const { connectDB } = require("../server/config/database");

let dbPromise = null;

async function ensureDB() {
  if (!dbPromise) {
    dbPromise = connectDB().catch((err) => {
      console.warn("[Vercel Serverless] Database connection notice:", err.message);
      // Reset promise to allow subsequent requests to retry if database recovers
      dbPromise = null;
      return { connected: false, error: err.message };
    });
  }
  return dbPromise;
}

module.exports = async (req, res) => {
  try {
    await ensureDB();
  } catch (err) {
    console.warn("[Vercel Serverless] Non-fatal DB initialization notice:", err.message);
  }

  // Handle URL normalization if Vercel serverless rewrites alter req.url
  if (req.url === "/api/index.js" || req.url === "/api") {
    if (req.headers["x-matched-path"]) {
      req.url = req.headers["x-matched-path"];
    } else if (req.originalUrl && req.originalUrl !== "/api/index.js") {
      req.url = req.originalUrl;
    }
  }

  return app(req, res);
};
