import { worlds, getWorldById, getNextWorld, getWorldPrerequisite } from "../data/worlds";
import { skills, getSkillProgress, isSkillUnlocked, getAllSkillsWithProgress } from "../data/skills";
import { villageLessons } from "../data/lessons";
import {
  DEFAULT_PROGRESS,
  isWorldUnlocked,
  isWorldComplete,
  getWorldProgress,
  applyWorldUnlocks,
  saveProgress,
  loadProgress,
  STORAGE_KEY
} from "../engine/progressEngine";

describe("World Expansion & Progression Architecture", () => {
  test("defines exactly 6 structured worlds in sequence", () => {
    expect(worlds).toBeDefined();
    expect(worlds.length).toBe(6);
    expect(worlds.map((w) => w.id)).toEqual([
      "village",
      "logic-forest",
      "web-kingdom",
      "api-harbor",
      "backend-citadel",
      "developer-realm"
    ]);
  });

  test("JavaScript Village is unlocked initially with default progress", () => {
    expect(isWorldUnlocked("village", DEFAULT_PROGRESS)).toBe(true);
  });

  test("all future worlds are locked initially with default progress", () => {
    const futureWorldIds = [
      "logic-forest",
      "web-kingdom",
      "api-harbor",
      "backend-citadel",
      "developer-realm"
    ];

    futureWorldIds.forEach((worldId) => {
      expect(isWorldUnlocked(worldId, DEFAULT_PROGRESS)).toBe(false);
    });
  });

  test("completing all 18 JavaScript Village lessons unlocks Logic Forest", () => {
    const villageCompletedProgress = {
      ...DEFAULT_PROGRESS,
      completedLessons: villageLessons.map((l) => l.id),
      unlockedWorlds: ["village"]
    };

    // Before applyWorldUnlocks calculation
    expect(isWorldComplete("village", villageCompletedProgress)).toBe(true);
    expect(isWorldUnlocked("logic-forest", villageCompletedProgress)).toBe(true);

    // applyWorldUnlocks should register logic-forest
    const updated = applyWorldUnlocks(villageCompletedProgress);
    expect(updated.unlockedWorlds).toContain("village");
    expect(updated.unlockedWorlds).toContain("logic-forest");
    expect(updated.unlockedWorlds).not.toContain("web-kingdom");
  });

  test("world completion is calculated accurately and never exceeds 100%", () => {
    const emptyProgress = { completedLessons: [] };
    expect(getWorldProgress("village", emptyProgress)).toBe(0);

    const partialProgress = {
      completedLessons: villageLessons.slice(0, 9).map((l) => l.id)
    };
    expect(getWorldProgress("village", partialProgress)).toBe(50);

    const fullProgress = {
      completedLessons: villageLessons.map((l) => l.id)
    };
    expect(getWorldProgress("village", fullProgress)).toBe(100);

    // If somehow extra lessons are marked, percentage is capped at 100
    const overCompletedProgress = {
      completedLessons: [...villageLessons.map((l) => l.id), "extra-lesson-1", "extra-lesson-2"]
    };
    expect(getWorldProgress("village", overCompletedProgress)).toBe(100);
  });

  test("unimplemented future worlds with 0 lessons return 0% and false for completion", () => {
    const fullProgress = {
      completedLessons: villageLessons.map((l) => l.id)
    };
    expect(getWorldProgress("logic-forest", fullProgress)).toBe(0);
    expect(isWorldComplete("logic-forest", fullProgress)).toBe(false);
  });

  test("data-driven world lookup and prerequisite helper functions work correctly", () => {
    expect(getWorldById("village").name).toBe("JavaScript Village");
    expect(getWorldById("logic-forest").name).toBe("The Logic Forest");
    expect(getWorldById("non-existent")).toBeUndefined();

    expect(getNextWorld("village").id).toBe("logic-forest");
    expect(getNextWorld("logic-forest").id).toBe("web-kingdom");
    expect(getNextWorld("developer-realm")).toBeNull();

    expect(getWorldPrerequisite("village")).toBeNull();
    expect(getWorldPrerequisite("logic-forest").id).toBe("village");
    expect(getWorldPrerequisite("web-kingdom").id).toBe("logic-forest");
  });

  test("localStorage serialization and hydration preserves world progression", () => {
    const mockStorage = {};
    const originalLocalStorage = global.localStorage;

    global.localStorage = {
      getItem: (key) => mockStorage[key] || null,
      setItem: (key, val) => {
        mockStorage[key] = String(val);
      },
      removeItem: (key) => {
        delete mockStorage[key];
      },
      clear: () => {
        Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
      }
    };

    const initialProgress = {
      ...DEFAULT_PROGRESS,
      completedLessons: villageLessons.map((l) => l.id),
      unlockedWorlds: ["village", "logic-forest"],
      xp: 2450,
      level: 9
    };

    saveProgress(initialProgress);
    const loadedProgress = loadProgress();

    expect(loadedProgress.completedLessons.length).toBe(18);
    expect(loadedProgress.unlockedWorlds).toContain("village");
    expect(loadedProgress.unlockedWorlds).toContain("logic-forest");
    expect(isWorldUnlocked("logic-forest", loadedProgress)).toBe(true);
    expect(loadedProgress.xp).toBe(2450);
    expect(loadedProgress.level).toBe(9);

    global.localStorage = originalLocalStorage;
  });

  test("skill system correctly computes live progress and unlock status", () => {
    expect(skills.length).toBeGreaterThanOrEqual(13);

    // Initial state: Variables skill
    const initialProgress = { completedLessons: [] };
    expect(getSkillProgress("variables", initialProgress)).toBe(0);
    expect(isSkillUnlocked("variables", initialProgress)).toBe(false);

    // Single-lesson skill completion (Variables -> lesson-01)
    const completedVariablesProgress = { completedLessons: ["lesson-01"] };
    expect(getSkillProgress("variables", completedVariablesProgress)).toBe(100);
    expect(isSkillUnlocked("variables", completedVariablesProgress)).toBe(true);

    // Multi-lesson skill partial completion (Algorithmic Thinking -> lesson-17, lesson-18)
    const partialProblemSolvingProgress = { completedLessons: ["lesson-17"] };
    expect(getSkillProgress("problem-solving", partialProblemSolvingProgress)).toBe(50);
    expect(isSkillUnlocked("problem-solving", partialProblemSolvingProgress)).toBe(true);

    // Multi-lesson skill full completion
    const fullProblemSolvingProgress = { completedLessons: ["lesson-17", "lesson-18"] };
    expect(getSkillProgress("problem-solving", fullProblemSolvingProgress)).toBe(100);
    expect(isSkillUnlocked("problem-solving", fullProblemSolvingProgress)).toBe(true);

    // All skills with progress helper
    const allSkills = getAllSkillsWithProgress(completedVariablesProgress);
    const varSkill = allSkills.find((s) => s.id === "variables");
    expect(varSkill.progress).toBe(100);
    expect(varSkill.isUnlocked).toBe(true);
  });
});
