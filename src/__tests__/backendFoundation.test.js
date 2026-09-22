/**
 * backendFoundation.test.js
 *
 * Phase 11A — MongoDB Backend Foundation Test Suite
 *
 * Tests the Express application, health routes, error handlers,
 * and the MongoDB connection module behavior (including missing URI handling).
 */

const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
if (typeof global.crypto === "undefined") {
  global.crypto = require("crypto");
}

const http = require("http");
const app = require("../../server/app");
const { DB_NAME, connectDB, closeDB, pingDB, getDB, getClient } = require("../../server/config/database");

describe("Phase 11A — Backend & MongoDB Foundation Suite", () => {
  let server;
  let baseUrl;

  beforeAll((done) => {
    // Listen on ephemeral port for tests
    server = http.createServer(app);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      baseUrl = `http://127.0.0.1:${address.port}`;
      done();
    });
  });

  afterAll((done) => {
    closeDB().finally(() => {
      server.close(done);
    });
  });

  // -------------------------------------------------------------
  // 1. Database Configuration Module
  // -------------------------------------------------------------
  describe("MongoDB Database Module (config/database.js)", () => {
    test("defines the target database name as 'codequest'", () => {
      expect(DB_NAME).toBe("codequest");
    });

    test("connectDB handles empty/missing URI gracefully without throwing", async () => {
      const result = await connectDB("");
      expect(result.connected).toBe(false);
      expect(result.db).toBeNull();
      expect(result.client).toBeNull();
      expect(result.error).toContain("MONGODB_URI");
    });

    test("connectDB handles whitespace-only URI gracefully", async () => {
      const result = await connectDB("   ");
      expect(result.connected).toBe(false);
      expect(result.error).toBeTruthy();
    });

    test("connectDB handles unreachable host gracefully with timeout error", async () => {
      const result = await connectDB("mongodb://127.0.0.1:27018/codequest", {
        serverSelectionTimeoutMS: 200,
        connectTimeoutMS: 200,
      });
      expect(result.connected).toBe(false);
      expect(result.error).toBe("Failed to connect to MongoDB server");
    });

    test("pingDB returns structured connection status", async () => {
      const result = await pingDB();
      expect(typeof result.connected).toBe("boolean");
      if (!result.connected) {
        expect(result.error).toBeTruthy();
      }
    });

    test("closeDB can be called safely even when client is null", async () => {
      await expect(closeDB()).resolves.toBeUndefined();
    });
  });

  // -------------------------------------------------------------
  // 2. Health Endpoints & Express App
  // -------------------------------------------------------------
  describe("API Server & Health Endpoints", () => {
    test("GET / returns API informational status", async () => {
      const res = await fetch(`${baseUrl}/`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.name).toBe("CodeQuest API");
      expect(data.status).toBe("active");
    });

    test("GET /api/health returns 200 with server status", async () => {
      const res = await fetch(`${baseUrl}/api/health`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.message).toBe("CodeQuest API is running");
    });

    test("GET /api/health/db returns valid status code and never exposes credentials", async () => {
      const res = await fetch(`${baseUrl}/api/health/db`);
      expect([200, 503]).toContain(res.status);
      const data = await res.json();
      expect(typeof data.success).toBe("boolean");
      expect(data.database).toBeTruthy();
      // Ensure no password or sensitive connection string is exposed
      expect(JSON.stringify(data)).not.toContain("password");
      expect(JSON.stringify(data)).not.toContain("mongodb+srv");
    });

    test("GET /api/nonexistent-route returns 404 with structured JSON", async () => {
      const res = await fetch(`${baseUrl}/api/nonexistent-route`);
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe("API endpoint not found");
    });
  });
});
