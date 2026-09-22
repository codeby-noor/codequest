/**
 * authController.js
 *
 * Controller handling user authentication (register, login, me, logout, link-anonymous).
 */

const userRepository = require("../repositories/userRepository");
const { sanitizeUser, validateUserData } = require("../models/userModel");
const { hashPassword, verifyPassword, generateAuthToken } = require("../services/authService");

/**
 * POST /api/auth/register
 * Register a new user account with password.
 */
async function handleRegister(req, res, next) {
  try {
    const { username, email, password, avatar, anonymousPlayerId } = req.body || {};

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({
        success: false,
        message: "A valid email address is required for registration",
      });
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const validation = validateUserData({ username, email, password, avatar }, false);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.errors.join("; "),
        errors: validation.errors,
      });
    }

    const { hash: passwordHash, salt } = hashPassword(password);

    let user = await userRepository.registerUser({
      username,
      email,
      passwordHash,
      salt,
      avatar: avatar || "🧙‍♂️",
    });

    // If an anonymous player ID was passed during registration, safely link progress
    if (anonymousPlayerId && typeof anonymousPlayerId === "string") {
      try {
        user = await userRepository.linkAnonymousPlayer(user._id, anonymousPlayerId);
      } catch (linkErr) {
        console.warn("[Auth] Anonymous link during registration skipped:", linkErr.message);
      }
    }

    const token = generateAuthToken({
      userId: String(user._id),
      username: user.username,
      email: user.email,
    });

    return res.status(201).json({
      success: true,
      token,
      user: sanitizeUser(user),
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
 * POST /api/auth/login
 * Authenticate existing user with email/username and password.
 */
async function handleLogin(req, res, next) {
  try {
    const { identifier, email, username, password, anonymousPlayerId } = req.body || {};
    const loginTarget = (identifier || email || username || "").trim();

    if (!loginTarget || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/username and password are required",
      });
    }

    // Lookup user by email or username
    let user = null;
    if (loginTarget.includes("@")) {
      user = await userRepository.findUserByEmail(loginTarget);
    } else {
      user = await userRepository.findUserByUsername(loginTarget);
      if (!user) {
        user = await userRepository.findUserByEmail(loginTarget);
      }
    }

    if (!user || !user.passwordHash || !user.salt) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isValid = verifyPassword(password, user.passwordHash, user.salt);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // If an anonymous player ID was passed during login, safely link progress
    if (anonymousPlayerId && typeof anonymousPlayerId === "string") {
      try {
        user = await userRepository.linkAnonymousPlayer(user._id, anonymousPlayerId);
      } catch (linkErr) {
        console.warn("[Auth] Anonymous link during login skipped:", linkErr.message);
      }
    }

    const token = generateAuthToken({
      userId: String(user._id),
      username: user.username,
      email: user.email,
    });

    return res.status(200).json({
      success: true,
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me
 * Retrieve currently authenticated user profile.
 */
async function handleGetMe(req, res, next) {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const user = await userRepository.findUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found",
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
 * POST /api/auth/logout
 * Acknowledge user logout.
 */
function handleLogout(req, res) {
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
}

/**
 * POST /api/auth/link-anonymous
 * Explicitly link anonymous progress to the authenticated user account.
 */
async function handleLinkAnonymous(req, res, next) {
  try {
    const userId = req.auth?.userId;
    const { anonymousPlayerId } = req.body || {};

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!anonymousPlayerId || typeof anonymousPlayerId !== "string") {
      return res.status(400).json({
        success: false,
        message: "anonymousPlayerId is required",
      });
    }

    const updatedUser = await userRepository.linkAnonymousPlayer(userId, anonymousPlayerId);

    return res.status(200).json({
      success: true,
      message: "Anonymous progress successfully linked to account",
      user: sanitizeUser(updatedUser),
    });
  } catch (err) {
    if (err.status === 403 || err.status === 404 || err.status === 400) {
      return res.status(err.status).json({
        success: false,
        message: err.message,
      });
    }
    next(err);
  }
}

module.exports = {
  handleRegister,
  handleLogin,
  handleGetMe,
  handleLogout,
  handleLinkAnonymous,
};
