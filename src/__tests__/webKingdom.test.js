import {
  webKingdomLessons,
  getWebKingdomLessonById,
  getNextWebKingdomLessonId,
  getWebKingdomProgress,
  isWebKingdomComplete,
} from "../data/webKingdomLessons";
import { villageLessons } from "../data/lessons";
import { logicForestLessons } from "../data/logicForestLessons";
import { allLessons, worldLessonMap, getLessonsForWorld, getNextLessonId } from "../data/lessonsIndex";
import { arenaChallenges, getArenaChallengeById } from "../data/arenaChallenges";
import { achievements, reconcileAchievements } from "../data/achievements";
import { validateHtmlCssChallenge } from "../engine/htmlCssValidator";
import { validateChallenge, CHALLENGE_TYPES } from "../engine/challengeValidator";
import {
  DEFAULT_PROGRESS,
  isWorldUnlocked,
  isWorldComplete,
  getWorldProgress,
  applyWorldUnlocks,
} from "../engine/progressEngine";

describe("World 3: The Web Kingdom — Curriculum, Execution Sandbox & Progression", () => {
  test("1. should have exactly 16 structured Web Kingdom missions", () => {
    expect(webKingdomLessons).toBeDefined();
    expect(webKingdomLessons.length).toBe(16);
  });

  test("2. missions follow sequential numbering 01 to 16 with web- prefix", () => {
    webKingdomLessons.forEach((mission, index) => {
      const expectedNum = String(index + 1).padStart(2, "0");
      expect(mission.number).toBe(expectedNum);
      expect(mission.id).toBe(`web-${expectedNum}`);
      expect(mission.world).toBe("web-kingdom");
      expect(mission.xp).toBeGreaterThan(0);
      expect(mission.description).toBeTruthy();
      expect(Array.isArray(mission.concepts)).toBe(true);
      expect(mission.concepts.length).toBeGreaterThan(0);
      expect(Array.isArray(mission.content)).toBe(true);
      expect(mission.content.length).toBeGreaterThan(0);
      expect(mission.challenge).toBeDefined();
    });
  });

  test("3. all missions have worldId web-kingdom and correct challengeType", () => {
    webKingdomLessons.forEach((mission) => {
      expect(mission.world).toBe("web-kingdom");
      expect(["html", "css", "html-css", "dom"]).toContain(mission.challengeType);
    });
  });

  test("4. each mission challenge has comprehensive metadata, tests, hints, requirements and solution explanation", () => {
    webKingdomLessons.forEach((mission) => {
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
    webKingdomLessons.forEach((mission) => {
      const { starterCode, solution } = mission.challenge;
      expect(starterCode.trim()).not.toBe(solution.trim());
    });
  });

  test("6. HTML challenge validation verifies structure and attributes (Mission 01 - 03)", async () => {
    // Mission 01 — Kingdom Gate
    const gateMission = getWebKingdomLessonById("web-01");
    const gateResult = await validateHtmlCssChallenge(gateMission.challenge.solution, gateMission.challenge.tests);
    expect(gateResult.passed).toBe(true);
    expect(gateResult.passCount).toBe(gateMission.challenge.tests.length);

    // Failing case with incomplete HTML
    const failingResult = await validateHtmlCssChallenge("<div>Broken Gate</div>", gateMission.challenge.tests);
    expect(failingResult.passed).toBe(false);

    // Mission 02 — Semantic Hall
    const semanticMission = getWebKingdomLessonById("web-02");
    const semanticResult = await validateHtmlCssChallenge(semanticMission.challenge.solution, semanticMission.challenge.tests);
    expect(semanticResult.passed).toBe(true);

    // Mission 03 — Form Tavern
    const formMission = getWebKingdomLessonById("web-03");
    const formResult = await validateHtmlCssChallenge(formMission.challenge.solution, formMission.challenge.tests);
    expect(formResult.passed).toBe(true);
  });

  test("7. CSS styling and layout validation works (Mission 04 - 08)", async () => {
    // Mission 04 — Style Forge
    const forge = getWebKingdomLessonById("web-04");
    const forgeResult = await validateHtmlCssChallenge(forge.challenge.solution, forge.challenge.tests);
    expect(forgeResult.passed).toBe(true);

    // Mission 06 — Flexbox Bridge
    const flex = getWebKingdomLessonById("web-06");
    const flexResult = await validateHtmlCssChallenge(flex.challenge.solution, flex.challenge.tests);
    expect(flexResult.passed).toBe(true);

    // Mission 07 — Grid Citadel
    const grid = getWebKingdomLessonById("web-07");
    const gridResult = await validateHtmlCssChallenge(grid.challenge.solution, grid.challenge.tests);
    expect(gridResult.passed).toBe(true);

    // Mission 08 — Responsive Realm
    const responsive = getWebKingdomLessonById("web-08");
    const respResult = await validateHtmlCssChallenge(responsive.challenge.solution, responsive.challenge.tests);
    expect(respResult.passed).toBe(true);
  });

  test("8. DOM manipulation challenges execute and mutate element state (Mission 09 & 12)", async () => {
    // Mission 09 — DOM Library
    const domMission = getWebKingdomLessonById("web-09");
    const domResult = await validateHtmlCssChallenge(domMission.challenge.solution, domMission.challenge.tests);
    expect(domResult.passed).toBe(true);

    // Mission 12 — Dynamic Marketplace
    const market = getWebKingdomLessonById("web-12");
    const marketResult = await validateHtmlCssChallenge(market.challenge.solution, market.challenge.tests);
    expect(marketResult.passed).toBe(true);
  });

  test("9. Browser event dispatching and handler challenge validation (Mission 10)", async () => {
    const eventMission = getWebKingdomLessonById("web-10");
    const eventResult = await validateHtmlCssChallenge(eventMission.challenge.solution, eventMission.challenge.tests);
    expect(eventResult.passed).toBe(true);
  });

  test("10. Form submission and input validation challenge works (Mission 11)", async () => {
    const formValMission = getWebKingdomLessonById("web-11");
    const formValResult = await validateHtmlCssChallenge(formValMission.challenge.solution, formValMission.challenge.tests);
    expect(formValResult.passed).toBe(true);
  });

  test("11. LocalStorage challenge uses isolated sandbox storage without corrupting parent application (Mission 13)", async () => {
    const vaultMission = getWebKingdomLessonById("web-13");
    const vaultResult = await validateHtmlCssChallenge(vaultMission.challenge.solution, vaultMission.challenge.tests);
    expect(vaultResult.passed).toBe(true);
  });

  test("12. Debugging challenge detects fixed bugs (Mission 14)", async () => {
    const debugMission = getWebKingdomLessonById("web-14");
    // Starter code should fail tests
    const starterResult = await validateHtmlCssChallenge(debugMission.challenge.starterCode, debugMission.challenge.tests);
    expect(starterResult.passed).toBe(false);

    // Solution should pass all tests
    const solutionResult = await validateHtmlCssChallenge(debugMission.challenge.solution, debugMission.challenge.tests);
    expect(solutionResult.passed).toBe(true);
  });

  test("13. Kingdom Builder mini-project is configured properly (Mission 15)", async () => {
    const builder = getWebKingdomLessonById("web-15");
    expect(builder.id).toBe("web-15");
    expect(builder.xp).toBe(260);
    const builderResult = await validateHtmlCssChallenge(builder.challenge.solution, builder.challenge.tests);
    expect(builderResult.passed).toBe(true);
  });

  test("14. Web Kingdom Guardian is mission 16 boss battle with 650 XP", async () => {
    const guardian = webKingdomLessons[15];
    expect(guardian.id).toBe("web-16");
    expect(guardian.type).toBe("boss");
    expect(guardian.difficulty).toBe("Boss");
    expect(guardian.xp).toBe(650);
    expect(guardian.title).toContain("Guardian");

    const bossResult = await validateHtmlCssChallenge(guardian.challenge.solution, guardian.challenge.tests);
    expect(bossResult.passed).toBe(true);
  });

  test("15. validateChallenge routes DOM and HTML/CSS challenges seamlessly", async () => {
    const mission = getWebKingdomLessonById("web-01");
    const res = await validateChallenge({
      challenge: mission.challenge,
      userCode: mission.challenge.solution,
      challengeType: mission.challengeType,
    });
    expect(res.passed).toBe(true);
  });

  test("16. getNextWebKingdomLessonId and getNextLessonId progress sequentially and terminate", () => {
    for (let i = 1; i <= 15; i++) {
      const currentId = `web-${String(i).padStart(2, "0")}`;
      const nextId = `web-${String(i + 1).padStart(2, "0")}`;
      expect(getNextWebKingdomLessonId(currentId)).toBe(nextId);
      expect(getNextLessonId(currentId)).toBe(nextId);
    }
    expect(getNextWebKingdomLessonId("web-16")).toBeNull();
    expect(getNextLessonId("web-16")).toBeNull();
  });

  test("17. Web Kingdom is locked before Logic Forest completion and unlocks after Logic Forest completion", () => {
    const initialProgress = { ...DEFAULT_PROGRESS };
    expect(isWorldUnlocked("web-kingdom", initialProgress)).toBe(false);

    const partialProgress = {
      ...DEFAULT_PROGRESS,
      completedLessons: [
        ...villageLessons.map((l) => l.id),
        ...logicForestLessons.slice(0, 14).map((l) => l.id),
      ],
    };
    expect(isWorldUnlocked("web-kingdom", partialProgress)).toBe(false);

    const completedForestProgress = {
      ...DEFAULT_PROGRESS,
      completedLessons: [
        ...villageLessons.map((l) => l.id),
        ...logicForestLessons.map((l) => l.id),
      ],
    };
    expect(isWorldComplete("logic-forest", completedForestProgress)).toBe(true);
    expect(isWorldUnlocked("web-kingdom", completedForestProgress)).toBe(true);

    const afterApply = applyWorldUnlocks(completedForestProgress);
    expect(afterApply.unlockedWorlds).toContain("web-kingdom");
    expect(afterApply.unlockedLessons).toContain("web-01");
  });

  test("18. getWebKingdomProgress and isWebKingdomComplete calculate accurately", () => {
    const empty = { completedLessons: [] };
    expect(getWebKingdomProgress(empty)).toBe(0);
    expect(isWebKingdomComplete(empty)).toBe(false);

    const partial = {
      completedLessons: webKingdomLessons.slice(0, 8).map((l) => l.id),
    };
    expect(getWebKingdomProgress(partial)).toBe(50);
    expect(isWebKingdomComplete(partial)).toBe(false);

    const full = {
      completedLessons: webKingdomLessons.map((l) => l.id),
    };
    expect(getWebKingdomProgress(full)).toBe(100);
    expect(isWebKingdomComplete(full)).toBe(true);
  });

  test("19. completing all 16 Web Kingdom missions marks Web Kingdom complete and unlocks World 4: The API Harbor", () => {
    const fullKingdomProgress = {
      ...DEFAULT_PROGRESS,
      completedLessons: [
        ...villageLessons.map((l) => l.id),
        ...logicForestLessons.map((l) => l.id),
        ...webKingdomLessons.map((l) => l.id),
      ],
    };

    expect(isWorldComplete("web-kingdom", fullKingdomProgress)).toBe(true);
    expect(isWorldUnlocked("api-harbor", fullKingdomProgress)).toBe(true);

    const afterApply = applyWorldUnlocks(fullKingdomProgress);
    expect(afterApply.unlockedWorlds).toContain("api-harbor");
  });

  test("20. all 16 Web Kingdom missions are registered in unified lessonsIndex and worldLessonMap", () => {
    const fromIndex = getLessonsForWorld("web-kingdom");
    expect(fromIndex.length).toBe(16);
    expect(worldLessonMap["web-kingdom"].length).toBe(16);
    expect(allLessons.filter((l) => l.world === "web-kingdom").length).toBe(16);
  });

  test("21. arena challenges are generated for all 16 Web Kingdom missions", () => {
    webKingdomLessons.forEach((mission) => {
      const arenaChallenge = getArenaChallengeById(mission.challenge.id);
      expect(arenaChallenge).toBeDefined();
      expect(arenaChallenge.lessonId).toBe(mission.id);
      expect(arenaChallenge.xp).toBe(mission.xp);
      expect(arenaChallenge.world).toBe("web-kingdom");
    });
  });

  test("22. Web Sovereign achievement unlocks exclusively when all 16 Web Kingdom missions are complete", () => {
    const achievement = achievements.find((a) => a.id === "web-sovereign");
    expect(achievement).toBeDefined();
    expect(achievement.required).toBe(16);

    // 0 completed
    expect(achievement.isComplete({ completedLessons: [] })).toBe(false);

    // 15 completed (1 short)
    const partial = { completedLessons: webKingdomLessons.slice(0, 15).map((l) => l.id) };
    expect(achievement.isComplete(partial)).toBe(false);

    // All 16 completed
    const full = {
      completedLessons: webKingdomLessons.map((l) => l.id),
      achievements: [],
    };
    expect(achievement.isComplete(full)).toBe(true);

    const result = reconcileAchievements(full);
    expect(result.newlyUnlocked.some((a) => a.id === "web-sovereign")).toBe(true);
    expect(result.progress.achievements).toContain("web-sovereign");
  });

  test("23. all 16 Web Kingdom challenge solutions pass their validation test suites", async () => {
    for (const mission of webKingdomLessons) {
      const { solution, tests } = mission.challenge;
      const res = await validateHtmlCssChallenge(solution, tests);
      expect(res.passed).toBe(true);
      expect(res.results.every((r) => r.passed)).toBe(true);
    }
  });
});
