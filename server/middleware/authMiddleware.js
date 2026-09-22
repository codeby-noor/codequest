/**
 * authMiddleware.js
 *
 * Express middleware for authentication and authorization.
 */

const authService = require("../services/authService");
const userRepository = require("../repositories/userRepository");

/**
 * Require valid Bearer token.
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const token = authHeader.split(" ")[1];
  const decoded = authService.verifyAuthToken(token);

  if (!decoded || !decoded.userId) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }

  req.auth = decoded;
  next();
}

/**
 * Optional authentication: extracts user if token present, but does not reject if missing.
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const decoded = authService.verifyAuthToken(token);
    if (decoded && decoded.userId) {
      req.auth = decoded;
    }
  }
  next();
}

/**
 * Authorize player resource access (prevents IDOR vulnerabilities).
 *
 * Rules:
 * 1. If target user is registered (has password):
 *    - Must be authenticated as that user (req.auth.userId === targetId).
 * 2. If target user is anonymous:
 *    - Permitted for cloud synchronization.
 */
async function authorizeUserAccess(req, res, next) {
  const targetId = req.params.id;
  if (!targetId) {
    return res.status(400).json({ success: false, message: "User ID required" });
  }

  try {
    const targetUser = await userRepository.findUserById(targetId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.targetUser = targetUser;

    // Check if target user is registered
    const isRegistered = Boolean(targetUser.passwordHash || targetUser.isRegistered);

    if (isRegistered) {
      // Must be authenticated and matching user ID
      if (!req.auth || req.auth.userId !== String(targetUser._id)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You are not authorized to access this user's data",
        });
      }
    }

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  requireAuth,
  optionalAuth,
  authorizeUserAccess,
};
