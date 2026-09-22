/**
 * userModel.js
 *
 * Data schema, default player state, and validation for CodeQuest players.
 * Supports both anonymous players and authenticated accounts.
 */

const DEFAULT_USER_DATA = {
  avatar: "⚔️",
  xp: 0,
  level: 1,
  streak: 0,
  completedLessons: [],
  unlockedLessons: ["lesson-01"],
  completedWorlds: [],
  skills: {
    programming: 0,
  },
  achievements: [],
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_-]{2,30}$/;
const MIN_PASSWORD_LENGTH = 6;

/**
 * Validates user data before inserting or updating.
 *
 * @param {object} data - Player data payload.
 * @param {boolean} [isUpdate=false] - Whether this is a partial update.
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateUserData(data = {}, isUpdate = false) {
  const errors = [];

  if (!isUpdate) {
    if (!data.username || typeof data.username !== "string" || !USERNAME_REGEX.test(data.username.trim())) {
      errors.push("Username must be between 2 and 30 alphanumeric characters, underscores, or dashes.");
    }

    if (data.email !== undefined && data.email !== null && data.email !== "") {
      if (typeof data.email !== "string" || !EMAIL_REGEX.test(data.email.trim().toLowerCase())) {
        errors.push("Invalid email format.");
      }
    }

    if (data.password !== undefined) {
      if (typeof data.password !== "string" || data.password.length < MIN_PASSWORD_LENGTH) {
        errors.push(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
      }
    }
  } else {
    if (data.username !== undefined) {
      if (typeof data.username !== "string" || !USERNAME_REGEX.test(data.username.trim())) {
        errors.push("Username must be between 2 and 30 alphanumeric characters, underscores, or dashes.");
      }
    }
    if (data.email !== undefined && data.email !== null && data.email !== "") {
      if (typeof data.email !== "string" || !EMAIL_REGEX.test(data.email.trim().toLowerCase())) {
        errors.push("Invalid email format.");
      }
    }
    if (data.password !== undefined) {
      if (typeof data.password !== "string" || data.password.length < MIN_PASSWORD_LENGTH) {
        errors.push(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
      }
    }
  }

  if (data.xp !== undefined) {
    if (typeof data.xp !== "number" || !Number.isFinite(data.xp) || data.xp < 0) {
      errors.push("XP must be a non-negative number.");
    }
  }

  if (data.level !== undefined) {
    if (typeof data.level !== "number" || !Number.isInteger(data.level) || data.level < 1) {
      errors.push("Level must be an integer of 1 or greater.");
    }
  }

  if (data.streak !== undefined) {
    if (typeof data.streak !== "number" || !Number.isInteger(data.streak) || data.streak < 0) {
      errors.push("Streak must be a non-negative integer.");
    }
  }

  if (data.completedLessons !== undefined) {
    if (!Array.isArray(data.completedLessons) || !data.completedLessons.every((l) => typeof l === "string")) {
      errors.push("completedLessons must be an array of strings.");
    }
  }

  if (data.unlockedLessons !== undefined) {
    if (!Array.isArray(data.unlockedLessons) || !data.unlockedLessons.every((l) => typeof l === "string")) {
      errors.push("unlockedLessons must be an array of strings.");
    }
  }

  if (data.completedWorlds !== undefined) {
    if (!Array.isArray(data.completedWorlds) || !data.completedWorlds.every((w) => typeof w === "string")) {
      errors.push("completedWorlds must be an array of strings.");
    }
  }

  if (data.achievements !== undefined) {
    if (!Array.isArray(data.achievements) || !data.achievements.every((a) => typeof a === "string")) {
      errors.push("achievements must be an array of strings.");
    }
  }

  if (data.skills !== undefined) {
    if (typeof data.skills !== "object" || data.skills === null || Array.isArray(data.skills)) {
      errors.push("skills must be a key-value object of skill IDs to progress numbers.");
    } else {
      const invalidSkill = Object.values(data.skills).some((val) => typeof val !== "number" || val < 0);
      if (invalidSkill) {
        errors.push("All skill values must be non-negative numbers.");
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Builds a complete user document with defaults and timestamps.
 *
 * @param {object} input - Input payload.
 * @returns {object} Formatted user document.
 */
function buildUserDocument(input = {}) {
  const now = new Date();
  const doc = {
    username: input.username ? input.username.trim() : `adventurer_${Date.now().toString(36)}`,
    avatar: input.avatar || DEFAULT_USER_DATA.avatar,
    xp: typeof input.xp === "number" ? Math.max(0, input.xp) : DEFAULT_USER_DATA.xp,
    level: typeof input.level === "number" ? Math.max(1, input.level) : DEFAULT_USER_DATA.level,
    streak: typeof input.streak === "number" ? Math.max(0, input.streak) : DEFAULT_USER_DATA.streak,
    completedLessons: Array.isArray(input.completedLessons) ? input.completedLessons : [...DEFAULT_USER_DATA.completedLessons],
    unlockedLessons: Array.isArray(input.unlockedLessons) ? input.unlockedLessons : [...DEFAULT_USER_DATA.unlockedLessons],
    completedWorlds: Array.isArray(input.completedWorlds) ? input.completedWorlds : [...DEFAULT_USER_DATA.completedWorlds],
    skills: input.skills && typeof input.skills === "object" ? { ...input.skills } : { ...DEFAULT_USER_DATA.skills },
    achievements: Array.isArray(input.achievements) ? input.achievements : [...DEFAULT_USER_DATA.achievements],
    isRegistered: Boolean(input.passwordHash || input.isRegistered),
    createdAt: now,
    updatedAt: now,
  };

  if (input.email && typeof input.email === "string" && input.email.trim()) {
    doc.email = input.email.trim().toLowerCase();
  }

  if (input.passwordHash && typeof input.passwordHash === "string") {
    doc.passwordHash = input.passwordHash;
  }

  if (input.salt && typeof input.salt === "string") {
    doc.salt = input.salt;
  }

  return doc;
}

/**
 * Format and sanitize user document for client output (never leaks passwords or salt).
 */
function sanitizeUser(user) {
  if (!user) return null;
  return {
    id: String(user._id || user.id),
    username: user.username,
    email: user.email || null,
    avatar: user.avatar || "⚔️",
    isRegistered: Boolean(user.isRegistered || user.passwordHash),
    xp: typeof user.xp === "number" ? user.xp : 0,
    level: typeof user.level === "number" ? user.level : 1,
    streak: typeof user.streak === "number" ? user.streak : 0,
    completedLessons: Array.isArray(user.completedLessons) ? user.completedLessons : [],
    unlockedLessons: Array.isArray(user.unlockedLessons) ? user.unlockedLessons : ["lesson-01"],
    completedWorlds: Array.isArray(user.completedWorlds) ? user.completedWorlds : [],
    skills: user.skills && typeof user.skills === "object" ? user.skills : {},
    achievements: Array.isArray(user.achievements) ? user.achievements : [],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

module.exports = {
  DEFAULT_USER_DATA,
  validateUserData,
  buildUserDocument,
  sanitizeUser,
};
