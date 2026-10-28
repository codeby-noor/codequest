/**
 * feedbackRepository.js
 *
 * Data access layer for user feedback, bug reports, and feature suggestions.
 * Stores validated feedback submissions in the MongoDB 'feedback' collection.
 */

const { getDB } = require("../config/database");

const inMemoryFeedback = [];

/**
 * Persist user feedback in MongoDB.
 *
 * @param {object} feedbackData
 * @param {string} feedbackData.type - "bug" | "feature" | "general"
 * @param {number} [feedbackData.rating] - 1 to 5
 * @param {string} feedbackData.message - 10 to 2000 characters
 * @param {string} [feedbackData.userId] - Optional player ID
 * @param {string} [feedbackData.email] - Optional contact email
 * @param {object} [feedbackData.metadata] - Device/path context
 * @returns {Promise<object>} Created feedback record
 */
async function createFeedback(feedbackData) {
  const record = {
    type: feedbackData.type,
    rating: feedbackData.rating ? Number(feedbackData.rating) : null,
    message: feedbackData.message.trim(),
    userId: feedbackData.userId || null,
    email: feedbackData.email ? feedbackData.email.trim().toLowerCase() : null,
    metadata: feedbackData.metadata || {},
    status: "new",
    createdAt: new Date(),
  };

  const db = getDB();
  if (!db) {
    // In-memory fallback if database is unavailable or during disconnected unit tests
    record._id = "fb_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8);
    inMemoryFeedback.push(record);
    return record;
  }

  const result = await db.collection("feedback").insertOne(record);
  record._id = result.insertedId;
  return record;
}

/**
 * Retrieve recent feedback submissions (admin utility).
 *
 * @param {object} options
 * @param {number} [options.limit=50]
 * @param {number} [options.skip=0]
 */
async function listFeedback({ limit = 50, skip = 0 } = {}) {
  const db = getDB();
  if (!db) {
    return inMemoryFeedback.slice(skip, skip + limit);
  }

  return await db
    .collection("feedback")
    .find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();
}

/**
 * Clear in-memory feedback (for testing).
 */
function resetInMemoryFeedback() {
  inMemoryFeedback.length = 0;
}

module.exports = {
  createFeedback,
  listFeedback,
  resetInMemoryFeedback,
};
