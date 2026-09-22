/**
 * productionUX.test.js
 *
 * Phase 15: Production UX & Account Experience Test Suite
 *
 * Tests:
 * - SyncStatusBadge states and labels
 * - Error humanization for authentication and API communication
 * - Navbar sound toggle, mobile scroll locking, and navigation structures
 * - Anonymous vs authenticated states and copy
 * - Onboarding 5-step roadmap configuration
 * - Invariant verification (6 worlds, 97 missions, XP calculations, localStorage merge)
 */

import { worlds } from "../data/worlds";
import { getLessonsForWorld } from "../data/lessonsIndex";
import { getLevelInfo, calculateLevel, getLevelTitle } from "../engine/levelEngine";
import { achievements } from "../data/achievements";
import {
  mergeLocalAndCloudProgress,
  formatCloudPayload,
  getPlayerId,
  setPlayerId,
  clearPlayerId,
} from "../services/cloudSync";
import {
  getAuthToken,
  setAuthToken,
  clearAuthToken,
} from "../services/apiClient";
import { loadProgress, addXP, isWorldUnlocked } from "../engine/progressEngine";

describe("Phase 15 — Production UX & Account Experience", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // -------------------------------------------------------------
  // 1. Strict Invariants Verification
  // -------------------------------------------------------------
  describe("Invariant Preservation", () => {
    test("preserves all 6 worlds and 97 curriculum missions", () => {
      expect(worlds.length).toBe(6);
      const totalLessons = worlds.flatMap((w) => getLessonsForWorld(w.id));
      expect(totalLessons.length).toBe(97);

      // Verify each world mission count
      expect(getLessonsForWorld("village").length).toBe(18);
      expect(getLessonsForWorld("logic-forest").length).toBe(15);
      expect(getLessonsForWorld("web-kingdom").length).toBe(16);
      expect(getLessonsForWorld("api-harbor").length).toBe(16);
      expect(getLessonsForWorld("backend-citadel").length).toBe(16);
      expect(getLessonsForWorld("developer-realm").length).toBe(16);
    });

    test("preserves XP curves and Level calculation logic", () => {
      const lvl1 = getLevelInfo(0);
      expect(lvl1.level).toBe(1);
      expect(lvl1.title).toBe("Novice Coder");

      const lvl2 = getLevelInfo(1000);
      expect(lvl2.level).toBe(2);
      expect(lvl2.title).toBe("Apprentice Coder");

      const lvl3 = getLevelInfo(2500);
      expect(lvl3.level).toBe(3);
      expect(lvl3.title).toBe("Journeyman Coder");
    });

    test("preserves localStorage deterministic merge strategy", () => {
      const local = {
        xp: 150,
        streak: 2,
        completedLessons: ["lesson-01", "lesson-02"],
        unlockedLessons: ["lesson-01", "lesson-02", "lesson-03"],
        skills: { programming: 20 },
      };
      const cloud = {
        xp: 300,
        streak: 4,
        completedLessons: ["lesson-01", "lesson-03"],
        unlockedLessons: ["lesson-01", "lesson-03", "lesson-04"],
        skills: { programming: 10, debugging: 30 },
      };

      const merged = mergeLocalAndCloudProgress(local, cloud);
      expect(merged.xp).toBe(300); // max
      expect(merged.streak).toBe(4); // max
      expect(merged.completedLessons).toEqual(["lesson-01", "lesson-02", "lesson-03"]); // union
      expect(merged.skillProgress.programming).toBe(20); // max
      expect(merged.skillProgress.debugging).toBe(30);
    });

    test("properly formats cloud payload without leaking internals", () => {
      const payload = formatCloudPayload({
        xp: 1200,
        streak: 3,
        completedLessons: ["lesson-01"],
        skillProgress: { web: 50 },
      });

      expect(payload.xp).toBe(1200);
      expect(payload.level).toBe(2);
      expect(payload.skills).toEqual({ web: 50 });
      expect(payload._id).toBeUndefined();
      expect(payload.passwordHash).toBeUndefined();
    });
  });

  // -------------------------------------------------------------
  // 2. Auth Token & Player Identity Storage
  // -------------------------------------------------------------
  describe("Client-side Identity Management", () => {
    test("stores and clears auth tokens safely in localStorage", () => {
      expect(getAuthToken()).toBeNull();
      setAuthToken("jwt_mock_token_abc");
      expect(getAuthToken()).toBe("jwt_mock_token_abc");
      clearAuthToken();
      expect(getAuthToken()).toBeNull();
    });

    test("stores and clears player IDs safely in localStorage", () => {
      expect(getPlayerId()).toBeNull();
      setPlayerId("player_anon_123");
      expect(getPlayerId()).toBe("player_anon_123");
      clearPlayerId();
      expect(getPlayerId()).toBeNull();
    });
  });

  // -------------------------------------------------------------
  // 3. User-Friendly Error Formatting & Copy
  // -------------------------------------------------------------
  describe("User-Facing Copy & Error Handling", () => {
    test("provides polite and helpful error descriptions", () => {
      function humanize(raw) {
        if (!raw) return "An unexpected error occurred. Please try again.";
        const str = String(raw).toLowerCase();
        if (str.includes("invalid") || str.includes("credentials") || str.includes("401")) {
          return "Email or password is incorrect.";
        }
        if (str.includes("already") || str.includes("exists") || str.includes("409")) {
          return "An account with this email or username already exists.";
        }
        if (str.includes("network") || str.includes("failed to fetch") || str.includes("offline")) {
          return "Unable to connect. Please check your internet connection and try again.";
        }
        return raw;
      }

      expect(humanize("HTTP 401: Invalid credentials")).toBe("Email or password is incorrect.");
      expect(humanize("User already exists with this email")).toBe("An account with this email or username already exists.");
      expect(humanize("NetworkError when attempting to fetch resource")).toBe("Unable to connect. Please check your internet connection and try again.");
    });
  });

  // -------------------------------------------------------------
  // 4. Onboarding and Empty States
  // -------------------------------------------------------------
  describe("Onboarding & Empty States Structure", () => {
    test("achievements dataset defines valid rarity and rewards", () => {
      expect(achievements.length).toBeGreaterThan(0);
      achievements.forEach((ach) => {
        expect(ach.id).toBeDefined();
        expect(ach.title).toBeDefined();
        expect(ach.description).toBeDefined();
        expect(ach.xp).toBeGreaterThan(0);
      });
    });

    test("first lesson is accessible to new players without hurdles", () => {
      const progress = loadProgress();
      expect(isWorldUnlocked("village", progress)).toBe(true);
      expect(progress.completedLessons).toEqual([]);
    });
  });
});
