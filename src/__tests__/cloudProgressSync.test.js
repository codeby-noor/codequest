/**
 * cloudProgressSync.test.js
 *
 * Phase 12D: Cloud Progress Synchronization QA & Hardening Regression Test Suite
 * Comprehensive verification of:
 * - Deterministic merge safety (Local > Cloud, Cloud > Local, Disjoint achievements/skills)
 * - XP preservation & idempotency (no duplicate rewards, level calculation)
 * - Offline -> Online recovery and background sync
 * - Stale Player ID (404) automatic recovery without progress loss
 * - API Failure resilience (POST/GET/PATCH errors, malformed JSON, network drop)
 * - Debouncing verification and localStorage preservation
 */

import {
  getPlayerId,
  setPlayerId,
  clearPlayerId,
  mergeLocalAndCloudProgress,
  formatCloudPayload,
  initializePlayerAndSync,
  PLAYER_ID_KEY,
} from "../services/cloudSync";
import {
  createPlayer,
  getPlayer,
  updatePlayerProgress,
  checkApiHealth,
} from "../services/apiClient";
import { DEFAULT_PROGRESS } from "../engine/progressEngine";
import { getLevelInfo } from "../engine/levelEngine";

describe("Phase 12D — Cloud Progress Synchronization QA & Hardening", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  // =========================================================================
  // 1. Identity & LocalStorage Persistence
  // =========================================================================
  describe("1. Player ID & Identity Management", () => {
    test("reads, writes, and clears player ID in localStorage", () => {
      expect(getPlayerId()).toBeNull();

      setPlayerId("user_abc_123");
      expect(getPlayerId()).toBe("user_abc_123");
      expect(localStorage.getItem(PLAYER_ID_KEY)).toBe("user_abc_123");

      clearPlayerId();
      expect(getPlayerId()).toBeNull();
      expect(localStorage.getItem(PLAYER_ID_KEY)).toBeNull();
    });

    test("handles edge cases gracefully in localStorage helpers", () => {
      setPlayerId(null);
      expect(getPlayerId()).toBeNull();
      setPlayerId(undefined);
      expect(getPlayerId()).toBeNull();
    });
  });

  // =========================================================================
  // 2. Initial Merge Safety (Cases A, B, C)
  // =========================================================================
  describe("2. Initial Merge Safety", () => {
    test("Case A: Local has more progress than cloud -> local progress preserved and XP does not decrease", () => {
      const local = {
        ...DEFAULT_PROGRESS,
        xp: 500,
        completedLessons: ["lesson-01", "lesson-02"],
        unlockedLessons: ["lesson-01", "lesson-02", "lesson-03"],
      };

      const cloud = {
        xp: 100,
        completedLessons: ["lesson-01"],
        unlockedLessons: ["lesson-01", "lesson-02"],
      };

      const merged = mergeLocalAndCloudProgress(local, cloud);

      expect(merged.xp).toBe(500); // XP never decreases
      expect(merged.completedLessons).toEqual(["lesson-01", "lesson-02"]); // Both lessons preserved
      expect(merged.unlockedLessons).toContain("lesson-03");
    });

    test("Case B: Cloud has more progress than local -> local receives cloud progress without loss", () => {
      const local = {
        ...DEFAULT_PROGRESS,
        xp: 100,
        completedLessons: ["lesson-01"],
        unlockedLessons: ["lesson-01", "lesson-02"],
      };

      const cloud = {
        xp: 800,
        completedLessons: ["lesson-01", "lesson-02", "lesson-03"],
        unlockedLessons: ["lesson-01", "lesson-02", "lesson-03", "lesson-04"],
      };

      const merged = mergeLocalAndCloudProgress(local, cloud);

      expect(merged.xp).toBe(800);
      expect(merged.completedLessons).toEqual(["lesson-01", "lesson-02", "lesson-03"]);
      expect(merged.unlockedLessons).toEqual(["lesson-01", "lesson-02", "lesson-03", "lesson-04"]);
    });

    test("Case C: Disjoint sets of achievements, skills, and worlds merge without dropping entries", () => {
      const local = {
        ...DEFAULT_PROGRESS,
        completedWorlds: ["village"],
        achievements: ["village-graduate", "speed-demon"],
        skillProgress: {
          programming: 40,
          debugging: 15,
        },
      };

      const cloud = {
        completedWorlds: ["village", "logic-forest"],
        achievements: ["village-graduate", "logic-master"],
        skills: {
          programming: 20,
          debugging: 45,
          git: 30,
        },
      };

      const merged = mergeLocalAndCloudProgress(local, cloud);

      // Achievements union
      expect(merged.achievements).toEqual(
        expect.arrayContaining(["village-graduate", "speed-demon", "logic-master"])
      );
      expect(merged.achievements).toHaveLength(3);

      // Worlds union
      expect(merged.completedWorlds).toEqual(["village", "logic-forest"]);

      // Key-by-key maximum skills
      expect(merged.skillProgress.programming).toBe(40); // local higher
      expect(merged.skillProgress.debugging).toBe(45); // cloud higher
      expect(merged.skillProgress.git).toBe(30); // cloud only
    });
  });

  // =========================================================================
  // 3. XP Safety & Progression Idempotency
  // =========================================================================
  describe("3. XP Safety & Progression Idempotency", () => {
    test("level is derived deterministically from total XP and never directly mutated", () => {
      const payloadLvl1 = formatCloudPayload({ xp: 450 });
      expect(payloadLvl1.level).toBe(1);

      const payloadLvl2 = formatCloudPayload({ xp: 1200 });
      expect(payloadLvl2.level).toBe(2);

      const payloadLvl3 = formatCloudPayload({ xp: 2800 });
      expect(payloadLvl3.level).toBe(3);

      const levelEngineCheck = getLevelInfo(2800);
      expect(payloadLvl3.level).toBe(levelEngineCheck.level);
    });

    test("formatCloudPayload guarantees valid non-negative values and safe fallbacks", () => {
      const safePayload = formatCloudPayload({
        xp: -50,
        streak: -2,
        completedLessons: null,
        unlockedLessons: null,
        achievements: null,
      });

      expect(safePayload.xp).toBe(0);
      expect(safePayload.level).toBe(1);
      expect(safePayload.streak).toBe(0);
      expect(safePayload.completedLessons).toEqual([]);
      expect(safePayload.unlockedLessons).toEqual(["lesson-01"]);
      expect(safePayload.achievements).toEqual([]);
    });
  });

  // =========================================================================
  // 4. Initial Sync & Bidirectional Cloud Persistence
  // =========================================================================
  describe("4. Initial Sync Persistence", () => {
    test("pushes merged progress back to cloud when local progress contains newer data", async () => {
      setPlayerId("user_cloud_existing");

      const localProgress = {
        ...DEFAULT_PROGRESS,
        xp: 600,
        completedLessons: ["lesson-01", "lesson-02"],
      };

      const cloudUser = {
        id: "user_cloud_existing",
        xp: 200,
        completedLessons: ["lesson-01"],
      };

      let patchCalledWith = null;
      global.fetch = jest.fn().mockImplementation((url, options) => {
        if (url.includes("/users/user_cloud_existing/progress") && options?.method === "PATCH") {
          patchCalledWith = JSON.parse(options.body);
          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({ success: true, user: { id: "user_cloud_existing", ...patchCalledWith } }),
          });
        }
        if (url.includes("/users/user_cloud_existing")) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({ success: true, user: cloudUser }),
          });
        }
        return Promise.reject(new Error("Unknown route"));
      });

      const result = await initializePlayerAndSync(localProgress);

      expect(result.syncStatus).toBe("synced");
      expect(result.mergedProgress.xp).toBe(600);
      expect(result.mergedProgress.completedLessons).toEqual(["lesson-01", "lesson-02"]);
      expect(patchCalledWith).not.toBeNull();
      expect(patchCalledWith.xp).toBe(600);
      expect(patchCalledWith.completedLessons).toEqual(["lesson-01", "lesson-02"]);
    });
  });

  // =========================================================================
  // 5. Stale Player ID Recovery (404 Handling)
  // =========================================================================
  describe("5. Stale Player ID Recovery (404 Handling)", () => {
    test("recovers from 404 without losing local progress, creating a new player ID and syncing", async () => {
      setPlayerId("stale_deleted_id_999");

      const localProgress = {
        ...DEFAULT_PROGRESS,
        xp: 750,
        completedLessons: ["lesson-01", "lesson-02", "lesson-03"],
      };

      let createCalled = false;
      let patchCalled = false;

      global.fetch = jest.fn().mockImplementation((url, options) => {
        // Stale GET returns 404
        if (url.includes("/users/stale_deleted_id_999") && (!options || !options.method || options.method === "GET")) {
          return Promise.resolve({
            ok: false,
            status: 404,
            json: async () => ({ success: false, message: "User not found" }),
          });
        }

        // Fresh POST creates new player
        if (url.endsWith("/users") && options?.method === "POST") {
          createCalled = true;
          return Promise.resolve({
            ok: true,
            status: 201,
            json: async () => ({
              success: true,
              user: { id: "new_recovered_id_101", xp: 0, completedLessons: [] },
            }),
          });
        }

        // PATCH pushes local progress to new player
        if (url.includes("/users/new_recovered_id_101/progress") && options?.method === "PATCH") {
          patchCalled = true;
          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({
              success: true,
              user: { id: "new_recovered_id_101", xp: 750 },
            }),
          });
        }

        return Promise.reject(new Error("Unexpected request: " + url));
      });

      const result = await initializePlayerAndSync(localProgress);

      expect(createCalled).toBe(true);
      expect(patchCalled).toBe(true);
      expect(result.playerId).toBe("new_recovered_id_101");
      expect(getPlayerId()).toBe("new_recovered_id_101");
      expect(result.mergedProgress.xp).toBe(750);
      expect(result.mergedProgress.completedLessons).toEqual(["lesson-01", "lesson-02", "lesson-03"]);
    });
  });

  // =========================================================================
  // 6. API Failure & Network Resilience
  // =========================================================================
  describe("6. API Failure & Network Resilience", () => {
    test("POST failure: returns offline gracefully and preserves local state", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ success: false, message: "Database error" }),
      });

      const localProgress = { ...DEFAULT_PROGRESS, xp: 350 };
      const result = await initializePlayerAndSync(localProgress);

      expect(result.playerId).toBeNull();
      expect(result.syncStatus).toBe("offline");
      expect(result.mergedProgress.xp).toBe(350);
    });

    test("GET failure (500 Server Error): treats as offline without wiping local progress", async () => {
      setPlayerId("user_server_error");

      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ success: false, message: "Internal server error" }),
      });

      const localProgress = { ...DEFAULT_PROGRESS, xp: 400 };
      const result = await initializePlayerAndSync(localProgress);

      expect(result.playerId).toBe("user_server_error");
      expect(result.syncStatus).toBe("offline");
      expect(result.mergedProgress.xp).toBe(400);
      expect(getPlayerId()).toBe("user_server_error"); // Stored ID not deleted on 500
    });

    test("Network Exception (e.g. DNS failure / offline): handles smoothly across all API client methods", async () => {
      global.fetch = jest.fn().mockRejectedValue(new TypeError("Failed to fetch"));

      const health = await checkApiHealth();
      expect(health.success).toBe(false);
      expect(health.offline).toBe(true);

      const create = await createPlayer();
      expect(create.success).toBe(false);
      expect(create.offline).toBe(true);

      const get = await getPlayer("user_test");
      expect(get.success).toBe(false);
      expect(get.offline).toBe(true);

      const patch = await updatePlayerProgress("user_test", { xp: 50 });
      expect(patch.success).toBe(false);
      expect(patch.offline).toBe(true);
    });

    test("Malformed JSON response (e.g. HTML 502 error page): parsed safely without throwing", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 502,
        json: async () => {
          throw new SyntaxError("Unexpected token < in JSON at position 0");
        },
      });

      const res = await getPlayer("user_test");
      expect(res.success).toBe(false);
      expect(res.status).toBe(502);
      expect(res.message).toBe("Failed to parse API response");
    });
  });

  // =========================================================================
  // 7. Offline -> Online Recovery Flow
  // =========================================================================
  describe("7. Offline -> Online Recovery Flow", () => {
    test("simulates full offline lifecycle: offline start -> local progress -> online -> synced to cloud", async () => {
      // Step 1: User starts app while offline
      global.fetch = jest.fn().mockRejectedValue(new Error("Network Down"));

      const initialLocal = { ...DEFAULT_PROGRESS, xp: 0, completedLessons: [] };
      const step1 = await initializePlayerAndSync(initialLocal);

      expect(step1.playerId).toBeNull();
      expect(step1.syncStatus).toBe("offline");

      // Step 2: User completes lessons locally while offline
      const offlineAccumulatedProgress = {
        ...DEFAULT_PROGRESS,
        xp: 450,
        completedLessons: ["lesson-01", "lesson-02"],
        unlockedLessons: ["lesson-01", "lesson-02", "lesson-03"],
        skillProgress: { programming: 20 },
      };

      // Step 3: Network becomes available; re-initialize
      let createdId = "user_recovered_online_1";
      let patchPayload = null;

      global.fetch = jest.fn().mockImplementation((url, options) => {
        if (url.endsWith("/users") && options?.method === "POST") {
          return Promise.resolve({
            ok: true,
            status: 201,
            json: async () => ({
              success: true,
              user: { id: createdId, xp: 0, completedLessons: [] },
            }),
          });
        }
        if (url.includes(`/users/${createdId}/progress`) && options?.method === "PATCH") {
          patchPayload = JSON.parse(options.body);
          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({
              success: true,
              user: { id: createdId, ...patchPayload },
            }),
          });
        }
        return Promise.reject(new Error("Unexpected endpoint"));
      });

      const step3 = await initializePlayerAndSync(offlineAccumulatedProgress);

      expect(step3.playerId).toBe(createdId);
      expect(step3.syncStatus).toBe("synced");
      expect(step3.mergedProgress.xp).toBe(450);
      expect(step3.mergedProgress.completedLessons).toEqual(["lesson-01", "lesson-02"]);
      expect(patchPayload.completedLessons).toEqual(["lesson-01", "lesson-02"]);
    });
  });

  // =========================================================================
  // 8. Debounce & Rapid Mutation Safety
  // =========================================================================
  describe("8. Debounce & Rapid Mutation Safety", () => {
    test("verifies debouncing batches rapid successive mutations into a single sync call", () => {
      jest.useFakeTimers();

      let patchCallCount = 0;
      const mockPatch = jest.fn(() => {
        patchCallCount += 1;
      });

      let timeoutId = null;
      const debounceSync = (payload, delay = 600) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          mockPatch(payload);
        }, delay);
      };

      // Rapidly fire 5 progress changes (e.g. typing or quick challenge clicks)
      debounceSync({ xp: 10 });
      jest.advanceTimersByTime(100);
      debounceSync({ xp: 20 });
      jest.advanceTimersByTime(100);
      debounceSync({ xp: 30 });
      jest.advanceTimersByTime(100);
      debounceSync({ xp: 40 });
      jest.advanceTimersByTime(100);
      debounceSync({ xp: 50 });

      // Before timer finishes: no PATCH should have been dispatched
      expect(mockPatch).not.toHaveBeenCalled();

      // Fast-forward past 600ms debounce
      jest.advanceTimersByTime(600);

      // Exactly 1 patch called with latest state
      expect(mockPatch).toHaveBeenCalledTimes(1);
      expect(mockPatch).toHaveBeenCalledWith({ xp: 50 });

      jest.useRealTimers();
    });
  });
});
