/**
 * authAndAccountLinking.test.js
 *
 * Phase 13/14: Authentication & Account Linking Security & Regression Test Suite
 * Comprehensive verification of:
 * - Password hashing (PBKDF2 salted) and timing-safe verification
 * - Signed auth tokens (generation, decoding, tamper detection)
 * - Registration, Login, Current User (me), and Logout HTTP endpoints
 * - Rate limiting / brute-force resistance
 * - Malicious injection rejection and field whitelisting
 * - Server-side IDOR authorization protection
 * - Anonymous player account linking & deterministic progress merge
 * - Zero progress loss, non-decreasing XP, and sanitization
 */

const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const http = require("http");
const {
  hashPassword,
  verifyPassword,
  generateAuthToken,
  verifyAuthToken,
} = require("../../server/services/authService");
const {
  validateUserData,
  buildUserDocument,
  sanitizeUser,
} = require("../../server/models/userModel");
const userRepository = require("../../server/repositories/userRepository");
const { createRateLimiter, resetRateLimits } = require("../../server/middleware/rateLimitMiddleware");
const app = require("../../server/app");

// In-memory mock database helper for isolated unit testing
function createMockDB() {
  const collections = {};
  return {
    collection: (name) => {
      if (!collections[name]) {
        const docs = [];
        collections[name] = {
          docs,
          createIndex: jest.fn().mockResolvedValue(true),
          insertOne: async (doc) => {
            const _id = `mock_id_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
            const inserted = { ...doc, _id };
            docs.push(inserted);
            return { insertedId: _id, acknowledged: true };
          },
          findOne: async (query) => {
            return (
              docs.find((d) => {
                if (query._id) {
                  return String(d._id) === String(query._id);
                }
                if (query.$or) {
                  return query.$or.some((subQ) => {
                    if (subQ._id) return String(d._id) === String(subQ._id);
                    if (subQ.username) return d.username === subQ.username;
                    if (subQ.email) return d.email === subQ.email;
                    return false;
                  });
                }
                if (query.username) return d.username === query.username;
                if (query.email) return d.email === query.email;
                return false;
              }) || null
            );
          },
          findOneAndUpdate: async (filter, update) => {
            const index = docs.findIndex((d) => {
              if (filter._id) return String(d._id) === String(filter._id);
              if (filter.$or) {
                return filter.$or.some((subQ) => String(d._id) === String(subQ._id));
              }
              return false;
            });
            if (index === -1) return { value: null };
            docs[index] = { ...docs[index], ...update.$set };
            return { value: docs[index] };
          },
          updateOne: async (filter, update) => {
            const index = docs.findIndex((d) => {
              if (filter._id) return String(d._id) === String(filter._id);
              if (filter.$or) {
                return filter.$or.some((subQ) => String(d._id) === String(subQ._id));
              }
              return false;
            });
            if (index !== -1) {
              docs[index] = { ...docs[index], ...update.$set };
            }
            return { matchedCount: index !== -1 ? 1 : 0 };
          },
          deleteOne: async (filter) => {
            const index = docs.findIndex((d) => {
              if (filter._id) return String(d._id) === String(filter._id);
              if (filter.$or) {
                return filter.$or.some((subQ) => String(d._id) === String(subQ._id));
              }
              return false;
            });
            if (index !== -1) {
              docs.splice(index, 1);
              return { deletedCount: 1 };
            }
            return { deletedCount: 0 };
          },
        };
      }
      return collections[name];
    },
  };
}

describe("Phase 13/14 — Authentication, Security & Account Linking Suite", () => {
  let mockDB;

  beforeEach(() => {
    mockDB = createMockDB();
    resetRateLimits();
    jest.restoreAllMocks();
  });

  // =========================================================================
  // 1. Password Security & Tokens
  // =========================================================================
  describe("1. Password Security & Tokens", () => {
    test("hashes password with cryptographic salt and verifies matching password", () => {
      const password = "SuperSecretPassword123!";
      const { hash, salt } = hashPassword(password);

      expect(hash).toBeTruthy();
      expect(salt).toBeTruthy();
      expect(hash).not.toBe(password);

      // Verify correct password
      const isValid = verifyPassword(password, hash, salt);
      expect(isValid).toBe(true);

      // Verify wrong password fails
      const isInvalid = verifyPassword("WrongPassword", hash, salt);
      expect(isInvalid).toBe(false);
    });

    test("generates and verifies signed authentication tokens", () => {
      const payload = { userId: "user_123", username: "Adventurer", email: "adventurer@codequest.dev" };
      const token = generateAuthToken(payload);

      expect(token).toBeTruthy();
      expect(token.split(".")).toHaveLength(3);

      const decoded = verifyAuthToken(token);
      expect(decoded).not.toBeNull();
      expect(decoded.userId).toBe("user_123");
      expect(decoded.username).toBe("Adventurer");

      // Verify tampered token fails
      const tamperedToken = token.slice(0, -5) + "abcde";
      expect(verifyAuthToken(tamperedToken)).toBeNull();
    });
  });

  // =========================================================================
  // 2. User Model & Sanitization
  // =========================================================================
  describe("2. User Model & Sanitization", () => {
    test("validates registration fields and password length", () => {
      const invalidShortPass = validateUserData({ username: "Adventurer", email: "a@b.com", password: "123" });
      expect(invalidShortPass.valid).toBe(false);
      expect(invalidShortPass.errors.some((e) => e.includes("at least 6"))).toBe(true);

      const validPayload = validateUserData({ username: "Adventurer", email: "a@b.com", password: "validPassword123" });
      expect(validPayload.valid).toBe(true);
    });

    test("sanitizeUser guarantees passwordHash and salt are never returned to client", () => {
      const rawUser = {
        _id: "user_secret_id",
        username: "DragonSlayer",
        email: "dragon@codequest.dev",
        passwordHash: "abc123secretHash",
        salt: "secretSalt123",
        xp: 1500,
        level: 2,
        isRegistered: true,
      };

      const sanitized = sanitizeUser(rawUser);
      expect(sanitized.id).toBe("user_secret_id");
      expect(sanitized.username).toBe("DragonSlayer");
      expect(sanitized.xp).toBe(1500);
      expect(sanitized.isRegistered).toBe(true);

      // Security guarantee: NO secrets
      expect(sanitized.passwordHash).toBeUndefined();
      expect(sanitized.salt).toBeUndefined();
      expect(sanitized.password).toBeUndefined();
    });
  });

  // =========================================================================
  // 3. User Registration & Repository (Isolated DB)
  // =========================================================================
  describe("3. Registration & Identity Persistence", () => {
    test("registers a new user and preserves progress and registration status", async () => {
      const { hash, salt } = hashPassword("P@ssword123");
      const user = await userRepository.registerUser(
        {
          username: "CodeMaster",
          email: "master@codequest.dev",
          passwordHash: hash,
          salt,
          xp: 100,
          completedLessons: ["lesson-01"],
        },
        mockDB
      );

      expect(user._id).toBeTruthy();
      expect(user.username).toBe("CodeMaster");
      expect(user.email).toBe("master@codequest.dev");
      expect(user.isRegistered).toBe(true);
      expect(user.completedLessons).toEqual(["lesson-01"]);
    });

    test("rejects duplicate email and duplicate username registration", async () => {
      const { hash, salt } = hashPassword("P@ssword123");
      await userRepository.registerUser(
        {
          username: "UniqueUser",
          email: "unique@codequest.dev",
          passwordHash: hash,
          salt,
        },
        mockDB
      );

      // Attempt same email
      await expect(
        userRepository.registerUser(
          { username: "OtherUser", email: "unique@codequest.dev", passwordHash: hash, salt },
          mockDB
        )
      ).rejects.toThrow("Email is already registered");

      // Attempt same username
      await expect(
        userRepository.registerUser(
          { username: "UniqueUser", email: "other@codequest.dev", passwordHash: hash, salt },
          mockDB
        )
      ).rejects.toThrow("Username is already taken");
    });
  });

  // =========================================================================
  // 4. Server-Side Account Linking & Deterministic Merge (Isolated DB)
  // =========================================================================
  describe("4. Account Linking & Deterministic Merge", () => {
    test("links anonymous player progress to registered user and retires anonymous player", async () => {
      // 1. Create anonymous player with progress
      const anonUser = await userRepository.createUser(
        {
          username: "adventurer_anon_1",
          xp: 650,
          streak: 4,
          completedLessons: ["lesson-01", "lesson-02", "lesson-03"],
          unlockedLessons: ["lesson-01", "lesson-02", "lesson-03", "lesson-04"],
          skills: { programming: 30, algorithms: 10 },
          achievements: ["first-steps", "village-graduate"],
          completedWorlds: ["village"],
        },
        mockDB
      );

      // 2. Create registered user with different progress
      const { hash, salt } = hashPassword("SafePass123");
      const authUser = await userRepository.registerUser(
        {
          username: "RegisteredUser",
          email: "reg@codequest.dev",
          passwordHash: hash,
          salt,
          xp: 200,
          streak: 2,
          completedLessons: ["lesson-01"],
          unlockedLessons: ["lesson-01", "lesson-02"],
          skills: { programming: 15, web: 20 },
          achievements: ["first-steps"],
        },
        mockDB
      );

      // 3. Link anonymous player to registered user
      const mergedUser = await userRepository.linkAnonymousPlayer(authUser._id, anonUser._id, mockDB);

      // Verify non-decreasing XP
      expect(mergedUser.xp).toBe(650);
      expect(mergedUser.streak).toBe(4);

      // Verify union of lessons
      expect(mergedUser.completedLessons).toEqual(["lesson-01", "lesson-02", "lesson-03"]);
      expect(mergedUser.unlockedLessons).toEqual(["lesson-01", "lesson-02", "lesson-03", "lesson-04"]);

      // Verify union of achievements and completed worlds
      expect(mergedUser.achievements).toContain("village-graduate");
      expect(mergedUser.completedWorlds).toContain("village");

      // Verify max of skills
      expect(mergedUser.skills.programming).toBe(30);
      expect(mergedUser.skills.algorithms).toBe(10);
      expect(mergedUser.skills.web).toBe(20);

      // 4. Verify anonymous user document was cleaned up
      const checkAnon = await userRepository.findUserById(anonUser._id, mockDB);
      expect(checkAnon).toBeNull();
    });

    test("refuses to link an already registered account as an anonymous source", async () => {
      const { hash, salt } = hashPassword("Pass1");
      const userA = await userRepository.registerUser(
        { username: "UserA", email: "a@test.com", passwordHash: hash, salt },
        mockDB
      );
      const userB = await userRepository.registerUser(
        { username: "UserB", email: "b@test.com", passwordHash: hash, salt },
        mockDB
      );

      // Attempt to link UserA into UserB (both registered)
      await expect(
        userRepository.linkAnonymousPlayer(userB._id, userA._id, mockDB)
      ).rejects.toThrow("Cannot link an account that is already registered");
    });
  });

  // =========================================================================
  // 5. Rate Limiting Unit Tests
  // =========================================================================
  describe("5. Rate Limiting Middleware", () => {
    test("blocks requests exceeding threshold with 429 and Retry-After header", () => {
      const limiter = createRateLimiter({ windowMs: 60000, maxRequests: 3 });

      const req = { ip: "192.168.1.50", headers: { "x-test-rate-limit": "1" } };
      let statusCalledWith = null;
      let jsonCalledWith = null;
      let headerCalledWith = {};

      const res = {
        setHeader: (k, v) => {
          headerCalledWith[k] = v;
        },
        status: (code) => {
          statusCalledWith = code;
          return {
            json: (payload) => {
              jsonCalledWith = payload;
            },
          };
        },
      };

      const next = jest.fn();

      // Requests 1, 2, 3 allowed
      limiter(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);

      limiter(req, res, next);
      expect(next).toHaveBeenCalledTimes(2);

      limiter(req, res, next);
      expect(next).toHaveBeenCalledTimes(3);

      // Request 4 blocked -> 429
      limiter(req, res, next);
      expect(next).toHaveBeenCalledTimes(3); // not called again
      expect(statusCalledWith).toBe(429);
      expect(jsonCalledWith.success).toBe(false);
      expect(headerCalledWith["Retry-After"]).toBeDefined();
    });
  });

  // =========================================================================
  // 6. HTTP Authentication & IDOR Protection Endpoints
  // =========================================================================
  describe("6. HTTP Authentication & IDOR Endpoints (/api/auth & /api/users)", () => {
    let server;
    let baseUrl;
    const mockHttpStore = new Map();
    let httpIdCounter = 1;

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
      mockHttpStore.clear();
      httpIdCounter = 1;

      jest.spyOn(userRepository, "createUser").mockImplementation(async (userData) => {
        for (const u of mockHttpStore.values()) {
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

        const id = `http_user_${httpIdCounter++}`;
        const now = new Date();
        const doc = buildUserDocument(userData);
        const newUser = {
          ...doc,
          _id: id,
          createdAt: now,
          updatedAt: now,
        };
        mockHttpStore.set(id, newUser);
        return newUser;
      });

      jest.spyOn(userRepository, "registerUser").mockImplementation(async (userData) => {
        return await userRepository.createUser({ ...userData, isRegistered: true });
      });

      jest.spyOn(userRepository, "findUserById").mockImplementation(async (id) => {
        return mockHttpStore.get(String(id)) || null;
      });

      jest.spyOn(userRepository, "findUserByEmail").mockImplementation(async (email) => {
        if (!email) return null;
        for (const u of mockHttpStore.values()) {
          if (u.email && u.email.toLowerCase() === email.trim().toLowerCase()) {
            return u;
          }
        }
        return null;
      });

      jest.spyOn(userRepository, "findUserByUsername").mockImplementation(async (username) => {
        if (!username) return null;
        for (const u of mockHttpStore.values()) {
          if (u.username && u.username === username.trim()) {
            return u;
          }
        }
        return null;
      });

      jest.spyOn(userRepository, "updateUserProgress").mockImplementation(async (id, updates) => {
        const existing = mockHttpStore.get(String(id));
        if (!existing) return null;
        const updated = {
          ...existing,
          ...updates,
          updatedAt: new Date(),
        };
        mockHttpStore.set(String(id), updated);
        return updated;
      });

      jest.spyOn(userRepository, "deleteUserById").mockImplementation(async (id) => {
        return mockHttpStore.delete(String(id));
      });
    });

    test("POST /api/auth/register creates user, returns token, and omits passwordHash", async () => {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "HttpAdventurer",
          email: "adventurer@test.com",
          password: "SecurePassword123!",
        }),
      });

      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.token).toBeTruthy();
      expect(data.user.username).toBe("HttpAdventurer");
      expect(data.user.email).toBe("adventurer@test.com");
      expect(data.user.passwordHash).toBeUndefined();
      expect(data.user.salt).toBeUndefined();
    });

    test("POST /api/auth/login validates credentials and returns token", async () => {
      // Register first
      await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "LoginUser",
          email: "login@test.com",
          password: "CorrectPassword123",
        }),
      });

      // Login with valid credentials
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "login@test.com",
          password: "CorrectPassword123",
        }),
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.token).toBeTruthy();
      expect(data.user.username).toBe("LoginUser");

      // Login with wrong password -> 401
      const failRes = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "login@test.com",
          password: "WrongPassword!",
        }),
      });

      expect(failRes.status).toBe(401);
      const failData = await failRes.json();
      expect(failData.success).toBe(false);
      expect(failData.message).toContain("Invalid email or password");
    });

    test("GET /api/auth/me verifies Bearer token and returns current user profile", async () => {
      // Register
      const regRes = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "MeUser",
          email: "me@test.com",
          password: "PasswordMe123",
        }),
      });
      const regData = await regRes.json();

      // Call /api/auth/me with Bearer token
      const meRes = await fetch(`${baseUrl}/api/auth/me`, {
        headers: { Authorization: `Bearer ${regData.token}` },
      });

      expect(meRes.status).toBe(200);
      const meData = await meRes.json();
      expect(meData.success).toBe(true);
      expect(meData.user.username).toBe("MeUser");
      expect(meData.user.email).toBe("me@test.com");

      // Unauthenticated request -> 401
      const unauthRes = await fetch(`${baseUrl}/api/auth/me`);
      expect(unauthRes.status).toBe(401);
    });

    test("POST /api/auth/logout acknowledges user logout", async () => {
      const res = await fetch(`${baseUrl}/api/auth/logout`, { method: "POST" });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
    });

    test("prevents user A from mutating registered user B progress (403 Forbidden)", async () => {
      // Create user A
      const regA = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "PlayerA", email: "a@idor.com", password: "PasswordA123" }),
      });
      const dataA = await regA.json();

      // Create user B
      const regB = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "PlayerB", email: "b@idor.com", password: "PasswordB123" }),
      });
      const dataB = await regB.json();

      // User A attempts to PATCH User B's progress
      const unauthorizedPatch = await fetch(`${baseUrl}/api/users/${dataB.user.id}/progress`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${dataA.token}`, // Token belonging to A
        },
        body: JSON.stringify({ xp: 9999 }),
      });

      expect(unauthorizedPatch.status).toBe(403);
      const errorData = await unauthorizedPatch.json();
      expect(errorData.success).toBe(false);
      expect(errorData.message).toContain("not authorized");

      // Anonymous attempt to PATCH User B's progress -> 403
      const anonPatch = await fetch(`${baseUrl}/api/users/${dataB.user.id}/progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xp: 9999 }),
      });

      expect(anonPatch.status).toBe(403);

      // User B updates User B's progress -> 200 OK
      const authorizedPatch = await fetch(`${baseUrl}/api/users/${dataB.user.id}/progress`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${dataB.token}`, // Token belonging to B
        },
        body: JSON.stringify({ xp: 500 }),
      });

      expect(authorizedPatch.status).toBe(200);
      const updateData = await authorizedPatch.json();
      expect(updateData.success).toBe(true);
      expect(updateData.user.xp).toBe(500);
    });

    test("PATCH /api/users/:id/progress rejects forbidden field injection attempts", async () => {
      const createRes = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "InjectionTarget" }),
      });
      const created = await createRes.json();

      // Attempt injection with malicious operator or field
      const injectionRes = await fetch(`${baseUrl}/api/users/${created.user.id}/progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          xp: 100,
          $set: { passwordHash: "hackedHash" },
          isAdmin: true,
          role: "superuser",
        }),
      });

      expect(injectionRes.status).toBe(400);
      const errorData = await injectionRes.json();
      expect(errorData.success).toBe(false);
      expect(errorData.message).toContain("Unknown or forbidden");
    });
  });
});
