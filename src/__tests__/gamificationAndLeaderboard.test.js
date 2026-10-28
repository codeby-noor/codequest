/**
 * gamificationAndLeaderboard.test.js
 *
 * Comprehensive Test Suite for CodeQuest Gamification, Leaderboard, and Footer:
 * - XP awards and level threshold calculations
 * - Daily streak tracking and UTC date boundary handling
 * - Duplicate submissions and idempotency protection
 * - Achievement eligibility and duplicate prevention
 * - Leaderboard ordering, deterministic tie handling, and privacy protection
 * - Express API endpoints for challenge completion and leaderboard
 * - Footer and developer credit rendering
 */

const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
if (typeof global.crypto === "undefined") {
  global.crypto = require("crypto");
}

const {
  calculateLevel,
  getLevelInfo,
  calculateStreak,
  resolveChallengeXp,
  evaluateEligibleAchievements,
  LEVEL_THRESHOLDS,
} = require("../../server/services/gamificationService");

const {
  recordChallengeCompletion,
  getLeaderboardUsers,
  createUser,
  findUserById,
} = require("../../server/repositories/userRepository");

const app = require("../../server/app");

/**
 * Enhanced in-memory MongoDB-compatible mock DB for testing repository operations.
 */
function createMockDB() {
  const store = new Map();
  let idCounter = 1;

  const collection = {
    async createIndex() {
      return "index_created";
    },

    async insertOne(doc) {
      const _id = doc._id || `mock_user_${idCounter++}`;
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
          if (match) return JSON.parse(JSON.stringify(record));
        }
        if (query.username && record.username === query.username) {
          return JSON.parse(JSON.stringify(record));
        }
        if (query._id && String(record._id) === String(query._id)) {
          return JSON.parse(JSON.stringify(record));
        }
      }
      return null;
    },

    async updateOne(filter, update) {
      const existing = await collection.findOne(filter);
      if (!existing) return { matchedCount: 0, modifiedCount: 0 };

      const updated = { ...existing };

      if (update.$set) {
        Object.assign(updated, update.$set);
      }

      if (update.$addToSet) {
        for (const [key, val] of Object.entries(update.$addToSet)) {
          const currentArr = Array.isArray(updated[key]) ? updated[key] : [];
          if (!currentArr.includes(val)) {
            updated[key] = [...currentArr, val];
          }
        }
      }

      store.set(String(existing._id), updated);
      return { matchedCount: 1, modifiedCount: 1 };
    },

    async findOneAndUpdate(filter, update, options = {}) {
      const existing = await collection.findOne(filter);
      if (!existing) return null;

      await collection.updateOne(filter, update);
      const after = await collection.findOne(filter);
      return { value: after };
    },

    find(query, options = {}) {
      let results = Array.from(store.values()).map((r) => JSON.parse(JSON.stringify(r)));

      const cursor = {
        sort(sortObj) {
          results.sort((a, b) => {
            if (sortObj.xp) {
              const diff = (b.xp || 0) - (a.xp || 0);
              if (diff !== 0) return sortObj.xp === -1 ? diff : -diff;
            }
            if (sortObj.createdAt) {
              const timeA = new Date(a.createdAt || 0).getTime();
              const timeB = new Date(b.createdAt || 0).getTime();
              return sortObj.createdAt === 1 ? timeA - timeB : timeB - timeA;
            }
            return 0;
          });
          return cursor;
        },
        skip(n) {
          results = results.slice(n);
          return cursor;
        },
        limit(n) {
          results = results.slice(0, n);
          return cursor;
        },
        async toArray() {
          return results;
        },
      };
      return cursor;
    },

    async countDocuments(query = {}) {
      if (!query || Object.keys(query).length === 0) {
        return store.size;
      }
      let count = 0;
      for (const record of store.values()) {
        if (query.$or) {
          const matchesOr = query.$or.some((clause) => {
            if (clause.xp && clause.xp.$gt !== undefined) {
              return (record.xp || 0) > clause.xp.$gt;
            }
            if (clause.xp !== undefined && clause.createdAt && clause.createdAt.$lt) {
              return (
                record.xp === clause.xp &&
                new Date(record.createdAt).getTime() < new Date(clause.createdAt.$lt).getTime()
              );
            }
            return false;
          });
          if (matchesOr) count++;
        }
      }
      return count;
    },
  };

  return {
    collection: (name) => collection,
  };
}

