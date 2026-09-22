/**
 * userController.js
 *
 * Controller handling player API requests (creation, lookup, progress updates).
 */

const userRepository = require("../repositories/userRepository");
const { validateUserData, sanitizeUser } = require("../models/userModel");

const ALLOWED_PROGRESS_FIELDS = [
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

/**
 * POST /api/users
 * Create a new anonymous player profile.
 */
async function handleCreateUser(req, res, next) {
  try {
    const { username, email, avatar } = req.body || {};

    if (!username || typeof username !== "string" || username.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    const validation = validateUserData({ username, email, avatar }, false);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.errors.join("; "),
        errors: validation.errors,
      });
    }

    const created = await userRepository.createUser({ username, email, avatar });
    return res.status(201).json({
      success: true,
      user: sanitizeUser(created),
    });
  } catch (err) {
    if (err.status === 409 || err.message.includes("already")) {
      return res.status(409).json({
        success: false,
        message: err.message,
      });
    }
    if (err.status === 400) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    next(err);
  }
}

/**
 * GET /api/users/:id
 * Retrieve player profile by ID.
 */
async function handleGetUserById(req, res, next) {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = req.targetUser || (await userRepository.findUserById(id));
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/users/:id/progress
 * Update player progress fields with authorization protection.
 */
async function handleUpdateProgress(req, res, next) {
  try {
    const { id } = req.params;
    const body = req.body;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({
        success: false,
        message: "Request body must be a JSON object containing progress fields",
      });
    }

    // Check for unknown or forbidden fields
    const unknownFields = Object.keys(body).filter((k) => !ALLOWED_PROGRESS_FIELDS.includes(k));
    if (unknownFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Unknown or forbidden progress fields: ${unknownFields.join(", ")}`,
      });
    }

    // Validate progress values
    const validation = validateUserData(body, true);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.errors.join("; "),
        errors: validation.errors,
      });
    }

    // Verify user exists
    const existing = req.targetUser || (await userRepository.findUserById(id));
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updated = await userRepository.updateUserProgress(id, body);
    return res.status(200).json({
      success: true,
      user: sanitizeUser(updated),
    });
  } catch (err) {
    if (err.status === 400) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    next(err);
  }
}

module.exports = {
  handleCreateUser,
  handleGetUserById,
  handleUpdateProgress,
};
