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
} = require("../controllers/userController");
const { optionalAuth, authorizeUserAccess } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", handleCreateUser);
router.get("/:id", optionalAuth, authorizeUserAccess, handleGetUserById);
router.patch("/:id/progress", optionalAuth, authorizeUserAccess, handleUpdateProgress);

module.exports = router;
