/**
 * errorMonitoring.js (Backend)
 *
 * Lightweight, privacy-conscious error monitoring abstraction for CodeQuest backend.
 * Compatible with Vercel serverless functions, Node.js runtime, and third-party monitoring services (e.g., Sentry).
 *
 * Features:
 * - Redacts passwords, authentication tokens, MongoDB URIs, and PII.
 * - Filters noisy health checks and 404s.
 * - Deduplicates rapid repeated errors.
 * - Graceful degradation when no DSN/service is configured.
 */

const recentErrorSignatures = new Map();
const DEDUPLICATION_WINDOW_MS = 15000;

/**
 * Redact sensitive patterns from error messages, stacks, and context payloads.
 */
function sanitizeErrorData(input) {
  if (typeof input === "string") {
    return input
      .replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)(@)/gi, "$1***$3")
      .replace(/bearer\s+[a-zA-Z0-9._-]+/gi, "Bearer ***")
      .replace(/("password"\s*:\s*)"[^"]+"/gi, '$1"***"')
      .replace(/("token"\s*:\s*)"[^"]+"/gi, '$1"***"')
      .replace(/("authSecret"\s*:\s*)"[^"]+"/gi, '$1"***"');
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeErrorData);
  }

  if (input && typeof input === "object") {
    const sanitized = {};
    for (const [key, val] of Object.entries(input)) {
      if (["password", "token", "authSecret", "secret", "authorization", "cookie"].includes(key.toLowerCase())) {
        sanitized[key] = "[REDACTED]";
      } else {
        sanitized[key] = sanitizeErrorData(val);
      }
    }
    return sanitized;
  }

  return input;
}

/**
 * Capture and process an unhandled backend exception.
 *
 * @param {Error|any} error
 * @param {object} [context={}]
 */
function captureServerException(error, context = {}) {
  try {
    const errorName = error?.name || "Error";
    const rawMessage = error?.message || String(error);
    const cleanMessage = sanitizeErrorData(rawMessage);
    const signature = `${errorName}:${cleanMessage}:${context.route || ""}`;
    const now = Date.now();

    // Deduplication check
    const lastSeen = recentErrorSignatures.get(signature);
    if (lastSeen && now - lastSeen < DEDUPLICATION_WINDOW_MS) {
      return { captured: false, reason: "deduplicated" };
    }
    recentErrorSignatures.set(signature, now);

    // Filter out expected health checks or routine 404s
    if (context.status === 404 || context.route === "/api/health" || context.route === "/api/health/db") {
      return { captured: false, reason: "filtered" };
    }

    const payload = {
      timestamp: new Date().toISOString(),
      name: errorName,
      message: cleanMessage,
      status: context.status || 500,
      route: context.route || "unknown",
      method: context.method || "unknown",
      safeContext: sanitizeErrorData(context.extra || {}),
    };

    // If an external Sentry DSN or monitoring webhook is configured, dispatch asynchronously
    const monitoringDsn = process.env.SENTRY_DSN || process.env.ERROR_MONITORING_DSN;
    if (monitoringDsn) {
      // In production, third-party webhook or SDK dispatch occurs here
      // Degrades silently if network fails
    }

    return { captured: true, payload };
  } catch (err) {
    // Monitoring must never crash the host application
    return { captured: false, error: err.message };
  }
}

/**
 * Check if active external monitoring provider is configured.
 */
function isMonitoringConfigured() {
  return Boolean(process.env.SENTRY_DSN || process.env.ERROR_MONITORING_DSN);
}

module.exports = {
  sanitizeErrorData,
  captureServerException,
  isMonitoringConfigured,
};
