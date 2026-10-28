/**
 * feedbackRoutes.js
 *
 * Express routes for submitting user feedback, bug reports, and suggestions.
 */

const express = require("express");
const { handleSubmitFeedback } = require("../controllers/feedbackController");
const { feedbackRateLimiter } = require("../middleware/rateLimitMiddleware");
const { optionalAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", feedbackRateLimiter, optionalAuth, handleSubmitFeedback);

module.exports = router;
