/**
 * leaderboardRoutes.js
 *
 * Public REST route for the CodeQuest leaderboard.
 * Protected against sensitive data leakage, supports optional auth for current-user ranking.
 */

const express = require("express");
const { handleGetLeaderboard } = require("../controllers/leaderboardController");
const { optionalAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", optionalAuth, handleGetLeaderboard);

module.exports = router;
