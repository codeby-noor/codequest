import {
  logicForestLessons,
  getLogicForestLessonById,
  getNextLogicForestLessonId,
  getLogicForestProgress,
  isLogicForestComplete,
} from "../data/logicForestLessons";
import { villageLessons } from "../data/lessons";
import { allLessons, worldLessonMap, getLessonsForWorld, getNextLessonId } from "../data/lessonsIndex";
import { arenaChallenges, getArenaChallengeById } from "../data/arenaChallenges";
import { achievements, reconcileAchievements } from "../data/achievements";
import {
  DEFAULT_PROGRESS,
  isWorldUnlocked,
  isWorldComplete,
  getWorldProgress,
  applyWorldUnlocks,
} from "../engine/progressEngine";

describe("World 2: The Logic Forest — Curriculum & Progression", () => {
  test("should have exactly 15 structured Logic Forest missions", () => {
    expect(logicForestLessons).toBeDefined();
    expect(logicForestLessons.length).toBe(15);
  });

  test("missions follow the sequential numbering 01 to 15 with forest- prefix", () => {
    logicForestLessons.forEach((mission, index) => {
      const expectedNum = String(index + 1).padStart(2, "0");
      expect(mission.number).toBe(expectedNum);
      expect(mission.id).toBe(`forest-${expectedNum}`);
      expect(mission.world).toBe("logic-forest");
      expect(mission.xp).toBeGreaterThan(0);
      expect(mission.description).toBeTruthy();
      expect(Array.isArray(mission.concepts)).toBe(true);
      expect(mission.concepts.length).toBeGreaterThan(0);
      expect(Array.isArray(mission.content)).toBe(true);
      expect(mission.content.length).toBeGreaterThan(0);
      expect(mission.challenge).toBeDefined();
    });
  });

  test("each mission challenge has comprehensive metadata, tests, hints, and requirements", () => {
    logicForestLessons.forEach((mission) => {
      const ch = mission.challenge;
      expect(ch.id).toBeTruthy();
      expect(ch.lessonId).toBe(mission.id);
      expect(ch.title).toBeTruthy();
      expect(ch.prompt).toBeTruthy();
      expect(ch.starterCode).toBeDefined();
      expect(ch.solution).toBeTruthy();
      expect(Array.isArray(ch.hints)).toBe(true);
      expect(ch.hints.length).toBeGreaterThanOrEqual(2);
      expect(Array.isArray(ch.tests)).toBe(true);
      expect(ch.tests.length).toBeGreaterThanOrEqual(1);
      expect(Array.isArray(ch.requirements)).toBe(true);
      expect(ch.requirements.length).toBeGreaterThanOrEqual(1);
    });
  });

  test("starter code is distinct from final solution (requires user implementation)", () => {
    logicForestLessons.forEach((mission) => {
      const { starterCode, solution } = mission.challenge;
      expect(starterCode.trim()).not.toBe(solution.trim());
    });
  });

  test("mission 15 is configured as The Forest Guardian boss battle", () => {
    const boss = logicForestLessons[14];
    expect(boss.id).toBe("forest-15");
    expect(boss.type).toBe("boss");
    expect(boss.difficulty).toBe("Boss");
    expect(boss.xp).toBe(600);
    expect(boss.title).toContain("Forest Guardian");
  });

  test("getNextLogicForestLessonId and getNextLessonId progress sequentially and terminate", () => {
    for (let i = 1; i <= 14; i++) {
      const currentId = `forest-${String(i).padStart(2, "0")}`;
      const nextId = `forest-${String(i + 1).padStart(2, "0")}`;
      expect(getNextLogicForestLessonId(currentId)).toBe(nextId);
      expect(getNextLessonId(currentId)).toBe(nextId);
    }
    expect(getNextLogicForestLessonId("forest-15")).toBeNull();
    expect(getNextLessonId("forest-15")).toBeNull();
  });

  test("Logic Forest is locked before Village completion and unlocks after Village completion", () => {
    const initialProgress = { ...DEFAULT_PROGRESS };
    expect(isWorldUnlocked("logic-forest", initialProgress)).toBe(false);

    const completedVillageProgress = {
      ...DEFAULT_PROGRESS,
      completedLessons: villageLessons.map((l) => l.id),
    };
    expect(isWorldComplete("village", completedVillageProgress)).toBe(true);
    expect(isWorldUnlocked("logic-forest", completedVillageProgress)).toBe(true);

    const afterApply = applyWorldUnlocks(completedVillageProgress);
    expect(afterApply.unlockedWorlds).toContain("logic-forest");
    expect(afterApply.unlockedLessons).toContain("forest-01");
  });

  test("getLogicForestProgress and isLogicForestComplete calculate accurately", () => {
    const empty = { completedLessons: [] };
    expect(getLogicForestProgress(empty)).toBe(0);
    expect(isLogicForestComplete(empty)).toBe(false);

    const partial = {
      completedLessons: logicForestLessons.slice(0, 5).map((l) => l.id),
    };
    expect(getLogicForestProgress(partial)).toBe(33);
    expect(isLogicForestComplete(partial)).toBe(false);

    const full = {
      completedLessons: logicForestLessons.map((l) => l.id),
    };
    expect(getLogicForestProgress(full)).toBe(100);
    expect(isLogicForestComplete(full)).toBe(true);
  });

  test("completing all 15 Logic Forest missions unlocks World 3: The Web Kingdom", () => {
    const fullForestProgress = {
      ...DEFAULT_PROGRESS,
      completedLessons: [
        ...villageLessons.map((l) => l.id),
        ...logicForestLessons.map((l) => l.id),
      ],
    };

    expect(isWorldComplete("logic-forest", fullForestProgress)).toBe(true);
    expect(isWorldUnlocked("web-kingdom", fullForestProgress)).toBe(true);

    const afterApply = applyWorldUnlocks(fullForestProgress);
    expect(afterApply.unlockedWorlds).toContain("web-kingdom");
  });

  test("all 15 Logic Forest missions are registered in unified lessonsIndex", () => {
    const fromIndex = getLessonsForWorld("logic-forest");
    expect(fromIndex.length).toBe(15);
    expect(worldLessonMap["logic-forest"].length).toBe(15);
    expect(allLessons.filter((l) => l.world === "logic-forest").length).toBe(15);
  });

  test("arena challenges are generated for all 15 Logic Forest missions", () => {
    logicForestLessons.forEach((mission) => {
      const arenaChallenge = getArenaChallengeById(mission.challenge.id);
      expect(arenaChallenge).toBeDefined();
      expect(arenaChallenge.lessonId).toBe(mission.id);
      expect(arenaChallenge.xp).toBe(mission.xp);
      expect(arenaChallenge.world).toBe("logic-forest");
    });
  });

  test("Forest Conqueror achievement unlocks exclusively when all 15 Logic Forest missions are complete", () => {
    const achievement = achievements.find((a) => a.id === "forest-conqueror");
    expect(achievement).toBeDefined();
    expect(achievement.required).toBe(15);

    // 0 completed
    expect(achievement.isComplete({ completedLessons: [] })).toBe(false);

    // 14 completed (1 short)
    const partial = { completedLessons: logicForestLessons.slice(0, 14).map((l) => l.id) };
    expect(achievement.isComplete(partial)).toBe(false);

    // All 15 completed
    const full = {
      completedLessons: logicForestLessons.map((l) => l.id),
      achievements: [],
    };
    expect(achievement.isComplete(full)).toBe(true);

    const result = reconcileAchievements(full);
    expect(result.newlyUnlocked.some((a) => a.id === "forest-conqueror")).toBe(true);
    expect(result.progress.achievements).toContain("forest-conqueror");
  });

  test("evaluating solutions for all 15 Logic Forest challenges against their test assertions", () => {
    logicForestLessons.forEach((mission) => {
      const { solution, tests } = mission.challenge;
      expect(() => {
        const fn = new Function(`
          "use strict";
          ${solution}
          return {
            ${tests
              .map((t) => {
                if (t.type === "variable" || t.type === "array") return `"${t.name}": typeof ${t.name} !== "undefined" ? ${t.name} : undefined`;
                if (t.type === "function") return `"${t.functionName}": typeof ${t.functionName} !== "undefined" ? ${t.functionName} : undefined`;
                return "";
              })
              .filter(Boolean)
              .join(",\n")}
          };
        `);
        const scope = fn();

        tests.forEach((test) => {
          if (test.type === "variable" || test.type === "array") {
            expect(scope[test.name]).toEqual(test.expected);
          } else if (test.type === "function") {
            const userFn = scope[test.functionName];
            expect(typeof userFn).toBe("function");
            const result = userFn(...(test.args || []));
            expect(result).toEqual(test.expected);
          }
        });
      }).not.toThrow();
    });
  });
});
