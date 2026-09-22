/**
 * userRepository.test.js
 *
 * Phase 12A: Player Data Architecture & Repository Unit Test Suite
 * Uses an in-memory/mocked collection interface — does not require live Atlas connection.
 */

const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
if (typeof global.crypto === "undefined") {
  global.crypto = require("crypto");
}

const { validateUserData, buildUserDocument, DEFAULT_USER_DATA } = require("../../server/models/userModel");
const {
  createUser,
  findUserById,
  findUserByEmail,
  findUserByUsername,
  updateUserProgress,
  deleteUserById,
} = require("../../server/repositories/userRepository");

/**
 * Lightweight in-memory MongoDB-compatible mock collection for unit tests.
 */
function createMockDB() {
  const store = new Map();
  let idCounter = 1;

  const collection = {
    async createIndex() {
      return "index_created";
    },

    async insertOne(doc) {
      const _id = doc._id || `mock_id_${idCounter++}`;
      const record = { ...doc, _id };
      store.set(String(_id), record);
      return { insertedId: _id, acknowledged: true };
    },

    async findOne(query) {
      for (const record of store.values()) {
        if (query.$or) {
          const match = query.$or.some((clause) => {
            if (clause._id !== undefined) {
              return String(record._id) === String(clause._id);
            }
            return false;
          });
          if (match) return { ...record };
        }
        if (query.username && record.username === query.username) {
          return { ...record };
        }
        if (query.email && record.email && record.email.toLowerCase() === query.email.toLowerCase()) {
          return { ...record };
        }
        if (query._id && String(record._id) === String(query._id)) {
          return { ...record };
        }
      }
      return null;
    },

    async updateOne(filter, update) {
      const existing = await collection.findOne(filter);
      if (!existing) return { matchedCount: 0, modifiedCount: 0 };
      const updated = { ...existing, ...update.$set };
      store.set(String(existing._id), updated);
      return { matchedCount: 1, modifiedCount: 1 };
    },

    async findOneAndUpdate(filter, update) {
      const existing = await collection.findOne(filter);
      if (!existing) return null;
      const updated = { ...existing, ...update.$set };
      store.set(String(existing._id), updated);
      return updated;
    },

    async deleteOne(filter) {
      const existing = await collection.findOne(filter);
      if (!existing) return { deletedCount: 0 };
      store.delete(String(existing._id));
      return { deletedCount: 1 };
    },
  };

  return {
    collection: () => collection,
  };
}

describe("Phase 12A — Player Data Model & Validation", () => {
  describe("userModel schema validation", () => {
    test("validates a standard new player document", () => {
      const result = validateUserData({
        username: "AlexTheCoder",
        email: "alex@example.com",
        xp: 150,
        level: 2,
      });
      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    test("rejects invalid usernames (empty or illegal characters)", () => {
      expect(validateUserData({ username: "" }).valid).toBe(false);
      expect(validateUserData({ username: "a" }).valid).toBe(false); // < 2 chars
      expect(validateUserData({ username: "invalid name with spaces!" }).valid).toBe(false);
    });

    test("rejects invalid email formats", () => {
      const res = validateUserData({ username: "ValidUser", email: "not-an-email" });
      expect(res.valid).toBe(false);
      expect(res.errors[0]).toContain("email");
    });

    test("rejects negative XP and invalid levels", () => {
      const negativeXp = validateUserData({ username: "PlayerOne", xp: -50 });
      expect(negativeXp.valid).toBe(false);
      expect(negativeXp.errors.some((e) => e.includes("XP"))).toBe(true);

      const invalidLevel = validateUserData({ username: "PlayerOne", level: 0 });
      expect(invalidLevel.valid).toBe(false);
      expect(invalidLevel.errors.some((e) => e.includes("Level"))).toBe(true);
    });

    test("rejects non-array or non-string completedLessons", () => {
      const badLessons = validateUserData({ username: "PlayerOne", completedLessons: "not-an-array" });
      expect(badLessons.valid).toBe(false);

      const badElements = validateUserData({ username: "PlayerOne", completedLessons: [123, null] });
      expect(badElements.valid).toBe(false);
    });

    test("buildUserDocument applies default progression values and timestamps", () => {
      const doc = buildUserDocument({ username: "NovicePlayer" });
      expect(doc.username).toBe("NovicePlayer");
      expect(doc.xp).toBe(0);
      expect(doc.level).toBe(1);
      expect(doc.streak).toBe(0);
      expect(doc.unlockedLessons).toContain("lesson-01");
      expect(doc.completedLessons).toEqual([]);
      expect(doc.createdAt).toBeInstanceOf(Date);
      expect(doc.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe("userRepository CRUD operations (with mock DB)", () => {
    let mockDB;

    beforeEach(() => {
      mockDB = createMockDB();
    });

    test("createUser inserts a new player and returns the document with _id", async () => {
      const user = await createUser(
        {
          username: "QuestHero",
          email: "hero@codequest.dev",
          xp: 100,
        },
        mockDB
      );

      expect(user._id).toBeDefined();
      expect(user.username).toBe("QuestHero");
      expect(user.email).toBe("hero@codequest.dev");
      expect(user.xp).toBe(100);
      expect(user.unlockedLessons).toContain("lesson-01");
    });

    test("createUser prevents duplicate usernames and emails", async () => {
      await createUser({ username: "UniqueHero", email: "unique@test.com" }, mockDB);

      await expect(
        createUser({ username: "UniqueHero", email: "other@test.com" }, mockDB)
      ).rejects.toThrow("Username is already taken");

      await expect(
        createUser({ username: "OtherHero", email: "unique@test.com" }, mockDB)
      ).rejects.toThrow("Email is already registered");
    });

    test("findUserById, findUserByEmail, and findUserByUsername retrieve the created player", async () => {
      const created = await createUser({ username: "FinderHero", email: "finder@test.com" }, mockDB);

      const byId = await findUserById(created._id, mockDB);
      expect(byId).toBeDefined();
      expect(byId.username).toBe("FinderHero");

      const byEmail = await findUserByEmail("finder@test.com", mockDB);
      expect(byEmail).toBeDefined();
      expect(byEmail._id).toBe(created._id);

      const byUsername = await findUserByUsername("FinderHero", mockDB);
      expect(byUsername).toBeDefined();
      expect(byUsername._id).toBe(created._id);

      const notFound = await findUserByEmail("nonexistent@test.com", mockDB);
      expect(notFound).toBeNull();
    });

    test("updateUserProgress updates progress metrics and timestamps", async () => {
      const created = await createUser({ username: "ProgressionHero" }, mockDB);

      const updated = await updateUserProgress(
        created._id,
        {
          xp: 350,
          level: 2,
          streak: 3,
          completedLessons: ["lesson-01", "lesson-02"],
          unlockedLessons: ["lesson-01", "lesson-02", "lesson-03"],
          achievements: ["village-graduate"],
        },
        mockDB
      );

      expect(updated.xp).toBe(350);
      expect(updated.level).toBe(2);
      expect(updated.streak).toBe(3);
      expect(updated.completedLessons).toEqual(["lesson-01", "lesson-02"]);
      expect(updated.achievements).toContain("village-graduate");
    });

    test("deleteUserById removes the user document", async () => {
      const created = await createUser({ username: "DeleteHero" }, mockDB);

      const deleted = await deleteUserById(created._id, mockDB);
      expect(deleted).toBe(true);

      const lookup = await findUserById(created._id, mockDB);
      expect(lookup).toBeNull();
    });
  });
});
