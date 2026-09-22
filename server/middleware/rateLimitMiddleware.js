/**
 * rateLimitMiddleware.js
 *
 * Lightweight in-memory rate limiter for authentication endpoints.
 * Protects login and registration from brute-force / credential-stuffing attacks.
 */

const ipRequestMap = new Map();

/**
 * Creates an in-memory rate limiter middleware.
 *
 * @param {object} options
 * @param {number} [options.windowMs=15*60*1000] - Window duration in milliseconds (default: 15 mins).
 * @param {number} [options.maxRequests=20] - Maximum requests allowed per window.
 * @param {string} [options.message="Too many requests. Please try again later."] - Error message.
 */
function createRateLimiter(options = {}) {
  const windowMs = options.windowMs || 15 * 60 * 1000;
  const maxRequests = options.maxRequests || 25;
  const message = options.message || "Too many authentication requests. Please try again later.";

  return function rateLimit(req, res, next) {
    // In automated test environments, allow higher throughput
    if (process.env.NODE_ENV === "test" && !req.headers["x-test-rate-limit"]) {
      return next();
    }

    const ip = req.ip || req.connection?.remoteAddress || req.headers["x-forwarded-for"] || "127.0.0.1";
    const now = Date.now();

    let record = ipRequestMap.get(ip);
    if (!record || now - record.startTime > windowMs) {
      record = {
        count: 1,
        startTime: now,
      };
      ipRequestMap.set(ip, record);
      return next();
    }

    record.count += 1;

    if (record.count > maxRequests) {
      const retryAfterSeconds = Math.ceil((record.startTime + windowMs - now) / 1000);
      res.setHeader("Retry-After", String(Math.max(1, retryAfterSeconds)));
      return res.status(429).json({
        success: false,
        message,
        retryAfter: retryAfterSeconds,
      });
    }

    next();
  };
}

// Pre-configured rate limiter for auth endpoints
const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 25,
  message: "Too many authentication attempts. Please wait a few minutes before trying again.",
});

// Helper for testing
function resetRateLimits() {
  ipRequestMap.clear();
}

module.exports = {
  createRateLimiter,
  authRateLimiter,
  resetRateLimits,
};
