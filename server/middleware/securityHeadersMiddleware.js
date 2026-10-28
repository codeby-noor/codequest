/**
 * securityHeadersMiddleware.js
 *
 * Attaches standard, production-grade HTTP security headers to all responses.
 * Protects against MIME-sniffing, clickjacking, insecure framing, and sets strict transport security.
 */

function securityHeaders(req, res, next) {
  // Prevent MIME-type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Prevent clickjacking by restricting framing to same origin
  res.setHeader("X-Frame-Options", "SAMEORIGIN");

  // Control referrer information sent in requests
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Restrict access to browser features/APIs
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // Enforce HTTPS in production via Strict-Transport-Security (1 year)
  if (process.env.NODE_ENV === "production" || req.secure || req.headers["x-forwarded-proto"] === "https") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }

  // Modern browsers: disable legacy X-XSS-Protection auditor which could introduce vulnerabilities
  res.setHeader("X-XSS-Protection", "0");

  next();
}

module.exports = securityHeaders;
