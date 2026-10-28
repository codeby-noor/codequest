/**
 * mongoSanitizeMiddleware.js
 *
 * Middleware to protect against NoSQL injection and MongoDB operator tampering.
 * Recursively inspects and removes object keys starting with '$' or containing '.'
 * from req.body, req.query, and req.params.
 */

function sanitizeObject(target) {
  if (!target || typeof target !== "object") {
    return target;
  }

  if (Array.isArray(target)) {
    for (let i = 0; i < target.length; i++) {
      target[i] = sanitizeObject(target[i]);
    }
    return target;
  }

  const keys = Object.keys(target);
  for (const key of keys) {
    if (key.startsWith("$") || key.includes(".")) {
      delete target[key];
      continue;
    }

    if (typeof target[key] === "object" && target[key] !== null) {
      target[key] = sanitizeObject(target[key]);
    }
  }

  return target;
}

function mongoSanitize(req, res, next) {
  if (req.body && typeof req.body === "object") {
    sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === "object") {
    sanitizeObject(req.query);
  }
  if (req.params && typeof req.params === "object") {
    sanitizeObject(req.params);
  }
  next();
}

module.exports = {
  sanitizeObject,
  mongoSanitize,
};
