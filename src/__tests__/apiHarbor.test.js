import {
  apiHarborLessons,
  getApiHarborLessonById,
  getNextApiHarborLessonId,
  getApiHarborProgress,
  isApiHarborComplete,
} from "../data/apiHarborLessons";
import { villageLessons } from "../data/lessons";
import { logicForestLessons } from "../data/logicForestLessons";
import { webKingdomLessons } from "../data/webKingdomLessons";
import { allLessons, worldLessonMap, getLessonsForWorld, getNextLessonId } from "../data/lessonsIndex";
import { arenaChallenges, getArenaChallengeById } from "../data/arenaChallenges";
import { achievements, reconcileAchievements } from "../data/achievements";
import { validateChallenge } from "../engine/challengeEngine";
import {
  DEFAULT_PROGRESS,
  isWorldUnlocked,
  isWorldComplete,
  getWorldProgress,
  applyWorldUnlocks,
} from "../engine/progressEngine";

describe("World 4: The API Harbor — Curriculum, Async Execution & Progression", () => {
  test("1. should have exactly 16 structured API Harbor missions", () => {
    expect(apiHarborLessons).toBeDefined();
    expect(apiHarborLessons.length).toBe(16);
  });

  test("2. missions follow sequential numbering 01 to 16 with harbor- prefix", () => {
    apiHarborLessons.forEach((mission, index) => {
      const expectedNum = String(index + 1).padStart(2, "0");
      expect(mission.number).toBe(expectedNum);
      expect(mission.id).toBe(`harbor-${expectedNum}`);
      expect(mission.world).toBe("api-harbor");
      expect(mission.xp).toBeGreaterThan(0);
      expect(mission.description).toBeTruthy();
      expect(Array.isArray(mission.concepts)).toBe(true);
      expect(mission.concepts.length).toBeGreaterThan(0);
      expect(Array.isArray(mission.content)).toBe(true);
      expect(mission.content.length).toBeGreaterThan(0);
      expect(mission.challenge).toBeDefined();
    });
  });

  test("3. all missions have worldId api-harbor and challengeType javascript", () => {
    apiHarborLessons.forEach((mission) => {
      expect(mission.world).toBe("api-harbor");
      expect(mission.challengeType).toBe("javascript");
    });
  });

  test("4. each mission challenge has comprehensive metadata, tests, hints, requirements and solution explanation", () => {
    apiHarborLessons.forEach((mission) => {
      const ch = mission.challenge;
      expect(ch.id).toBeTruthy();
      expect(ch.lessonId).toBe(mission.id);
      expect(ch.title).toBeTruthy();
      expect(ch.prompt).toBeTruthy();
      expect(ch.starterCode).toBeDefined();
      expect(ch.solution).toBeTruthy();
      expect(ch.solutionExplanation).toBeTruthy();
      expect(Array.isArray(ch.hints)).toBe(true);
      expect(ch.hints.length).toBeGreaterThanOrEqual(2);
      expect(Array.isArray(ch.tests)).toBe(true);
      expect(ch.tests.length).toBeGreaterThanOrEqual(1);
      expect(Array.isArray(ch.requirements)).toBe(true);
      expect(ch.requirements.length).toBeGreaterThanOrEqual(1);
    });
  });

  test("5. starter code is distinct from final solution (not pre-solved)", () => {
    apiHarborLessons.forEach((mission) => {
      const { starterCode, solution } = mission.challenge;
      expect(starterCode.trim()).not.toBe(solution.trim());
    });
  });

  test("6. Mission 01 solution passes challenge validation (API message classification)", async () => {
    const lesson = getApiHarborLessonById("harbor-01");
    const result = await validateChallenge(lesson.challenge.solution, lesson.challenge);
    expect(result.passed).toBe(true);
  });

  test("7. Mission 02 solution passes challenge validation (HTTP envelope parsing)", async () => {
    const lesson = getApiHarborLessonById("harbor-02");
    const result = await validateChallenge(lesson.challenge.solution, lesson.challenge);
    expect(result.passed).toBe(true);
  });

  test("8. Mission 03 solution passes challenge validation (REST Route Map)", async () => {
    const lesson = getApiHarborLessonById("harbor-03");
    const result = await validateChallenge(lesson.challenge.solution, lesson.challenge);
    expect(result.passed).toBe(true);
  });

  test("9. Mission 04 solution passes challenge validation (JSON Cargo manifest parsing)", async () => {
    const lesson = getApiHarborLessonById("harbor-04");
    const result = await validateChallenge(lesson.challenge.solution, lesson.challenge);
    expect(result.passed).toBe(true);
  });

  test("10. Mission 05 solution passes challenge validation (GET Expedition async fetch)", async () => {
    const lesson = getApiHarborLessonById("harbor-05");
    const result = await validateChallenge(lesson.challenge.solution, lesson.challenge);
    expect(result.passed).toBe(true);
  });

  test("11. Mission 06 solution passes challenge validation (POST Dock data creation)", async () => {
    const lesson = getApiHarborLessonById("harbor-06");
    const result = await validateChallenge(lesson.challenge.solution, lesson.challenge);
    expect(result.passed).toBe(true);
  });

  test("12. Mission 07 solution passes challenge validation (PATCH Update Wharf)", async () => {
    const lesson = getApiHarborLessonById("harbor-07");
    const result = await validateChallenge(lesson.challenge.solution, lesson.challenge);
    expect(result.passed).toBe(true);
  });

  test("13. Mission 08 solution passes challenge validation (DELETE Dock)", async () => {
    const lesson = getApiHarborLessonById("harbor-08");
    const result = await validateChallenge(lesson.challenge.solution, lesson.challenge);
    expect(result.passed).toBe(true);
  });

  test("14. Mission 09 solution passes challenge validation (Status Lighthouse categories)", async () => {
    const lesson = getApiHarborLessonById("harbor-09");
    const result = await validateChallenge(lesson.challenge.solution, lesson.challenge);
    expect(result.passed).toBe(true);
  });

  test("15. Mission 10 solution passes challenge validation (Error Storm try/catch & fallbacks)", async () => {
    const lesson = getApiHarborLessonById("harbor-10");
    const result = await validateChallenge(lesson.challenge.solution, lesson.challenge);
    expect(result.passed).toBe(true);
  });

  test("16. Mission 11 solution passes challenge validation (Promise.all concurrent tide)", async () => {
    const lesson = getApiHarborLessonById("harbor-11");
    const result = await validateChallenge(lesson.challenge.solution, lesson.challenge);
    expect(result.passed).toBe(true);
  });

  test("17. Mission 12 solution passes challenge validation (Bearer token Harbor Guard)", async () => {
    const lesson = getApiHarborLessonById("harbor-12");
    const result = await validateChallenge(lesson.challenge.solution, lesson.challenge);
    expect(result.passed).toBe(true);
  });

  test("18. Mission 13 solution passes challenge validation (Data Pipeline payload transforms)", async () => {
    const lesson = getApiHarborLessonById("harbor-13");
    const result = await validateChallenge(lesson.challenge.solution, lesson.challenge);
    expect(result.passed).toBe(true);
  });

  test("19. Mission 14 solution passes challenge validation (Retry Bay resilience loop)", async () => {
    const lesson = getApiHarborLessonById("harbor-14");
    const result = await validateChallenge(lesson.challenge.solution, lesson.challenge);
    expect(result.passed).toBe(true);
  });

  test("20. Mission 15 mini-project solution passes challenge validation (Port Dispatcher Client)", async () => {
    const lesson = getApiHarborLessonById("harbor-15");
    const result = await validateChallenge(lesson.challenge.solution, lesson.challenge);
    expect(result.passed).toBe(true);
  });

  test("21. Mission 16 is configured as The API Harbor Guardian boss battle with 750 XP", async () => {
    const guardian = apiHarborLessons[15];
    expect(guardian.id).toBe("harbor-16");
    expect(guardian.type).toBe("boss");
    expect(guardian.difficulty).toBe("Boss");
    expect(guardian.xp).toBe(750);
    expect(guardian.title).toContain("Guardian");

    const result = await validateChallenge(guardian.challenge.solution, guardian.challenge);
    expect(result.passed).toBe(true);
  });

  test("22. getNextApiHarborLessonId and getNextLessonId progress sequentially and terminate", () => {
    for (let i = 1; i <= 15; i++) {
      const currentId = `harbor-${String(i).padStart(2, "0")}`;
      const nextId = `harbor-${String(i + 1).padStart(2, "0")}`;
      expect(getNextApiHarborLessonId(currentId)).toBe(nextId);
      expect(getNextLessonId(currentId)).toBe(nextId);
    }
    expect(getNextApiHarborLessonId("harbor-16")).toBeNull();
    expect(getNextLessonId("harbor-16")).toBeNull();
  });

  test("23. API Harbor is locked before Web Kingdom completion and unlocks after Web Kingdom completion", () => {
    const initialProgress = { ...DEFAULT_PROGRESS };
    expect(isWorldUnlocked("api-harbor", initialProgress)).toBe(false);

    const partialWebProgress = {
      ...DEFAULT_PROGRESS,
      completedLessons: [
        ...villageLessons.map((l) => l.id),
        ...logicForestLessons.map((l) => l.id),
        ...webKingdomLessons.slice(0, 15).map((l) => l.id),
      ],
    };
    expect(isWorldUnlocked("api-harbor", partialWebProgress)).toBe(false);

    const completedWebProgress = {
      ...DEFAULT_PROGRESS,
      completedLessons: [
        ...villageLessons.map((l) => l.id),
        ...logicForestLessons.map((l) => l.id),
        ...webKingdomLessons.map((l) => l.id),
      ],
    };
    expect(isWorldComplete("web-kingdom", completedWebProgress)).toBe(true);
    expect(isWorldUnlocked("api-harbor", completedWebProgress)).toBe(true);

    const afterApply = applyWorldUnlocks(completedWebProgress);
    expect(afterApply.unlockedWorlds).toContain("api-harbor");
    expect(afterApply.unlockedLessons).toContain("harbor-01");
  });

  test("24. getApiHarborProgress and isApiHarborComplete calculate accurately", () => {
    const empty = { completedLessons: [] };
    expect(getApiHarborProgress(empty)).toBe(0);
    expect(isApiHarborComplete(empty)).toBe(false);

    const partial = {
      completedLessons: apiHarborLessons.slice(0, 8).map((l) => l.id),
    };
    expect(getApiHarborProgress(partial)).toBe(50);
    expect(isApiHarborComplete(partial)).toBe(false);

    const full = {
      completedLessons: apiHarborLessons.map((l) => l.id),
    };
    expect(getApiHarborProgress(full)).toBe(100);
    expect(isApiHarborComplete(full)).toBe(true);
  });

  test("25. completing all 16 API Harbor missions marks API Harbor complete and unlocks World 5: The Backend Citadel", () => {
    const fullHarborProgress = {
      ...DEFAULT_PROGRESS,
      completedLessons: [
        ...villageLessons.map((l) => l.id),
        ...logicForestLessons.map((l) => l.id),
        ...webKingdomLessons.map((l) => l.id),
        ...apiHarborLessons.map((l) => l.id),
      ],
    };

    expect(isWorldComplete("api-harbor", fullHarborProgress)).toBe(true);
    expect(isWorldUnlocked("backend-citadel", fullHarborProgress)).toBe(true);

    const afterApply = applyWorldUnlocks(fullHarborProgress);
    expect(afterApply.unlockedWorlds).toContain("backend-citadel");
  });

  test("26. all 16 API Harbor missions are registered in unified lessonsIndex and worldLessonMap", () => {
    const fromIndex = getLessonsForWorld("api-harbor");
    expect(fromIndex.length).toBe(16);
    expect(worldLessonMap["api-harbor"].length).toBe(16);
    expect(allLessons.filter((l) => l.world === "api-harbor").length).toBe(16);
  });

  test("27. arena challenges are generated for all 16 API Harbor missions", () => {
    apiHarborLessons.forEach((mission) => {
      const arenaChallenge = getArenaChallengeById(mission.challenge.id);
      expect(arenaChallenge).toBeDefined();
      expect(arenaChallenge.lessonId).toBe(mission.id);
      expect(arenaChallenge.xp).toBe(mission.xp);
      expect(arenaChallenge.world).toBe("api-harbor");
    });
  });

  test("28. Harbor Captain achievement unlocks exclusively when all 16 API Harbor missions are complete", () => {
    const achievement = achievements.find((a) => a.id === "harbor-captain");
    expect(achievement).toBeDefined();
    expect(achievement.required).toBe(16);

    // 0 completed
    expect(achievement.isComplete({ completedLessons: [] })).toBe(false);

    // 15 completed (1 short)
    const partial = { completedLessons: apiHarborLessons.slice(0, 15).map((l) => l.id) };
    expect(achievement.isComplete(partial)).toBe(false);

    // All 16 completed
    const full = {
      completedLessons: apiHarborLessons.map((l) => l.id),
      achievements: [],
    };
    expect(achievement.isComplete(full)).toBe(true);

    const result = reconcileAchievements(full);
    expect(result.newlyUnlocked.some((a) => a.id === "harbor-captain")).toBe(true);
    expect(result.progress.achievements).toContain("harbor-captain");
  });

  test("29. all 16 API Harbor challenge solutions pass their validation test suites", async () => {
    for (const mission of apiHarborLessons) {
      const { solution } = mission.challenge;
      const res = await validateChallenge(solution, mission.challenge);
      expect(res.passed).toBe(true);
      expect(res.results.every((r) => r.success)).toBe(true);
    }
  });
});
