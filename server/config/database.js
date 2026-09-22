/**
 * database.js
 *
 * MongoDB client and connection management for CodeQuest.
 * Uses official mongodb driver with connection pooling and graceful error handling.
 */

const { MongoClient } = require("mongodb");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const DB_NAME = "codequest";
let client = null;
let db = null;

/**
 * Connect to MongoDB.
 * If MONGODB_URI is missing or unreachable, handles gracefully without crashing.
 *
 * @param {string} [customUri] - Optional custom URI for testing.
 * @returns {Promise<{db: object|null, client: object|null, connected: boolean, error?: string}>}
 */
async function connectDB(customUri = null, options = {}) {
  const uri = customUri !== null && customUri !== undefined ? customUri : process.env.MONGODB_URI;

  if (!uri || uri.trim() === "") {
    return {
      db: null,
      client: null,
      connected: false,
      error: "MONGODB_URI environment variable is not configured",
    };
  }

  try {
    if (client) {
      return { db, client, connected: true };
    }

    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: options.serverSelectionTimeoutMS || 3000,
      connectTimeoutMS: options.connectTimeoutMS || 3000,
      ...options,
    });

    await client.connect();
    db = client.db(DB_NAME);
    console.log(`[MongoDB] Successfully connected to database: ${DB_NAME}`);
    return { db, client, connected: true };
  } catch (err) {
    console.warn(`[MongoDB] Connection failed: ${err.message}`);
    client = null;
    db = null;
    return {
      db: null,
      client: null,
      connected: false,
      error: "Failed to connect to MongoDB server",
    };
  }
}

/**
 * Get active database instance.
 */
function getDB() {
  return db;
}

/**
 * Get active MongoClient instance.
 */
function getClient() {
  return client;
}

/**
 * Ping database to verify connection health.
 *
 * @returns {Promise<{connected: boolean, ping?: object, error?: string}>}
 */
async function pingDB() {
  if (!db) {
    const connection = await connectDB();
    if (!connection.connected) {
      return { connected: false, error: connection.error || "Database not connected" };
    }
  }

  try {
    const result = await db.command({ ping: 1 });
    return { connected: true, ping: result };
  } catch (err) {
    return { connected: false, error: "Database ping failed" };
  }
}

/**
 * Close database connection gracefully.
 */
async function closeDB() {
  if (client) {
    try {
      await client.close();
      console.log("[MongoDB] Connection closed.");
    } catch (err) {
      console.warn(`[MongoDB] Error closing connection: ${err.message}`);
    } finally {
      client = null;
      db = null;
    }
  }
}

module.exports = {
  DB_NAME,
  connectDB,
  getDB,
  getClient,
  pingDB,
  closeDB,
};
