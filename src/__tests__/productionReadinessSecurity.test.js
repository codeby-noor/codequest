/**
 * productionReadinessSecurity.test.js
 *
 * Production Readiness, Security, Privacy, Analytics & Feedback Test Suite
 */

const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
if (typeof global.crypto === "undefined") {
  global.crypto = require("crypto");
}
if (typeof global.setImmediate === "undefined") {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}
if (typeof global.clearImmediate === "undefined") {
  global.clearImmediate = (id) => clearTimeout(id);
}

const http = require("http");
const app = require("../../server/app");
const { sanitizeObject } = require("../../server/middleware/mongoSanitizeMiddleware");
const { sanitizeErrorData, captureServerException } = require("../../server/services/errorMonitoring");
const { sanitizeClientErrorData, captureClientException } = require("../../src/services/errorMonitoring");
const {
  trackEvent,
  ANALYTICS_EVENTS,
  sanitizeAnalyticsProps,
  setAnalyticsConsent,
  getAnalyticsConsent,
  isAnalyticsAllowed,
} = require("../../src/services/analytics");
const { resetRateLimits } = require("../../server/middleware/rateLimitMiddleware");
const { resetInMemoryFeedback } = require("../../server/repositories/feedbackRepository");

describe("Production Readiness, Security, Privacy & Launch Verification", () => {
  let server;
  let baseUrl;

  beforeAll((done) => {
    server = http.createServer(app);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      baseUrl = `http://127.0.0.1:${address.port}`;
      done();
    });
  });

  afterAll((done) => {
    if (server) {
      server.close(done);
    } else {
      done();
    }
  });

  beforeEach(() => {
    resetRateLimits();
    resetInMemoryFeedback();
    localStorage.clear();
  });

  // =========================================================================
  // 1. Security Headers Verification
  // =========================================================================
  describe("Security Headers", () => {
    test("sets standard security headers on API responses", async () => {
      const res = await fetch(`${baseUrl}/api`);
      expect(res.headers.get("x-content-type-options")).toBe("nosniff");
      expect(res.headers.get("x-frame-options")).toBe("SAMEORIGIN");
      expect(res.headers.get("referrer-policy")).toBe("strict-origin-when-cross-origin");
      expect(res.headers.get("permissions-policy")).toBe("camera=(), microphone=(), geolocation=()");
      expect(res.headers.get("x-xss-protection")).toBe("0");
    });
  });

  // =========================================================================
  // 2. NoSQL Injection & Input Sanitization
  // =========================================================================
  describe("NoSQL Injection Protection", () => {
    test("recursively strips keys starting with $ or containing .", () => {
      const maliciousPayload = {
        username: "legitUser",
        $gt: "",
        nested: {
          $where: "sleep(5000)",
          "field.with.dot": "bad",
          safeKey: "safeValue",
        },
        arrayProp: [
          { $regex: ".*" },
          { validProp: 123 },
        ],
      };

      const sanitized = sanitizeObject(maliciousPayload);

      expect(sanitized.username).toBe("legitUser");
      expect(sanitized.$gt).toBeUndefined();
      expect(sanitized.nested.$where).toBeUndefined();
      expect(sanitized.nested["field.with.dot"]).toBeUndefined();
      expect(sanitized.nested.safeKey).toBe("safeValue");
      expect(sanitized.arrayProp[0].$regex).toBeUndefined();
      expect(sanitized.arrayProp[1].validProp).toBe(123);
    });

    test("Express app strips operator injection on incoming POST requests", async () => {
      const res = await fetch(`${baseUrl}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "bug",
          message: "Valid bug report message that has sufficient characters.",
          $ne: "inject",
        }),
      });

      const body = await res.json();
      expect(res.status).toBe(201);
      expect(body.success).toBe(true);
    });
  });

  // =========================================================================
  // 3. Payload Size Limit & JSON Error Handling
  // =========================================================================
  describe("Payload Limits and Safe JSON Handling", () => {
    test("rejects payloads exceeding the 100kb limit with 413", async () => {
      const largeData = "x".repeat(1024 * 105); // 105kb
      const res = await fetch(`${baseUrl}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "bug",
          message: largeData,
        }),
      });

      expect(res.status).toBe(413);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.message).toMatch(/payload too large/i);
    });

    test("handles malformed JSON bodies gracefully with 400", async () => {
      const res = await fetch(`${baseUrl}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{ malformed json",
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.message).toMatch(/invalid json/i);
    });
  });

  // =========================================================================
  // 4. Feedback System Verification
  // =========================================================================
  describe("Feedback API & Validation", () => {
    test("rejects invalid feedback type", async () => {
      const res = await fetch(`${baseUrl}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "unknown_type",
          message: "This is a valid length test message.",
        }),
      });

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.message).toMatch(/type must be one of/i);
    });

    test("rejects feedback with message less than 10 characters", async () => {
      const res = await fetch(`${baseUrl}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "bug",
          message: "Too short",
        }),
      });

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.message).toMatch(/at least 10 characters/i);
    });

    test("rejects invalid rating", async () => {
      const res = await fetch(`${baseUrl}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "feature",
          rating: 7,
          message: "Please add python support in future worlds.",
        }),
      });

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.message).toMatch(/rating must be an integer between 1 and 5/i);
    });

    test("submits valid feedback successfully", async () => {
      const res = await fetch(`${baseUrl}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "bug",
          rating: 4,
          message: "The terminal output was clear, but hint 2 could be more detailed.",
          email: "tester@example.com",
        }),
      });

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.feedbackId).toBeDefined();
    });

    test("enforces rate limits on feedback when x-test-rate-limit header is set", async () => {
      // Limit is 5 requests per window
      for (let i = 0; i < 5; i++) {
        const res = await fetch(`${baseUrl}/api/feedback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-test-rate-limit": "true",
          },
          body: JSON.stringify({
            type: "general",
            message: `Feedback iteration number ${i} with sufficient length.`,
          }),
        });
        expect(res.status).toBe(201);
      }

      // 6th request should hit 429
      const blockedRes = await fetch(`${baseUrl}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-test-rate-limit": "true",
        },
        body: JSON.stringify({
          type: "general",
          message: "This request should be blocked by rate limiting.",
        }),
      });

      expect(blockedRes.status).toBe(429);
      const data = await blockedRes.json();
      expect(data.success).toBe(false);
      expect(data.retryAfter).toBeGreaterThan(0);
    });
  });

  // =========================================================================
  // 5. Error Monitoring & Secret Redaction
  // =========================================================================
  describe("Error Monitoring & Credential Protection", () => {
    test("sanitizes MongoDB URIs and credentials from error logs", () => {
      const rawError = "Connection failed to mongodb+srv://admin_user:SuperSecretPassword123@cluster0.abc.mongodb.net/codequest";
      const cleaned = sanitizeErrorData(rawError);

      expect(cleaned).not.toContain("SuperSecretPassword123");
      expect(cleaned).toContain("mongodb+srv://admin_user:***@");
    });

    test("sanitizes Bearer tokens and passwords in object context", () => {
      const context = {
        user: "testPlayer",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sensitive",
        password: "MySecretPassword!",
        normalField: "visible",
      };

      const cleaned = sanitizeErrorData(context);
      expect(cleaned.token).toBe("[REDACTED]");
      expect(cleaned.password).toBe("[REDACTED]");
      expect(cleaned.normalField).toBe("visible");
    });

    test("frontend error monitoring redacts code submissions and passwords", () => {
      const clientData = {
        componentName: "CodeEditor",
        code: "function sensitiveSolution() { return 42; }",
        password: "user_entered_password",
        page: "/code-arena/village-1",
      };

      const sanitized = sanitizeClientErrorData(clientData);
      expect(sanitized.code).toBe("[REDACTED]");
      expect(sanitized.password).toBe("[REDACTED]");
      expect(sanitized.page).toBe("/code-arena/village-1");
    });

    test("backend error monitoring deduplicates identical exceptions within window", () => {
      const err = new Error("Identical repeated crash");
      const ctx = { route: "/test-error-route" };

      const first = captureServerException(err, ctx);
      expect(first.captured).toBe(true);

      const second = captureServerException(err, ctx);
      expect(second.captured).toBe(false);
      expect(second.reason).toBe("deduplicated");
    });
  });

  // =========================================================================
  // 6. Privacy-Conscious Analytics Verification
  // =========================================================================
  describe("Privacy-Safe Analytics", () => {
    beforeEach(() => {
      window.__TEST_ANALYTICS__ = true;
    });

    afterEach(() => {
      delete window.__TEST_ANALYTICS__;
    });

    test("sanitizes forbidden keys (passwords, tokens, code, email)", () => {
      const props = {
        challengeId: "js-hello-world",
        difficulty: "beginner",
        code: "console.log('secret code')",
        password: "plaintext_pass",
        email: "private@user.com",
      };

      const sanitized = sanitizeAnalyticsProps(props);
      expect(sanitized.challengeId).toBe("js-hello-world");
      expect(sanitized.difficulty).toBe("beginner");
      expect(sanitized.code).toBeUndefined();
      expect(sanitized.password).toBeUndefined();
      expect(sanitized.email).toBeUndefined();
    });

    test("honors user opt-out consent", () => {
      setAnalyticsConsent("denied");
      expect(getAnalyticsConsent()).toBe("denied");
      expect(isAnalyticsAllowed()).toBe(false);

      const tracked = trackEvent(ANALYTICS_EVENTS.CHALLENGE_STARTED, { challengeId: "test" });
      expect(tracked).toBe(false);

      setAnalyticsConsent("granted");
      expect(getAnalyticsConsent()).toBe("granted");
      expect(isAnalyticsAllowed()).toBe(true);
    });

    test("deduplicates rapid events", () => {
      setAnalyticsConsent("granted");
      const eventName = ANALYTICS_EVENTS.CHALLENGE_STARTED;
      const props = { challengeId: "village-intro-1" };

      const first = trackEvent(eventName, props);
      expect(first).toBe(true);

      // Immediate second call should be ignored as duplicate
      const duplicate = trackEvent(eventName, props);
      expect(duplicate).toBe(false);
    });
  });
});
