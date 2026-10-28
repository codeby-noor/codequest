/**
 * feedbackController.js
 *
 * Handles user feedback, bug reports, and feature requests.
 */

const feedbackRepository = require("../repositories/feedbackRepository");

const VALID_TYPES = ["bug", "feature", "general"];

async function handleSubmitFeedback(req, res, next) {
  try {
    const { type, rating, message, email, metadata } = req.body || {};

    // Validate type
    if (!type || !VALID_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Feedback type must be one of: ${VALID_TYPES.join(", ")}`,
      });
    }

    // Validate message
    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Message must be at least 10 characters long",
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Message cannot exceed 2000 characters",
      });
    }

    // Validate optional rating
    if (rating !== undefined && rating !== null && rating !== "") {
      const numRating = Number(rating);
      if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be an integer between 1 and 5",
        });
      }
    }

    // Validate optional email
    if (email && typeof email === "string" && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }
    }

    const userId = req.user?.id || req.body?.userId || null;

    const feedbackRecord = await feedbackRepository.createFeedback({
      type,
      rating: rating ? Number(rating) : null,
      message,
      email,
      userId,
      metadata: {
        path: req.body?.metadata?.path || req.headers["referer"] || "/",
        userAgent: req.headers["user-agent"] ? req.headers["user-agent"].substring(0, 150) : "unknown",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Thank you for your feedback! It helps make CodeQuest better for everyone.",
      feedbackId: feedbackRecord._id,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleSubmitFeedback,
};
