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
const {
  calculateLevel,
  calculateStreak,
  resolveChallengeXp,
  evaluateEligibleAchievements,
} = require("../services/gamificationService");

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

  const completedChallenges = Array.from(
    new Set([...(target.completedChallenges || []), ...(source.completedChallenges || [])])
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
  const longestStreak = Math.max(
    Number(target.longestStreak) || streak,
    Number(source.longestStreak) || 0
  );
  const lastActiveDay = target.lastActiveDay || source.lastActiveDay || null;
  const avatar = target.avatar || source.avatar || "⚔️";

  // Level computation derived from unified level thresholds
  const level = calculateLevel(xp);

  return {
    xp,
    level,
    streak,
    longestStreak,
    lastActiveDay,
    avatar,
    completedLessons,
    completedChallenges,
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
  await collection.createIndex({ xp: -1, createdAt: 1 });
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
    "longestStreak",
    "lastActiveDay",
    "avatar",
    "completedLessons",
    "completedChallenges",
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

/**
 * Atomically record a verified challenge completion for a user:
 * - Prevents duplicate rewards for repeated submissions or refreshes
 * - Calculates verified XP based on difficulty
 * - Updates daily streak with UTC boundary safety
 * - Evaluates and awards eligible achievements
 * - Updates level based on unified thresholds
 *
 * @param {string|ObjectId} userId
 * @param {object} challengeData - { id, lessonId, difficulty, xp, skillId, skillProgress }
 * @param {object} [dbInstance]
 * @returns {Promise<object>} Result with updated user document and award metadata
 */
async function recordChallengeCompletion(userId, challengeData = {}, dbInstance) {
  const db = resolveDB(dbInstance);
  const collection = db.collection(COLLECTION_NAME);
  const queryId = toObjectId(userId);
  const filter = { $or: [{ _id: queryId }, { _id: String(userId) }] };

  const existingUser = await collection.findOne(filter);
  if (!existingUser) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  const challengeId = String(challengeData.id || "").trim();
  if (!challengeId) {
    const error = new Error("Challenge ID is required");
    error.status = 400;
    throw error;
  }

  const completedChallenges = Array.isArray(existingUser.completedChallenges)
    ? existingUser.completedChallenges
    : [];

  // Check if already completed (prevent duplicate XP or duplicate rewards)
  if (completedChallenges.includes(challengeId)) {
    return {
      success: true,
      alreadyCompleted: true,
      awardedXp: 0,
      awardedStreak: existingUser.streak || 0,
      longestStreak: existingUser.longestStreak || existingUser.streak || 0,
      newlyUnlockedAchievements: [],
      user: existingUser,
    };
  }

  // 1. Calculate challenge XP
  const challengeXp = resolveChallengeXp(challengeData);

  // 2. Calculate daily streak with UTC boundary rules
  const streakResult = calculateStreak({
    currentStreak: existingUser.streak || 0,
    longestStreak: existingUser.longestStreak || existingUser.streak || 0,
    lastActiveDay: existingUser.lastActiveDay || null,
  });

  // 3. New challenge & lesson sets
  const updatedChallenges = [...completedChallenges, challengeId];
  const lessonId = challengeData.lessonId ? String(challengeData.lessonId) : null;
  const completedLessons = Array.isArray(existingUser.completedLessons)
    ? existingUser.completedLessons
    : [];
  const updatedLessons = lessonId && !completedLessons.includes(lessonId)
    ? [...completedLessons, lessonId]
    : completedLessons;

  // 4. Update skills if provided
  const updatedSkills = { ...(existingUser.skills || {}) };
  if (challengeData.skillId) {
    const currentSkill = updatedSkills[challengeData.skillId] || 0;
    const progressInc = typeof challengeData.skillProgress === "number" ? challengeData.skillProgress : 5;
    updatedSkills[challengeData.skillId] = Math.min(100, currentSkill + progressInc);
  }

  // 5. Evaluate achievements
  const currentXp = Number(existingUser.xp) || 0;
  const tempTotalXp = currentXp + challengeXp;
  const isBoss =
    String(challengeData.difficulty || "").toLowerCase() === "boss" ||
    challengeId.toLowerCase().includes("boss");

  const stateForAchievements = {
    completedChallenges: updatedChallenges,
    completedLessons: updatedLessons,
    streak: streakResult.streak,
    xp: tempTotalXp,
    level: calculateLevel(tempTotalXp),
    hasCompletedBoss: isBoss,
  };

  const existingAchievements = Array.isArray(existingUser.achievements)
    ? existingUser.achievements
    : [];
  const newAchievements = evaluateEligibleAchievements(stateForAchievements, existingAchievements);

  const achievementXpBonus = newAchievements.reduce((acc, ach) => acc + (ach.xp || 0), 0);
  const finalXp = tempTotalXp + achievementXpBonus;
  const finalLevel = calculateLevel(finalXp);
  const finalAchievements = [
    ...existingAchievements,
    ...newAchievements.map((a) => a.id),
  ];

  // 6. Atomic MongoDB update
  const now = new Date();
  const updatePayload = {
    $set: {
      xp: finalXp,
      level: finalLevel,
      streak: streakResult.streak,
      longestStreak: streakResult.longestStreak,
      lastActiveDay: streakResult.lastActiveDay,
      skills: updatedSkills,
      achievements: finalAchievements,
      updatedAt: now,
    },
    $addToSet: {
      completedChallenges: challengeId,
      ...(lessonId ? { completedLessons: lessonId } : {}),
    },
  };

  let updatedUser = null;
  if (collection.findOneAndUpdate) {
    const updateResult = await collection.findOneAndUpdate(filter, updatePayload, {
      returnDocument: "after",
    });
    updatedUser = updateResult?.value || updateResult;
  } else {
    await collection.updateOne(filter, updatePayload);
    updatedUser = await collection.findOne(filter);
  }

  return {
    success: true,
    alreadyCompleted: false,
    awardedXp: challengeXp + achievementXpBonus,
    challengeXp,
    achievementXpBonus,
    level: finalLevel,
    streakInfo: streakResult,
    newlyUnlockedAchievements: newAchievements,
    user: updatedUser,
  };
}

/**
 * Retrieve public leaderboard standings.
 * Protects sensitive user data (emails, passwords, salt).
 * Ties are broken deterministically by createdAt: 1.
 *
 * @param {object} options - { limit, skip, currentUserId }
 * @param {object} [dbInstance]
 * @returns {Promise<object>} { users, totalUsers, currentUserRank }
 */
async function getLeaderboardUsers({ limit = 25, skip = 0, currentUserId = null } = {}, dbInstance) {
  const db = resolveDB(dbInstance);
  const collection = db.collection(COLLECTION_NAME);

  const safeLimit = Math.max(1, Math.min(100, Number(limit) || 25));
  const safeSkip = Math.max(0, Number(skip) || 0);

  // Safe public projection
  const projection = {
    username: 1,
    avatar: 1,
    xp: 1,
    level: 1,
    streak: 1,
    achievements: 1,
    completedChallenges: 1,
    completedLessons: 1,
    createdAt: 1,
  };

  const cursor = collection
    .find({}, { projection })
    .sort({ xp: -1, createdAt: 1 })
    .skip(safeSkip)
    .limit(safeLimit);

  const rawUsers = await cursor.toArray();
  const totalUsers = await collection.countDocuments({});

  const users = rawUsers.map((user, idx) => {
    const rank = safeSkip + idx + 1;
    const isCurrent = currentUserId && String(user._id) === String(currentUserId);
    return {
      id: String(user._id),
      username: user.username,
      avatar: user.avatar || "⚔️",
      xp: typeof user.xp === "number" ? user.xp : 0,
      level: typeof user.level === "number" ? user.level : calculateLevel(user.xp || 0),
      streak: typeof user.streak === "number" ? user.streak : 0,
      achievementsCount: Array.isArray(user.achievements) ? user.achievements.length : 0,
      completedChallengesCount: Array.isArray(user.completedChallenges)
        ? user.completedChallenges.length
        : Array.isArray(user.completedLessons)
        ? user.completedLessons.length
        : 0,
      rank,
      isCurrent: Boolean(isCurrent),
    };
  });

  let currentUserRank = null;
  if (currentUserId) {
    const queryId = toObjectId(currentUserId);
    const targetUser = await collection.findOne({
      $or: [{ _id: queryId }, { _id: String(currentUserId) }],
    });

    if (targetUser) {
      const targetXp = targetUser.xp || 0;
      const targetCreatedAt = targetUser.createdAt || new Date(0);

      // Rank = 1 + count of users with higher XP OR equal XP but earlier createdAt
      const higherCount = await collection.countDocuments({
        $or: [
          { xp: { $gt: targetXp } },
          { xp: targetXp, createdAt: { $lt: targetCreatedAt } },
        ],
      });

      currentUserRank = {
        id: String(targetUser._id),
        username: targetUser.username,
        avatar: targetUser.avatar || "⚔️",
        xp: targetXp,
        level: targetUser.level || calculateLevel(targetXp),
        streak: targetUser.streak || 0,
        rank: higherCount + 1,
      };
    }
  }

  return {
    users,
    totalUsers,
    currentUserRank,
    limit: safeLimit,
    skip: safeSkip,
  };
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
  recordChallengeCompletion,
  getLeaderboardUsers,
  linkAnonymousPlayer,
  deleteUserById,
  mergeProgressObjects,
};
