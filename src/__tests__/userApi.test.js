/**
 * userApi.test.js
 *
 * Phase 12B: Player REST API Unit & Integration Test Suite
 * Tests HTTP request handling, input validation, status codes, and sanitization
 * using an isolated in-memory repository mock (independent of live MongoDB).
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
const userRepo = require("../../server/repositories/userRepository");
const app = require("../../server/app");

describe("Phase 12B — Player REST API Endpoints", () => {
  let server;
  let baseUrl;
  const mockUsersStore = new Map();
  let mockIdCounter = 1;

  beforeAll((done) => {
    server = http.createServer(app);
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

  beforeEach(() => {
    mockUsersStore.clear();
    mockIdCounter = 1;

    jest.spyOn(userRepo, "createUser").mockImplementation(async (userData) => {
      for (const u of mockUsersStore.values()) {
        if (u.username === userData.username) {
          const err = new Error("Username is already taken");
          err.status = 409;
          throw err;
        }
        if (userData.email && u.email && u.email.toLowerCase() === userData.email.toLowerCase()) {
          const err = new Error("Email is already registered");
          err.status = 409;
          throw err;
        }
      }

      const id = `user_id_${mockIdCounter++}`;
      const now = new Date();
      const newUser = {
        _id: id,
        username: userData.username,
        email: userData.email || null,
        avatar: userData.avatar || "⚔️",
        xp: 0,
        level: 1,
        streak: 0,
        completedLessons: [],
        unlockedLessons: ["lesson-01"],
        completedWorlds: [],
        skills: { programming: 0 },
        achievements: [],
        createdAt: now,
        updatedAt: now,
      };
      mockUsersStore.set(id, newUser);
      return newUser;
    });

    jest.spyOn(userRepo, "findUserById").mockImplementation(async (id) => {
      return mockUsersStore.get(String(id)) || null;
    });

    jest.spyOn(userRepo, "updateUserProgress").mockImplementation(async (id, updates) => {
      const existing = mockUsersStore.get(String(id));
      if (!existing) return null;
      const updated = {
        ...existing,
        ...updates,
        updatedAt: new Date(),
      };
      mockUsersStore.set(String(id), updated);
      return updated;
    });
  });

  // -------------------------------------------------------------
  // 1. POST /api/users (Create Player)
  // -------------------------------------------------------------
  describe("POST /api/users", () => {
    test("creates a new player with 201 Created and sanitized defaults", async () => {
      const res = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "QuestHero",
          email: "hero@codequest.dev",
        }),
      });

      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.user).toBeDefined();
      expect(data.user.id).toBeDefined();
      expect(data.user.username).toBe("QuestHero");
      expect(data.user.email).toBe("hero@codequest.dev");
      expect(data.user.xp).toBe(0);
      expect(data.user.level).toBe(1);
      expect(data.user.unlockedLessons).toContain("lesson-01");
      expect(data.user._id).toBeUndefined(); // internal _id is sanitized
    });

    test("returns 400 Bad Request when username is missing", async () => {
      const res = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "missing@test.com" }),
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.message).toContain("Username");
    });

    test("returns 400 Bad Request when email format is invalid", async () => {
      const res = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "ValidName", email: "invalid-email" }),
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.message).toContain("email");
    });

    test("returns 409 Conflict on duplicate username", async () => {
      await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "SameUser" }),
      });

      const res = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "SameUser" }),
      });

      expect(res.status).toBe(409);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.message).toContain("Username is already taken");
    });

    test("returns 409 Conflict on duplicate email", async () => {
      await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "UserA", email: "duplicate@test.com" }),
      });

      const res = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "UserB", email: "duplicate@test.com" }),
      });

      expect(res.status).toBe(409);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.message).toContain("Email is already registered");
    });
  });

  // -------------------------------------------------------------
  // 2. GET /api/users/:id (Retrieve Player)
  // -------------------------------------------------------------
  describe("GET /api/users/:id", () => {
    test("returns 200 OK and player profile when user exists", async () => {
      const createRes = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "FetchMe" }),
      });
      const created = await createRes.json();

      const res = await fetch(`${baseUrl}/api/users/${created.user.id}`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.user.id).toBe(created.user.id);
      expect(data.user.username).toBe("FetchMe");
    });

    test("returns 404 Not Found when user does not exist", async () => {
      const res = await fetch(`${baseUrl}/api/users/nonexistent_id_999`);
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.message).toBe("User not found");
    });
  });

  // -------------------------------------------------------------
  // 3. PATCH /api/users/:id/progress (Update Player Progress)
  // -------------------------------------------------------------
  describe("PATCH /api/users/:id/progress", () => {
    test("returns 200 OK and updated metrics on valid progress patch", async () => {
      const createRes = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "ProgressPlayer" }),
      });
      const created = await createRes.json();

      const res = await fetch(`${baseUrl}/api/users/${created.user.id}/progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          xp: 250,
          level: 2,
          streak: 4,
          completedLessons: ["lesson-01", "lesson-02"],
          unlockedLessons: ["lesson-01", "lesson-02", "lesson-03"],
          achievements: ["village-graduate"],
        }),
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.user.xp).toBe(250);
      expect(data.user.level).toBe(2);
      expect(data.user.streak).toBe(4);
      expect(data.user.completedLessons).toEqual(["lesson-01", "lesson-02"]);
      expect(data.user.achievements).toContain("village-graduate");
    });

    test("returns 400 Bad Request when XP is negative", async () => {
      const createRes = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "NegativeXpPlayer" }),
      });
      const created = await createRes.json();

      const res = await fetch(`${baseUrl}/api/users/${created.user.id}/progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xp: -100 }),
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.message).toContain("XP");
    });

    test("returns 400 Bad Request when level is invalid (< 1)", async () => {
      const createRes = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "ZeroLevelPlayer" }),
      });
      const created = await createRes.json();

      const res = await fetch(`${baseUrl}/api/users/${created.user.id}/progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level: 0 }),
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.message).toContain("Level");
    });

    test("returns 400 Bad Request when progress arrays have invalid types", async () => {
      const createRes = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "BadArrayPlayer" }),
      });
      const created = await createRes.json();

      const res = await fetch(`${baseUrl}/api/users/${created.user.id}/progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completedLessons: "not-an-array" }),
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
    });

    test("returns 400 Bad Request when unknown progress fields are submitted", async () => {
      const createRes = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "UnknownFieldPlayer" }),
      });
      const created = await createRes.json();

      const res = await fetch(`${baseUrl}/api/users/${created.user.id}/progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          xp: 100,
          hackedField: "malicious_payload",
          isAdmin: true,
        }),
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.message).toContain("Unknown or forbidden");
    });

    test("returns 404 Not Found when updating nonexistent user", async () => {
      const res = await fetch(`${baseUrl}/api/users/nonexistent_id_404/progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xp: 100 }),
      });

      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.message).toBe("User not found");
    });
  });
});
