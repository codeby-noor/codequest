/**
 * beginnerUX.test.js
 *
 * Phase 10: Beginner Playtest & UX Refinement Regression Test Suite
 *
 * Tests the beginner user experience from zero progress, onboarding,
 * lesson-01 exploration, hint progression, progression locks,
 * Code Arena clarity, sound toggle safety, and graduation gating.
 */

import { allLessons, getLessonById, getLessonsForWorld, getNextLessonId } from "../data/lessonsIndex";
import { worlds } from "../data/worlds";
import { validateUserChallenge } from "../engine/challengeValidator";
import { getArenaChallengesByWorld, arenaChallenges } from "../data/arenaChallenges";
import { isSoundEnabled, toggleSound, playSuccessSound, playLevelUpSound, playAchievementSound, playClickSound } from "../engine/soundEffects";
import { loadProgress, isGameComplete, isWorldUnlocked } from "../engine/progressEngine";

describe("Phase 10 — Beginner UX & Playtest Suite", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // -------------------------------------------------------------
  // 1. First 30 Seconds & Curriculum Architecture
  // -------------------------------------------------------------
  describe("Curriculum Architecture & Integrity", () => {
    test("accurately registers exactly 6 worlds and 97 total missions across the 6 worlds", () => {
      expect(worlds.length).toBe(6);

      const sixWorldsLessons = worlds.flatMap((w) => getLessonsForWorld(w.id));
      expect(sixWorldsLessons.length).toBe(97);

      const worldIds = ["village", "logic-forest", "web-kingdom", "api-harbor", "backend-citadel", "developer-realm"];
      expect(worlds.map((w) => w.id)).toEqual(worldIds);

      // Verify mission breakdown per world
      expect(getLessonsForWorld("village").length).toBe(18);
      expect(getLessonsForWorld("logic-forest").length).toBe(15);
      expect(getLessonsForWorld("web-kingdom").length).toBe(16);
      expect(getLessonsForWorld("api-harbor").length).toBe(16);
      expect(getLessonsForWorld("backend-citadel").length).toBe(16);
      expect(getLessonsForWorld("developer-realm").length).toBe(16);
    });

    test("world 1 (JavaScript Village) has exactly 18 progressive beginner lessons", () => {
      const village = getLessonsForWorld("village");
      expect(village.length).toBe(18);
      expect(village[0].id).toBe("lesson-01");
      expect(village[0].difficulty).toBe("Beginner");
      expect(village[17].type).toBe("boss");
    });

    test("fresh localStorage starts with pristine zero state and Village unlocked", () => {
      const fresh = loadProgress();
      expect(fresh.xp).toBe(0);
      expect(fresh.completedLessons.length).toBe(0);
      expect(isWorldUnlocked("village", fresh)).toBe(true);
      expect(isWorldUnlocked("logic-forest", fresh)).toBe(false);
      expect(isGameComplete(fresh)).toBe(false);
    });
  });

  // -------------------------------------------------------------
  // 2. First Lesson Experience (lesson-01)
  // -------------------------------------------------------------
  describe("First Lesson (lesson-01) Usability & Guidance", () => {
    const lesson01 = getLessonById("lesson-01");

    test("lesson-01 has beginner-friendly metadata, objectives, and hints", () => {
      expect(lesson01).toBeDefined();
      expect(lesson01.title).toContain("Variables");
      expect(lesson01.challenge.prompt).toBeTruthy();
      expect(lesson01.challenge.hints.length).toBeGreaterThanOrEqual(3);
      expect(lesson01.challenge.starterCode).toContain("Declare playerName and goldCoins");
      expect(lesson01.challenge.solution).toBeTruthy();
      expect(lesson01.challenge.solutionExplanation).toBeTruthy();
    });

    test("validates empty/starter code gracefully with clear failure message", async () => {
      const result = await validateUserChallenge(lesson01.challenge.starterCode, lesson01.challenge);
      expect(result.passed).toBe(false);
      expect(result.results.length).toBeGreaterThan(0);
      expect(result.results[0].success).toBe(false);
      expect(result.results[0].message).toContain("playerName");
    });

    test("validates invalid syntax gracefully without crashing the application", async () => {
      const result = await validateUserChallenge("let playerName = ;", lesson01.challenge);
      expect(result.passed).toBe(false);
      const hasFailedResult = result.results?.some((r) => !r.success) || result.error !== null;
      expect(hasFailedResult).toBe(true);
    });

    test("validates partial correct answer (playerName only) and guides on remaining requirement", async () => {
      const result = await validateUserChallenge('let playerName = "Adventurer";', lesson01.challenge);
      expect(result.passed).toBe(false);
      expect(result.results[0].success).toBe(true);
      expect(result.results[1].success).toBe(false);
      expect(result.results[1].message).toContain("goldCoins");
    });

    test("validates complete correct solution with full pass", async () => {
      const result = await validateUserChallenge(lesson01.challenge.solution, lesson01.challenge);
      expect(result.passed).toBe(true);
      expect(result.results.every((r) => r.success)).toBe(true);
    });

    test("next lesson after lesson-01 is correctly identified as lesson-02", () => {
      const nextId = getNextLessonId("lesson-01");
      expect(nextId).toBe("lesson-02");
      const lesson02 = getLessonById(nextId);
      expect(lesson02.title).toContain("Data Types");
    });
  });

  // -------------------------------------------------------------
  // 3. Navigation & Progression Lock Clarity
  // -------------------------------------------------------------
  describe("Progression & Lock Clarity", () => {
    test("every world beyond World 1 defines prerequisite world locks", () => {
      const lockedWorlds = worlds.filter((w) => w.id !== "village");
      expect(lockedWorlds.length).toBe(5);

      lockedWorlds.forEach((world) => {
        expect(world.requiredWorld).toBeDefined();
        const prerequisiteWorld = worlds.find((w) => w.id === world.requiredWorld);
        expect(prerequisiteWorld).toBeDefined();
        expect(prerequisiteWorld.title).toBeTruthy();
      });
    });

    test("Code Arena groups challenges by world with clear objectives", () => {
      const arenaByWorld = getArenaChallengesByWorld();
      expect(Object.keys(arenaByWorld).length).toBeGreaterThanOrEqual(1);

      arenaChallenges.forEach((challenge) => {
        expect(challenge.title).toBeTruthy();
        expect(challenge.objective).toBeTruthy();
        expect(challenge.difficulty).toBeTruthy();
        expect(challenge.xp).toBeGreaterThan(0);
        expect(challenge.worldName).toBeTruthy();
      });
    });
  });

  // -------------------------------------------------------------
  // 4. Audio Effects & Non-blocking Experience
  // -------------------------------------------------------------
  describe("Audio Effects & Sound Safety", () => {
    test("toggleSound safely flips audio preferences without crashing in test environment", () => {
      const initial = isSoundEnabled();
      const toggled = toggleSound();
      expect(toggled).toBe(!initial);

      // Sound functions should execute safely regardless of Web Audio support
      expect(() => playSuccessSound()).not.toThrow();
      expect(() => playLevelUpSound()).not.toThrow();
      expect(() => playAchievementSound()).not.toThrow();
      expect(() => playClickSound()).not.toThrow();

      // Reset back to initial
      if (isSoundEnabled() !== initial) {
        toggleSound();
      }
      expect(isSoundEnabled()).toBe(initial);
    });
  });
});
