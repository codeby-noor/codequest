import { villageLessons, getLessonById, getNextLessonId, getVillageProgress, isVillageComplete } from "../data/lessons";
import { allLessons, worldLessonMap, getLessonsForWorld } from "../data/lessonsIndex";
import { arenaChallenges, getArenaChallengeById } from "../data/arenaChallenges";
import { achievements, reconcileAchievements } from "../data/achievements";
import { DEFAULT_PROGRESS, addXP, completeLesson, unlockLesson } from "../engine/progressEngine";

describe("Village Curriculum & Lessons Expansion", () => {
  test("should have exactly 18 structured village lessons", () => {
    expect(villageLessons).toBeDefined();
    expect(villageLessons.length).toBe(18);
  });

  test("lessons follow the correct numbered sequence 01 to 18", () => {
    villageLessons.forEach((lesson, index) => {
      const expectedNum = String(index + 1).padStart(2, "0");
      expect(lesson.number).toBe(expectedNum);
      expect(lesson.id).toBe(`lesson-${expectedNum}`);
      expect(lesson.world).toBe("village");
      expect(lesson.xp).toBeGreaterThan(0);
      expect(lesson.description).toBeTruthy();
      expect(Array.isArray(lesson.concepts)).toBe(true);
      expect(lesson.concepts.length).toBeGreaterThan(0);
      expect(Array.isArray(lesson.content)).toBe(true);
      expect(lesson.content.length).toBeGreaterThan(0);
      expect(lesson.challenge).toBeDefined();
    });
  });

  test("each challenge has comprehensive data and requirements", () => {
    villageLessons.forEach((lesson) => {
      const ch = lesson.challenge;
      expect(ch.id).toBeTruthy();
      expect(ch.lessonId).toBe(lesson.id);
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
    villageLessons.forEach((lesson) => {
      const { starterCode, solution } = lesson.challenge;
      expect(starterCode.trim()).not.toBe(solution.trim());
    });
  });

  test("lesson 18 is configured as the Village Master boss challenge", () => {
    const bossLesson = villageLessons[17];
    expect(bossLesson.id).toBe("lesson-18");
    expect(bossLesson.type).toBe("boss");
    expect(bossLesson.difficulty).toBe("Boss");
    expect(bossLesson.xp).toBe(500);
    expect(bossLesson.title).toContain("Village Master");
  });

  test("getNextLessonId progresses sequentially from 01 to 18 and terminates", () => {
    for (let i = 1; i <= 17; i++) {
      const currentId = `lesson-${String(i).padStart(2, "0")}`;
      const nextId = `lesson-${String(i + 1).padStart(2, "0")}`;
      expect(getNextLessonId(currentId)).toBe(nextId);
    }
    expect(getNextLessonId("lesson-18")).toBeNull();
  });

  test("getVillageProgress and isVillageComplete calculate accurately", () => {
    const emptyProgress = { completedLessons: [] };
    expect(getVillageProgress(emptyProgress)).toBe(0);
    expect(isVillageComplete(emptyProgress)).toBe(false);

    const halfProgress = {
      completedLessons: villageLessons.slice(0, 9).map((l) => l.id),
    };
    expect(getVillageProgress(halfProgress)).toBe(50);
    expect(isVillageComplete(halfProgress)).toBe(false);

    const fullProgress = {
      completedLessons: villageLessons.map((l) => l.id),
    };
    expect(getVillageProgress(fullProgress)).toBe(100);
    expect(isVillageComplete(fullProgress)).toBe(true);
  });

  test("all lessons are registered in unified lessonsIndex", () => {
    const villageFromIndex = getLessonsForWorld("village");
    expect(villageFromIndex.length).toBe(18);
    expect(worldLessonMap.village.length).toBe(18);
    expect(allLessons.filter((l) => l.world === "village").length).toBe(18);
  });

  test("arena challenges are generated for all 18 village lessons", () => {
    villageLessons.forEach((lesson) => {
      const arenaChallenge = getArenaChallengeById(lesson.challenge.id);
      expect(arenaChallenge).toBeDefined();
      expect(arenaChallenge.lessonId).toBe(lesson.id);
      expect(arenaChallenge.xp).toBe(lesson.xp);
      expect(arenaChallenge.world).toBe("village");
    });
  });

  test("Village Graduate achievement unlocks exclusively when all 18 lessons are complete", () => {
    const achievement = achievements.find((a) => a.id === "village-graduate");
    expect(achievement).toBeDefined();
    expect(achievement.required).toBe(18);

    // 0 completed lessons
    expect(achievement.isComplete({ completedLessons: [] })).toBe(false);

    // 17 completed lessons (one short)
    const partial = { completedLessons: villageLessons.slice(0, 17).map((l) => l.id) };
    expect(achievement.isComplete(partial)).toBe(false);

    // All 18 completed lessons
    const completed = { completedLessons: villageLessons.map((l) => l.id), achievements: [] };
    expect(achievement.isComplete(completed)).toBe(true);

    const result = reconcileAchievements(completed);
    expect(result.newlyUnlocked.some((a) => a.id === "village-graduate")).toBe(true);
    expect(result.progress.achievements).toContain("village-graduate");
  });

  test("progress engine operations are immutable and safe", () => {
    const init = { ...DEFAULT_PROGRESS };
    const withXP = addXP(init, 100);
    expect(withXP.xp).toBe(100);
    expect(init.xp).toBe(0);

    const withLesson = completeLesson(withXP, "lesson-01");
    expect(withLesson.completedLessons).toEqual(["lesson-01"]);
    expect(withXP.completedLessons).toEqual([]);

    const withDuplicate = completeLesson(withLesson, "lesson-01");
    expect(withDuplicate.completedLessons).toEqual(["lesson-01"]);

    const withUnlock = unlockLesson(withDuplicate, "lesson-02");
    expect(withUnlock.unlockedLessons).toContain("lesson-02");
  });

  test("evaluating solutions for all 18 challenges against their test assertions", () => {
    villageLessons.forEach((lesson) => {
      const { solution, tests } = lesson.challenge;
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
