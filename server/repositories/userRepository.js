/**
 * userRepository.js
 *
 * Data Access Layer for the `users` collection.
 * Supports injected db instances for testing, isolated validation, index initialization,
 * user registration, and atomic server-side account linking.
 */

const { ObjectId } = require("mongodb");
const { getDB } = require("../config/database");
const { validateUserData, buildUserDocument } = require("../models/userModel");

const COLLECTION_NAME = "users";

/**
 * Helper to resolve the active database instance.
 */
function resolveDB(dbInstance) {
  const db = dbInstance || getDB();
  if (!db) {
    const error = new Error("Database service unavailable");
    error.status = 503;
    throw error;
  }
  return db;
}

/**
 * Converts string ID to MongoDB ObjectId if valid, otherwise returns as-is.
 */
function toObjectId(id) {
  if (!id) return null;
  if (id instanceof ObjectId) return id;
  if (typeof id === "string" && ObjectId.isValid(id) && id.length === 24) {
    try {
      return new ObjectId(id);
    } catch {
      return id;
    }
  }
  return id;
}

/**
 * Deterministic progress merge helper for server-side operations.
 */
function mergeProgressObjects(target = {}, source = {}) {
  const completedLessons = Array.from(
    new Set([...(target.completedLessons || []), ...(source.completedLessons || [])])
  );

  const unlockedLessons = Array.from(
    new Set(["lesson-01", ...(target.unlockedLessons || []), ...(source.unlockedLessons || [])])
  );

  const completedWorlds = Array.from(
    new Set([...(target.completedWorlds || []), ...(source.completedWorlds || [])])
  );

  const achievements = Array.from(
    new Set([...(target.achievements || []), ...(source.achievements || [])])
  );

  const mergedSkills = { ...(target.skills || target.skillProgress || {}) };
  const sourceSkills = source.skills || source.skillProgress || {};
  for (const [skillId, percent] of Object.entries(sourceSkills)) {
    mergedSkills[skillId] = Math.max(mergedSkills[skillId] || 0, percent || 0);
  }

  const xp = Math.max(Number(target.xp) || 0, Number(source.xp) || 0);
  const streak = Math.max(Number(target.streak) || 0, Number(source.streak) || 0);
  const avatar = target.avatar || source.avatar || "⚔️";

  // Level computation derived from XP
  let level = 1;
  if (xp >= 12000) level = 6;
  else if (xp >= 7000) level = 5;
  else if (xp >= 4500) level = 4;
  else if (xp >= 2500) level = 3;
  else if (xp >= 1000) level = 2;

  return {
    xp,
    level,
    streak,
    avatar,
    completedLessons,
    unlockedLessons,
    completedWorlds,
    skills: mergedSkills,
    achievements,
  };
}

/**
 * Initialize unique indexes for users collection.
 *
 * @param {object} [dbInstance] - Injected database instance.
 */
async function initIndexes(dbInstance) {
  const db = resolveDB(dbInstance);
  const collection = db.collection(COLLECTION_NAME);

  await collection.createIndex({ username: 1 }, { unique: true });
  await collection.createIndex({ email: 1 }, { unique: true, sparse: true });
}

/**
 * Create a new user / player document.
 *
 * @param {object} userData - New user payload.
 * @param {object} [dbInstance] - Injected database instance.
 * @returns {Promise<object>} Created user document.
 */
async function createUser(userData = {}, dbInstance) {
  const validation = validateUserData(userData, false);
  if (!validation.valid) {
    const error = new Error(`User validation failed: ${validation.errors.join(", ")}`);
    error.status = 400;
    error.errors = validation.errors;
    throw error;
  }

  const db = resolveDB(dbInstance);
  const collection = db.collection(COLLECTION_NAME);

  // Check unique constraints
  const existingUsername = await collection.findOne({ username: userData.username });
  if (existingUsername) {
    const error = new Error("Username is already taken");
    error.status = 409;
    throw error;
  }

  if (userData.email) {
    const existingEmail = await collection.findOne({ email: userData.email.toLowerCase() });
    if (existingEmail) {
      const error = new Error("Email is already registered");
      error.status = 409;
      throw error;
    }
  }

  const doc = buildUserDocument(userData);
  const result = await collection.insertOne(doc);

  return {
    ...doc,
    _id: result.insertedId,
  };
}

/**
 * Register an authenticated user account with password hash and salt.
 *
 * @param {object} userData - Registration payload with passwordHash and salt.
 * @param {object} [dbInstance] - Injected database instance.
 * @returns {Promise<object>} Created user document.
 */
async function registerUser(userData = {}, dbInstance) {
  if (!userData.email) {
    const error = new Error("Email is required for registration");
    error.status = 400;
    throw error;
  }
  if (!userData.passwordHash || !userData.salt) {
    const error = new Error("Password credentials are required");
    error.status = 400;
    throw error;
  }

  return await createUser(
    {
      ...userData,
      isRegistered: true,
    },
    dbInstance
  );
}

/**
 * Find user by ID.
 *
 * @param {string|ObjectId} userId - User ID.
 * @param {object} [dbInstance] - Injected database instance.
 * @returns {Promise<object|null>} User document or null.
 */
