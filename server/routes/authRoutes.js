/**
 * authRoutes.js
 *
 * Express routes for authentication and account linking.
 * Protected with rate limiting against brute-force attacks.
 */

const express = require("express");
const {
  handleRegister,
  handleLogin,
  handleGetMe,
  handleLogout,
  handleLinkAnonymous,
} = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");
const { authRateLimiter } = require("../middleware/rateLimitMiddleware");

const router = express.Router();

router.post("/register", authRateLimiter, handleRegister);
router.post("/login", authRateLimiter, handleLogin);
router.get("/me", requireAuth, handleGetMe);
router.post("/logout", handleLogout);
router.post("/link-anonymous", requireAuth, handleLinkAnonymous);

module.exports = router;
