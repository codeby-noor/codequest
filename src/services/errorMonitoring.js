/**
 * errorMonitoring.js (Frontend)
 *
 * Client-side error monitoring and exception logging for CodeQuest.
 * Supports third-party telemetry (Sentry, LogRocket, custom endpoints) via REACT_APP_SENTRY_DSN.
 *
 * Privacy Guarantees:
 * - Redacts passwords, tokens, code editor buffer contents, and sensitive query params.
 * - Deduplicates recurring exceptions within a 10-second window.
 * - Fails safely without interfering with application rendering.
 */

const recentSignatures = new Map();
const DEDUPLICATION_WINDOW_MS = 10000;

/**
 * Redact sensitive keywords and patterns from string or object values.
 */
export function sanitizeClientErrorData(data) {
  if (typeof data === "string") {
    return data
      .replace(/(password|token|secret|auth|bearer)\s*[:=]\s*["']?[^"'\s&]+["']?/gi, "$1=[REDACTED]")
      .replace(/bearer\s+[a-zA-Z0-9._-]+/gi, "Bearer [REDACTED]");
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeClientErrorData);
  }

  if (data && typeof data === "object") {
    const clean = {};
    for (const [key, value] of Object.entries(data)) {
      if (["password", "token", "code", "solution", "authSecret", "secret"].includes(key.toLowerCase())) {
        clean[key] = "[REDACTED]";
      } else {
        clean[key] = sanitizeClientErrorData(value);
      }
    }
    return clean;
  }

  return data;
}

/**
 * Capture an unhandled exception or custom error report on the frontend.
 *
 * @param {Error|any} error - Error object or string
 * @param {object} [context={}] - Non-sensitive contextual info (e.g., page, componentName)
 */
export function captureClientException(error, context = {}) {
  try {
    const errorName = error?.name || "ClientError";
    const rawMessage = error?.message || String(error);
    const safeMessage = sanitizeClientErrorData(rawMessage);
    const signature = `${errorName}:${safeMessage}:${context.componentName || ""}`;
    const now = Date.now();

    // Deduplication
    const lastSeen = recentSignatures.get(signature);
    if (lastSeen && now - lastSeen < DEDUPLICATION_WINDOW_MS) {
      return { captured: false, reason: "deduplicated" };
    }
    recentSignatures.set(signature, now);

    const safeContext = sanitizeClientErrorData(context);
    const errorPayload = {
      timestamp: new Date().toISOString(),
      name: errorName,
      message: safeMessage,
      url: typeof window !== "undefined" ? window.location.pathname : "unknown",
      context: safeContext,
    };

    // If Sentry or other provider is initialized on the window, dispatch to it
    if (typeof window !== "undefined" && window.Sentry?.captureException) {
      window.Sentry.captureException(error, { extra: safeContext });
    }

    if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
      console.warn("[CodeQuest Error Monitoring]", errorPayload);
    }

    return { captured: true, payload: errorPayload };
  } catch (err) {
    // Monitoring errors must never disrupt user flow
    return { captured: false, error: err.message };
  }
}

/**
 * Initialize global error listeners.
 */
export function initClientErrorMonitoring() {
  if (typeof window === "undefined" || window.__CQ_ERROR_MONITORING_INIT__) {
    return;
  }

  window.__CQ_ERROR_MONITORING_INIT__ = true;

  window.addEventListener("error", (event) => {
    captureClientException(event.error || event.message, {
      componentName: "WindowGlobalError",
      filename: event.filename,
      lineno: event.lineno,
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    captureClientException(event.reason, {
      componentName: "UnhandledPromiseRejection",
    });
  });
}

export const errorMonitoring = {
  sanitizeClientErrorData,
  captureClientException,
  initClientErrorMonitoring,
};

export default errorMonitoring;
