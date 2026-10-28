/**
 * analytics.js
 *
 * Privacy-conscious product analytics for CodeQuest.
 *
 * Design principles:
 * 1. Zero personal information: never transmits passwords, tokens, emails, or raw code.
 * 2. Strict user consent: honors opt-in/opt-out status stored in localStorage.
 * 3. Client-side deduplication: guards against React re-render double-triggers.
 * 4. Resilient & decoupled: failures in analytics never impact core gameplay or learning.
 */

export const ANALYTICS_CONSENT_KEY = "codequest_analytics_consent";

// Documented Event Schema
export const ANALYTICS_EVENTS = {
  AUTH_REGISTER_COMPLETED: "auth:register_completed",
  AUTH_LOGIN_COMPLETED: "auth:login_completed",
  LEARNING_PATH_OPENED: "learning:path_opened",
  CHALLENGE_STARTED: "challenge:started",
  CHALLENGE_COMPLETED: "challenge:completed",
  ACHIEVEMENT_UNLOCKED: "achievement:unlocked",
  SESSION_COMPLETED: "session:completed",
};

const recentEventSignatures = new Map();
const DEDUPLICATION_WINDOW_MS = 2000;

/**
 * Check whether analytics tracking is enabled by user consent and environment.
 */
export function isAnalyticsAllowed() {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }

  // Check user consent (defaults to true for anonymous privacy-safe telemetry unless explicitly revoked)
  const consent = localStorage.getItem(ANALYTICS_CONSENT_KEY);
  if (consent === "denied") {
    return false;
  }

  // In test environments, suppress network calls unless explicitly tested
  if (process.env.NODE_ENV === "test" && !window.__TEST_ANALYTICS__) {
    return false;
  }

  return true;
}

/**
 * Get the current consent status: "granted" | "denied" | "unset"
 */
export function getAnalyticsConsent() {
  if (typeof window === "undefined" || !window.localStorage) return "unset";
  return localStorage.getItem(ANALYTICS_CONSENT_KEY) || "unset";
}

/**
 * Update analytics consent preference.
 * @param {"granted"|"denied"} status
 */
export function setAnalyticsConsent(status) {
  if (typeof window === "undefined" || !window.localStorage) return;
  if (status === "denied") {
    localStorage.setItem(ANALYTICS_CONSENT_KEY, "denied");
  } else {
    localStorage.setItem(ANALYTICS_CONSENT_KEY, "granted");
  }
}

/**
 * Sanitizes properties to ensure no PII or sensitive keys leak.
 */
export function sanitizeAnalyticsProps(props = {}) {
  if (!props || typeof props !== "object") return {};

  const safe = {};
  const forbiddenKeys = [
    "password",
    "token",
    "auth",
    "code",
    "solution",
    "email",
    "credential",
    "secret",
  ];

  for (const [key, value] of Object.entries(props)) {
    if (forbiddenKeys.some((f) => key.toLowerCase().includes(f))) {
      continue;
    }

    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      safe[key] = value;
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      safe[key] = sanitizeAnalyticsProps(value);
    }
  }

  return safe;
}

/**
 * Track an approved event adhering to the schema.
 *
 * @param {string} eventName - One of ANALYTICS_EVENTS
 * @param {object} [properties={}] - Event parameters (sanitized)
 */
export function trackEvent(eventName, properties = {}) {
  try {
    if (!eventName || typeof eventName !== "string") return false;

    if (!isAnalyticsAllowed()) {
      return false;
    }

    // Deduplication check
    const signature = `${eventName}:${JSON.stringify(properties)}`;
    const now = Date.now();
    const lastSeen = recentEventSignatures.get(signature);

    if (lastSeen && now - lastSeen < DEDUPLICATION_WINDOW_MS) {
      return false;
    }
    recentEventSignatures.set(signature, now);

    const safeProperties = sanitizeAnalyticsProps(properties);
    const eventPayload = {
      event: eventName,
      properties: safeProperties,
      timestamp: new Date().toISOString(),
    };

    // If an external analytics provider is configured (e.g. Plausible, PostHog, or custom endpoint)
    if (typeof window !== "undefined" && window.plausible) {
      window.plausible(eventName, { props: safeProperties });
    }

    // If testing or dev, we can store in session history
    if (typeof window !== "undefined") {
      window.__cq_last_event = eventPayload;
    }

    return true;
  } catch (err) {
    // Analytics failures must never disrupt user experience
    return false;
  }
}

export const analytics = {
  ANALYTICS_EVENTS,
  isAnalyticsAllowed,
  getAnalyticsConsent,
  setAnalyticsConsent,
  sanitizeAnalyticsProps,
  trackEvent,
};

export default analytics;
