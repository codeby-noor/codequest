/**
 * userRoutes.js
 *
 * Express routes for player operations.
 * Enforces server-side authorization checks to prevent IDOR vulnerabilities.
 */

const express = require("express");
const {
  handleCreateUser,
  handleGetUserById,
  handleUpdateProgress,
  handleCompleteChallenge,
} = require("../controllers/userController");
const { optionalAuth, authorizeUserAccess } = require("../middleware/authMiddleware");
const { generalWriteRateLimiter } = require("../middleware/rateLimitMiddleware");

const router = express.Router();

router.post("/", generalWriteRateLimiter, handleCreateUser);
router.get("/:id", optionalAuth, authorizeUserAccess, handleGetUserById);
router.patch("/:id/progress", optionalAuth, authorizeUserAccess, handleUpdateProgress);
router.post("/:id/challenges/:challengeId/complete", optionalAuth, authorizeUserAccess, handleCompleteChallenge);

module.exports = router;