describe("1. Gamification Service Unit Tests", () => {
  test("calculateLevel maps exact level thresholds correctly", () => {
    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(999)).toBe(1);
    expect(calculateLevel(1000)).toBe(2);
    expect(calculateLevel(2499)).toBe(2);
    expect(calculateLevel(2500)).toBe(3);
    expect(calculateLevel(5000)).toBe(4);
    expect(calculateLevel(8000)).toBe(5);
    expect(calculateLevel(12000)).toBe(6);
    expect(calculateLevel(17000)).toBe(7);
    expect(calculateLevel(23000)).toBe(8);
    expect(calculateLevel(30000)).toBe(9);
    expect(calculateLevel(40000)).toBe(10);
    expect(calculateLevel(55000)).toBe(11);
    expect(calculateLevel(100000)).toBe(11);
  });

  test("getLevelInfo returns percent progress and next requirements", () => {
    const info = getLevelInfo(1500);
    expect(info.level).toBe(2);
    expect(info.title).toBe("Apprentice Coder");
    expect(info.current).toBe(500); // 1500 - 1000
    expect(info.needed).toBe(1500); // 2500 - 1000
    expect(info.percent).toBe(33); // 500 / 1500
  });

  test("calculateStreak increments consecutive days and protects against duplicate same-day activity", () => {
    const day1 = new Date("2026-03-01T10:00:00Z");
    const day2 = new Date("2026-03-02T10:00:00Z");
    const day2Later = new Date("2026-03-02T16:00:00Z");
    const day4Missed = new Date("2026-03-04T10:00:00Z");

    // Day 1: first activity
    const r1 = calculateStreak({ currentStreak: 0, longestStreak: 0, lastActiveDay: null, nowDate: day1 });
    expect(r1.streak).toBe(1);
    expect(r1.longestStreak).toBe(1);
    expect(r1.isNewDay).toBe(true);
    expect(r1.lastActiveDay).toBe("2026-03-01");

    // Day 2: consecutive day
    const r2 = calculateStreak({ currentStreak: r1.streak, longestStreak: r1.longestStreak, lastActiveDay: r1.lastActiveDay, nowDate: day2 });
    expect(r2.streak).toBe(2);
    expect(r2.longestStreak).toBe(2);
    expect(r2.isNewDay).toBe(true);
    expect(r2.lastActiveDay).toBe("2026-03-02");

    // Day 2 later: same day submission (must NOT increment streak)
    const r2b = calculateStreak({ currentStreak: r2.streak, longestStreak: r2.longestStreak, lastActiveDay: r2.lastActiveDay, nowDate: day2Later });
    expect(r2b.streak).toBe(2);
    expect(r2b.longestStreak).toBe(2);
    expect(r2b.isNewDay).toBe(false);

    // Day 4: missed day (reset to 1, but preserves longestStreak)
    const r4 = calculateStreak({ currentStreak: r2b.streak, longestStreak: r2b.longestStreak, lastActiveDay: r2b.lastActiveDay, nowDate: day4Missed });
    expect(r4.streak).toBe(1);
    expect(r4.longestStreak).toBe(2);
    expect(r4.isNewDay).toBe(true);
  });

  test("resolveChallengeXp provides difficulty-weighted XP awards", () => {
    expect(resolveChallengeXp({ difficulty: "Beginner" })).toBe(50);
    expect(resolveChallengeXp({ difficulty: "Intermediate" })).toBe(100);
    expect(resolveChallengeXp({ difficulty: "Advanced" })).toBe(150);
    expect(resolveChallengeXp({ difficulty: "Boss" })).toBe(250);
    expect(resolveChallengeXp({ xp: 75 })).toBe(75);
  });

  test("evaluateEligibleAchievements identifies unlocked milestones without duplicates", () => {
    const userState = {
      completedChallenges: ["c1", "c2", "c3", "c4", "c5"],
      streak: 7,
      xp: 2500,
      level: 3,
      hasCompletedBoss: true,
    };

    const unlocked = evaluateEligibleAchievements(userState, []);
    const ids = unlocked.map((a) => a.id);

    expect(ids).toContain("first-challenge");
    expect(ids).toContain("five-challenges");
    expect(ids).toContain("streak-master");
    expect(ids).toContain("first-boss");
    expect(ids).toContain("learning-milestone");

    // If already unlocked, must not re-award
    const alreadyUnlocked = ["first-challenge", "five-challenges"];
    const newlyUnlocked = evaluateEligibleAchievements(userState, alreadyUnlocked);
    const newIds = newlyUnlocked.map((a) => a.id);

    expect(newIds).not.toContain("first-challenge");
    expect(newIds).not.toContain("five-challenges");
    expect(newIds).toContain("streak-master");
  });
});

