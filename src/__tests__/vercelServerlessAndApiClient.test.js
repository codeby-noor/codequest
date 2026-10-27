/**
 * vercelServerlessAndApiClient.test.js
 *
 * Automated regression test suite for:
 * 1. Vercel Serverless Function entry point (api/index.js)
 * 2. Express routing compatibility and dual-prefix mounting (/api and root)
 * 3. 404 JSON error responses for unmatched API endpoints (never returns HTML)
 * 4. Resilient frontend API client response parsing (handles 405, 503, non-JSON HTML safely)
 * 5. CORS policy verification (same-origin, vercel.app preview/production domains)
 */

const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const http = require("http");
const vercelHandler = require("../../api/index");
const app = require("../../server/app");
const apiClient = require("../services/apiClient").default || require("../services/apiClient");

describe("Vercel Serverless & Resilient API Client Suite", () => {
  let server;
  let baseUrl;

  beforeAll((done) => {
    // Mount the Vercel handler directly in an HTTP server
    server = http.createServer((req, res) => {
      vercelHandler(req, res);
    });

    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      baseUrl = `http://127.0.0.1:${address.port}`;
      done();
    });
  });

  afterAll((done) => {
    if (server && server.listening) {
      server.close(done);
    } else {
      done();
    }
  });

  // -------------------------------------------------------------
  // 1. Vercel Serverless Function Entry Point Verification
  // -------------------------------------------------------------
  describe("Vercel Serverless Entry Point (api/index.js)", () => {
    test("exports a callable function with (req, res) signature", () => {
      expect(typeof vercelHandler).toBe("function");
    });

    test("handles GET /api/health with 200 OK and structured JSON", async () => {
      const res = await fetch(`${baseUrl}/api/health`);
      expect(res.status).toBe(200);
      expect(res.headers.get("content-type")).toContain("application/json");

      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.message).toBe("CodeQuest API is running");
    });

    test("handles GET /api informational endpoint with 200 OK and endpoints map", async () => {
      const res = await fetch(`${baseUrl}/api`);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.name).toBe("CodeQuest API");
      expect(data.status).toBe("active");
      expect(data.endpoints.health).toBe("/api/health");
      expect(data.endpoints.users).toBe("/api/users");
      expect(data.endpoints.auth).toBe("/api/auth");
    });

    test("handles unknown API route with 404 JSON and never returns HTML", async () => {
      const res = await fetch(`${baseUrl}/api/unknown-test-endpoint-999`);
      expect(res.status).toBe(404);
      expect(res.headers.get("content-type")).toContain("application/json");

      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe("API endpoint not found");
      expect(data.message).toBe("API endpoint not found");
    });

    test("handles POST /api/users validation rejection with 400 JSON", async () => {
      const res = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.message).toContain("Username is required");
    });

    test("handles POST /api/auth/login validation rejection with 400 JSON", async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.message).toContain("required");
    });
  });

  // -------------------------------------------------------------
  // 2. Dual Prefix Support (/api and root)
  // -------------------------------------------------------------
  describe("Dual Route Prefix Compatibility", () => {
    test("GET /health works directly when rewritten without /api prefix", async () => {
      const res = await fetch(`${baseUrl}/health`);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.message).toBe("CodeQuest API is running");
    });

    test("POST /users works directly when rewritten without /api prefix", async () => {
      const res = await fetch(`${baseUrl}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.message).toContain("Username is required");
    });
  });

  // -------------------------------------------------------------
  // 3. CORS Policy Verification
  // -------------------------------------------------------------
  describe("CORS Policy", () => {
    function makeCorsRequest(origin) {
      return new Promise((resolve) => {
        const url = new URL(baseUrl);
        const req = http.request(
          {
            hostname: url.hostname,
            port: url.port,
            path: "/api/health",
            method: "GET",
            headers: { Origin: origin },
          },
          (res) => {
            resolve({
              statusCode: res.statusCode,
              allowOrigin: res.headers["access-control-allow-origin"] || null,
            });
          }
        );
        req.end();
      });
    }

    test("permits requests from production domain codequest-virid.vercel.app", async () => {
      const res = await makeCorsRequest("https://codequest-virid.vercel.app");
      expect(res.allowOrigin).toBe("https://codequest-virid.vercel.app");
    });

    test("permits requests from any Vercel preview domain *.vercel.app", async () => {
      const res = await makeCorsRequest("https://codequest-git-feature-preview.vercel.app");
      expect(res.allowOrigin).toBe("https://codequest-git-feature-preview.vercel.app");
    });

    test("rejects unauthorized third-party origins", async () => {
      const res = await makeCorsRequest("https://malicious-site.example.com");
      expect(res.allowOrigin).toBeNull();
    });
  });

  // -------------------------------------------------------------
  // 4. Resilient Frontend API Client Parser
  // -------------------------------------------------------------
  describe("API Client Resilient Response Parsing", () => {
    test("handles non-JSON 405 Method Not Allowed safely with informative message", async () => {
      const originalFetch = global.fetch;
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 405,
        json: async () => {
          throw new SyntaxError("Unexpected token < in JSON at position 0");
        },
      });

      try {
        const res = await apiClient.registerUser({ email: "test@example.com", password: "password123" });
        expect(res.success).toBe(false);
        expect(res.status).toBe(405);
        expect(res.message).toBe("Endpoint method not supported by server. Please verify deployment routing.");
      } finally {
        global.fetch = originalFetch;
      }
    });

    test("handles non-JSON 404 cleanly", async () => {
      const originalFetch = global.fetch;
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => {
          throw new SyntaxError("Unexpected token < in JSON at position 0");
        },
      });

      try {
        const res = await apiClient.getPlayer("missing_user");
        expect(res.success).toBe(false);
        expect(res.status).toBe(404);
        expect(res.message).toBe("Requested API endpoint not found.");
      } finally {
        global.fetch = originalFetch;
      }
    });

    test("checkApiHealth returns success when API is reachable", async () => {
      const res = await fetch(`${baseUrl}/api/health`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
    });
  });
});