async function findUserById(userId, dbInstance) {
  const db = resolveDB(dbInstance);
  const collection = db.collection(COLLECTION_NAME);
  const queryId = toObjectId(userId);

  return await collection.findOne({
    $or: [{ _id: queryId }, { _id: String(userId) }],
  });
}

/**
 * Find user by email (case-insensitive).
 *
 * @param {string} email - Email address.
 * @param {object} [dbInstance] - Injected database instance.
 * @returns {Promise<object|null>} User document or null.
 */
async function findUserByEmail(email, dbInstance) {
  if (!email || typeof email !== "string") return null;
  const db = resolveDB(dbInstance);
  const collection = db.collection(COLLECTION_NAME);

  return await collection.findOne({ email: email.trim().toLowerCase() });
}

/**
 * Find user by username.
 *
 * @param {string} username - Username.
 * @param {object} [dbInstance] - Injected database instance.
 * @returns {Promise<object|null>} User document or null.
 */
async function findUserByUsername(username, dbInstance) {
  if (!username || typeof username !== "string") return null;
  const db = resolveDB(dbInstance);
  const collection = db.collection(COLLECTION_NAME);

  return await collection.findOne({ username: username.trim() });
}

/**
 * Update player progress fields (XP, level, streak, lessons, worlds, skills, achievements).
 *
 * @param {string|ObjectId} userId - User ID.
 * @param {object} progressUpdates - Updates payload.
 * @param {object} [dbInstance] - Injected database instance.
 * @returns {Promise<object>} Updated user document.
 */
async function updateUserProgress(userId, progressUpdates = {}, dbInstance) {
  const validation = validateUserData(progressUpdates, true);
  if (!validation.valid) {
    const error = new Error(`Progress update validation failed: ${validation.errors.join(", ")}`);
    error.status = 400;
    error.errors = validation.errors;
    throw error;
  }

  const db = resolveDB(dbInstance);
  const collection = db.collection(COLLECTION_NAME);
  const queryId = toObjectId(userId);

  const allowedFields = [
    "xp",
    "level",
    "streak",
    "avatar",
    "completedLessons",
    "unlockedLessons",
    "completedWorlds",
    "skills",
    "achievements",
  ];

  const updateFields = {};
  for (const field of allowedFields) {
    if (progressUpdates[field] !== undefined) {
      updateFields[field] = progressUpdates[field];
    }
  }
  updateFields.updatedAt = new Date();

  const filter = { $or: [{ _id: queryId }, { _id: String(userId) }] };

  if (collection.findOneAndUpdate) {
    const result = await collection.findOneAndUpdate(
      filter,
      { $set: updateFields },
      { returnDocument: "after" }
    );
    return result?.value || result;
  } else {
    await collection.updateOne(filter, { $set: updateFields });
    return await collection.findOne(filter);
  }
}

/**
 * Safely merge an anonymous player's progress into an authenticated user's account.
 *
 * @param {string|ObjectId} authenticatedUserId - Destination authenticated user.
 * @param {string|ObjectId} anonymousPlayerId - Source anonymous player.
 * @param {object} [dbInstance] - Injected database instance.
 * @returns {Promise<object>} Merged authenticated user document.
 */
async function linkAnonymousPlayer(authenticatedUserId, anonymousPlayerId, dbInstance) {
  if (!authenticatedUserId || !anonymousPlayerId) {
    throw new Error("Both authenticated user ID and anonymous player ID are required");
  }

  if (String(authenticatedUserId) === String(anonymousPlayerId)) {
    return await findUserById(authenticatedUserId, dbInstance);
  }

  const authUser = await findUserById(authenticatedUserId, dbInstance);
  if (!authUser) {
    const error = new Error("Authenticated user not found");
    error.status = 404;
    throw error;
  }

  const anonUser = await findUserById(anonymousPlayerId, dbInstance);
  if (!anonUser) {
    // If anonymous player not found in DB (e.g. was offline only), return authUser unmodified
    return authUser;
  }

  // Prevent linking another user's registered account
  if (anonUser.passwordHash || anonUser.isRegistered) {
    const error = new Error("Cannot link an account that is already registered");
    error.status = 403;
    throw error;
  }

  // Merge progress
  const merged = mergeProgressObjects(authUser, anonUser);

  // Update authenticated user
  const updatedUser = await updateUserProgress(authenticatedUserId, merged, dbInstance);

  // Delete anonymous user document to prevent duplicate linking and clean up
  await deleteUserById(anonymousPlayerId, dbInstance);

  return updatedUser;
}

/**
 * Delete user by ID (used for cleanup or testing).
 *
 * @param {string|ObjectId} userId - User ID.
 * @param {object} [dbInstance] - Injected database instance.
 * @returns {Promise<boolean>} Whether user was deleted.
 */
async function deleteUserById(userId, dbInstance) {
  const db = resolveDB(dbInstance);
  const collection = db.collection(COLLECTION_NAME);
  const queryId = toObjectId(userId);

  const result = await collection.deleteOne({
    $or: [{ _id: queryId }, { _id: String(userId) }],
  });
  return (result.deletedCount || 0) > 0;
}

module.exports = {
  COLLECTION_NAME,
  initIndexes,
  createUser,
  registerUser,
  findUserById,
  findUserByEmail,
  findUserByUsername,
  updateUserProgress,
  linkAnonymousPlayer,
  deleteUserById,
  mergeProgressObjects,
};
