import {
  DEFAULT_PROGRESS,
  completeLesson,
  unlockLesson,
  addXP,
  applyWorldUnlocks,
  isWorldUnlocked,
  isWorldComplete,
  isGameComplete,
  getWorldProgress,
  loadProgress,
  saveProgress,
} from "../engine/progressEngine";
import { getLevelInfo } from "../engine/levelEngine";
import { achievements, reconcileAchievements } from "../data/achievements";
import { worlds, getWorldById } from "../data/worlds";
import { allLessons, getLessonById, getNextLessonId } from "../data/lessonsIndex";
import { arenaChallenges, getArenaChallengesByWorld } from "../data/arenaChallenges";
import { getAllSkillsWithProgress, getSkillProgress } from "../data/skills";
import { createMockGitRepo } from "../engine/gitSimulator";
import { createMockDb, createMockApp } from "../engine/backendSimulator";

describe("Phase 8 — Final Gameplay QA, Progression & Polish Verification", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("1. Fresh player starts with pristine default state", () => {
    const fresh = loadProgress();
    expect(fresh.xp).toBe(0);
    expect(fresh.completedLessons).toEqual([]);
    expect(fresh.unlockedWorlds).toContain("village");
    expect(fresh.unlockedLessons).toContain("lesson-01");
    expect(fresh.streak).toBe(0);

    const level = getLevelInfo(fresh.xp);
    expect(level.level).toBe(1);
    expect(level.title).toBe("Novice Coder");
  });

  test("2. Sequential lesson progression and unlocking works smoothly", () => {
    let progress = { ...DEFAULT_PROGRESS };
    expect(progress.unlockedLessons).toContain("lesson-01");

    // Complete lesson-01
    const lesson1 = getLessonById("lesson-01");
    progress = completeLesson(progress, "lesson-01");
    const nextId = getNextLessonId("lesson-01");
    expect(nextId).toBe("lesson-02");
    progress = unlockLesson(progress, nextId);
    progress = addXP(progress, lesson1.xp);

    expect(progress.completedLessons).toContain("lesson-01");
    expect(progress.unlockedLessons).toContain("lesson-02");
    expect(progress.xp).toBe(lesson1.xp);
  });

  test("3. Replay idempotency: completing an already completed lesson does not duplicate XP or entries", () => {
    let progress = {
      ...DEFAULT_PROGRESS,
      xp: 100,
      completedLessons: ["lesson-01"],
      unlockedLessons: ["lesson-01", "lesson-02"],
    };

    // Attempt to complete lesson-01 again
    const same = completeLesson(progress, "lesson-01");
    expect(same.completedLessons).toHaveLength(1);
    expect(same.completedLessons).toEqual(["lesson-01"]);
  });

  test("4. World unlocking progression strictly follows the 6-world path", () => {
    const villageIds = Array.from({ length: 18 }, (_, i) => `lesson-${String(i + 1).padStart(2, "0")}`);
    const forestIds = Array.from({ length: 15 }, (_, i) => `forest-${String(i + 1).padStart(2, "0")}`);
    const webIds = Array.from({ length: 16 }, (_, i) => `web-${String(i + 1).padStart(2, "0")}`);
    const harborIds = Array.from({ length: 16 }, (_, i) => `harbor-${String(i + 1).padStart(2, "0")}`);
    const citadelIds = Array.from({ length: 16 }, (_, i) => `citadel-${String(i + 1).padStart(2, "0")}`);
    const realmIds = Array.from({ length: 16 }, (_, i) => `realm-${String(i + 1).padStart(2, "0")}`);

    let progress = { ...DEFAULT_PROGRESS, completedLessons: [] };
    expect(isWorldUnlocked("village", progress)).toBe(true);
    expect(isWorldUnlocked("logic-forest", progress)).toBe(false);

    // Complete Village -> Unlocks Logic Forest
    progress.completedLessons = [...villageIds];
    expect(isWorldComplete("village", progress)).toBe(true);
    expect(isWorldUnlocked("logic-forest", progress)).toBe(true);
    expect(isWorldUnlocked("web-kingdom", progress)).toBe(false);

    // Complete Logic Forest -> Unlocks Web Kingdom
    progress.completedLessons = [...villageIds, ...forestIds];
    expect(isWorldComplete("logic-forest", progress)).toBe(true);
    expect(isWorldUnlocked("web-kingdom", progress)).toBe(true);
    expect(isWorldUnlocked("api-harbor", progress)).toBe(false);

    // Complete Web Kingdom -> Unlocks API Harbor
    progress.completedLessons = [...villageIds, ...forestIds, ...webIds];
    expect(isWorldComplete("web-kingdom", progress)).toBe(true);
    expect(isWorldUnlocked("api-harbor", progress)).toBe(true);
    expect(isWorldUnlocked("backend-citadel", progress)).toBe(false);

    // Complete API Harbor -> Unlocks Backend Citadel
    progress.completedLessons = [...villageIds, ...forestIds, ...webIds, ...harborIds];
    expect(isWorldComplete("api-harbor", progress)).toBe(true);
    expect(isWorldUnlocked("backend-citadel", progress)).toBe(true);
    expect(isWorldUnlocked("developer-realm", progress)).toBe(false);

    // Complete Backend Citadel -> Unlocks Developer Realm
    progress.completedLessons = [...villageIds, ...forestIds, ...webIds, ...harborIds, ...citadelIds];
    expect(isWorldComplete("backend-citadel", progress)).toBe(true);
    expect(isWorldUnlocked("developer-realm", progress)).toBe(true);

    // Complete Developer Realm -> Full CodeQuest Mastery
    progress.completedLessons = [...villageIds, ...forestIds, ...webIds, ...harborIds, ...citadelIds, ...realmIds];
    expect(isWorldComplete("developer-realm", progress)).toBe(true);
    expect(isGameComplete(progress)).toBe(true);
  });

  test("5. Total missions across all 6 worlds equals exactly 97", () => {
    const mainWorldIds = ["village", "logic-forest", "web-kingdom", "api-harbor", "backend-citadel", "developer-realm"];
    const totalMissions = worlds
      .filter((w) => mainWorldIds.includes(w.id))
      .reduce((sum, w) => sum + (w.totalLessons || w.missions || 0), 0);
    expect(totalMissions).toBe(97);
  });

  test("6. Level engine scales XP cleanly with progression", () => {
    expect(getLevelInfo(0).level).toBe(1);
    expect(getLevelInfo(1000).level).toBe(2);
    expect(getLevelInfo(2500).level).toBe(3);
    expect(getLevelInfo(12000).level).toBe(6);
  });

  test("7. Achievement system reconciles correctly and idempotently", () => {
    const progress = {
      ...DEFAULT_PROGRESS,
      xp: 1200,
      completedLessons: ["lesson-01"],
      achievements: [],
    };

    const firstRun = reconcileAchievements(progress);
    expect(firstRun.newlyUnlocked.some((a) => a.id === "first-steps")).toBe(true);
    expect(firstRun.progress.achievements).toContain("first-steps");

    // Second run should not duplicate newlyUnlocked
    const secondRun = reconcileAchievements(firstRun.progress);
    expect(secondRun.newlyUnlocked).toHaveLength(0);
  });

  test("8. Code Arena challenges exist for all 6 worlds", () => {
    const arenaMap = getArenaChallengesByWorld();
    expect(arenaMap.village.length).toBe(18);
    expect(arenaMap["logic-forest"].length).toBe(15);
    expect(arenaMap["web-kingdom"].length).toBe(16);
    expect(arenaMap["api-harbor"].length).toBe(16);
    expect(arenaMap["backend-citadel"].length).toBe(16);
    expect(arenaMap["developer-realm"].length).toBe(16);
  });

  test("9. Skills breakdown calculates live progress correctly", () => {
    const progress = {
      completedLessons: ["realm-01", "realm-02"],
    };
    const skillProgress = getSkillProgress("developer-workflow", progress);
    expect(skillProgress).toBe(50); // 2 of 4 lessons completed
  });
});