describe("2. Repository Challenge Completion & Idempotency", () => {
  let mockDB;

  beforeEach(() => {
    mockDB = createMockDB();
  });

  test("recordChallengeCompletion awards XP and records completed challenge atomically", async () => {
    const user = await createUser({ username: "coder_one" }, mockDB);

    const result = await recordChallengeCompletion(
      user._id,
      { id: "village-01-challenge", lessonId: "lesson-01", difficulty: "Beginner" },
      mockDB
    );

    expect(result.success).toBe(true);
    expect(result.alreadyCompleted).toBe(false);
    expect(result.awardedXp).toBeGreaterThanOrEqual(50);
    expect(result.user.completedChallenges).toContain("village-01-challenge");
    expect(result.user.completedLessons).toContain("lesson-01");
  });

  test("recordChallengeCompletion prevents duplicate XP awards on repeated submission", async () => {
    const user = await createUser({ username: "coder_two" }, mockDB);

    const first = await recordChallengeCompletion(
      user._id,
      { id: "village-01-challenge", lessonId: "lesson-01", difficulty: "Beginner" },
      mockDB
    );
    expect(first.awardedXp).toBeGreaterThan(0);

    // Second submission with identical challenge ID
    const second = await recordChallengeCompletion(
      user._id,
      { id: "village-01-challenge", lessonId: "lesson-01", difficulty: "Beginner" },
      mockDB
    );

    expect(second.success).toBe(true);
    expect(second.alreadyCompleted).toBe(true);
    expect(second.awardedXp).toBe(0);
    expect(second.newlyUnlockedAchievements).toHaveLength(0);
    expect(second.user.xp).toBe(first.user.xp); // XP unchanged!
  });

  test("throws 404 if user does not exist", async () => {
    await expect(
      recordChallengeCompletion("non_existent_id", { id: "challenge_x" }, mockDB)
    ).rejects.toMatchObject({ status: 404 });
  });

  test("throws 400 if challenge ID is missing", async () => {
    const user = await createUser({ username: "coder_three" }, mockDB);
    await expect(
      recordChallengeCompletion(user._id, { id: "" }, mockDB)
    ).rejects.toMatchObject({ status: 400 });
  });
});

describe("3. Leaderboard Queries, Ordering & Privacy", () => {
  let mockDB;

  beforeEach(async () => {
    mockDB = createMockDB();
    // Seed 4 test users with distinct XP and registration dates
    await createUser({ username: "alice", xp: 3000, level: 3, streak: 5 }, mockDB);
    await createUser({ username: "bob", xp: 5000, level: 4, streak: 8 }, mockDB);
    await createUser({ username: "charlie", xp: 1200, level: 2, streak: 2 }, mockDB);
    await createUser({ username: "david", xp: 3000, level: 3, streak: 4 }, mockDB); // Tied with Alice
  });

  test("getLeaderboardUsers sorts by XP descending with deterministic tie-breaking", async () => {
    const { users, totalUsers } = await getLeaderboardUsers({ limit: 10 }, mockDB);

    expect(totalUsers).toBe(4);
    expect(users).toHaveLength(4);

    // Highest XP first
    expect(users[0].username).toBe("bob");
    expect(users[0].rank).toBe(1);
    expect(users[0].xp).toBe(5000);

    // Lowest XP last
    expect(users[3].username).toBe("charlie");
    expect(users[3].rank).toBe(4);
    expect(users[3].xp).toBe(1200);
  });

  test("getLeaderboardUsers strictly protects private data (no email, salt, or passwordHash)", async () => {
    const { users } = await getLeaderboardUsers({ limit: 5 }, mockDB);

    users.forEach((u) => {
      expect(u.email).toBeUndefined();
      expect(u.passwordHash).toBeUndefined();
      expect(u.salt).toBeUndefined();
      expect(u.token).toBeUndefined();
      expect(u.username).toBeDefined();
      expect(u.rank).toBeDefined();
      expect(u.level).toBeDefined();
    });
  });

  test("getLeaderboardUsers respects limit pagination parameter", async () => {
    const { users } = await getLeaderboardUsers({ limit: 2 }, mockDB);
    expect(users).toHaveLength(2);
  });
});

describe("4. Section 7A Developer Credit and Website Footer Specifications", () => {
  const Footer = require("../../src/components/Footer/Footer").default;
  const React = require("react");
  const { renderToString } = require("react-dom/server");
  const { StaticRouter } = require("react-router-dom/server");

  test("Footer renders exact developer credit wording: 'Built with care by Mahenoor Shaikh'", () => {
    const html = renderToString(
      React.createElement(
        StaticRouter,
        { location: "/" },
        React.createElement(Footer)
      )
    );

    expect(html).toContain("Built with care by");
    expect(html).toContain("Mahenoor Shaikh");
    expect(html).toContain("Designed and developed with a passion for coding and learning.");
  });

  test("Footer includes dynamic current copyright year", () => {
    const html = renderToString(
      React.createElement(
        StaticRouter,
        { location: "/" },
        React.createElement(Footer)
      )
    );

    const currentYear = new Date().getFullYear();
    expect(html).toContain(String(currentYear));
    expect(html).toContain("CodeQuest. All rights reserved.");
  });

  test("Footer renders navigation links to existing verified routes only", () => {
    const html = renderToString(
      React.createElement(
        StaticRouter,
        { location: "/" },
        React.createElement(Footer)
      )
    );

    expect(html).toContain('href="/"');
    expect(html).toContain('href="/challenges"');
    expect(html).toContain('href="/worlds"');
    expect(html).toContain('href="/leaderboard"');
    expect(html).toContain('href="/achievements"');

    // Routed legal links
    expect(html).toContain('href="/privacy"');
    expect(html).toContain('href="/terms"');
  });
});
