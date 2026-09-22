import {
  developerRealmLessons,
  getDeveloperRealmLessonById,
  getNextDeveloperRealmLessonId,
  getDeveloperRealmProgress,
  isDeveloperRealmComplete,
} from "../data/developerRealmLessons";
import { worlds, getWorldById } from "../data/worlds";
import {
  isWorldComplete,
  isWorldUnlocked,
  getWorldProgress,
  isGameComplete,
  applyWorldUnlocks,
  completeLesson,
  DEFAULT_PROGRESS,
} from "../engine/progressEngine";
import { achievements, reconcileAchievements } from "../data/achievements";
import { createMockGitRepo } from "../engine/gitSimulator";
import { createMockDb, createMockApp } from "../engine/backendSimulator";
import { arenaChallenges, getArenaChallengesByWorld } from "../data/arenaChallenges";

describe("World 6 — The Developer Realm Quality Assurance (39 Comprehensive Checks)", () => {
  test("1. Exactly 16 Developer Realm missions exist", () => {
    expect(developerRealmLessons).toHaveLength(16);
  });

  test("2. Mission IDs are sequential from realm-01 to realm-16", () => {
    developerRealmLessons.forEach((lesson, index) => {
      const expectedNumber = String(index + 1).padStart(2, "0");
      expect(lesson.id).toBe(`realm-${expectedNumber}`);
    });
  });

  test("3. Lesson numbers are properly formatted two-digit strings", () => {
    developerRealmLessons.forEach((lesson, index) => {
      const expectedNumber = String(index + 1).padStart(2, "0");
      expect(lesson.number).toBe(expectedNumber);
    });
  });

  test("4. All missions use world 'developer-realm'", () => {
    developerRealmLessons.forEach((lesson) => {
      expect(lesson.world).toBe("developer-realm");
    });
  });

  test("5. All 16 missions have complete required metadata", () => {
    developerRealmLessons.forEach((lesson) => {
      expect(lesson.title).toBeTruthy();
      expect(lesson.subtitle).toBeTruthy();
      expect(lesson.description).toBeTruthy();
      expect(lesson.xp).toBeGreaterThan(0);
      expect(lesson.estimatedTime).toBeGreaterThan(0);
      expect(lesson.difficulty).toBeTruthy();
    });
  });

  test("6. All 16 missions have structured content blocks", () => {
    developerRealmLessons.forEach((lesson) => {
      expect(lesson.content).toBeInstanceOf(Array);
      expect(lesson.content.length).toBeGreaterThan(0);
      const types = lesson.content.map((b) => b.type);
      expect(types).toContain("heading");
      expect(types).toContain("paragraph");
    });
  });

  test("7. Starter code differs from solutions across all 16 missions", () => {
    developerRealmLessons.forEach((lesson) => {
      expect(lesson.challenge.starterCode.trim()).not.toBe(lesson.challenge.solution.trim());
    });
  });

  test("8. All 16 missions provide at least 3 progressive hints", () => {
    developerRealmLessons.forEach((lesson) => {
      expect(lesson.challenge.hints).toBeInstanceOf(Array);
      expect(lesson.challenge.hints.length).toBeGreaterThanOrEqual(3);
    });
  });

  test("9. All 16 missions define structured challenge requirements", () => {
    developerRealmLessons.forEach((lesson) => {
      expect(lesson.challenge.requirements).toBeInstanceOf(Array);
      expect(lesson.challenge.requirements.length).toBeGreaterThan(0);
    });
  });

  test("10. Git simulation: staging single files and staging all files (.)", () => {
    const repo = createMockGitRepo({ "a.js": "1", "b.js": "2" });
    expect(repo.status().stagedCount).toBe(0);

    repo.add("a.js");
    expect(repo.status().stagedFiles).toEqual(["a.js"]);

    repo.add(".");
    expect(repo.status().stagedFiles).toEqual(["a.js", "b.js"]);
  });

  test("11. Git simulation: atomic commits and commit hash generation", () => {
    const repo = createMockGitRepo({ "main.js": "console.log(1);" });
    repo.add("main.js");
    const res = repo.commit("feat: init main");
    expect(res.success).toBe(true);
    expect(res.commit.hash).toMatch(/^c[0-9a-f]+$/);
    expect(repo.getLog()).toHaveLength(1);
    expect(repo.status().isClean).toBe(true);
  });

  test("12. Git simulation: branch creation and checkout isolation", () => {
    const repo = createMockGitRepo({ "app.js": "export const a = 1;" });
    repo.add("app.js");
    repo.commit("initial");

    repo.checkout("feature/payments", true);
    expect(repo.getCurrentBranch()).toBe("feature/payments");
    expect(repo.getBranches()).toContain("feature/payments");
  });

  test("13. Git simulation: merge operation into target branch", () => {
    const repo = createMockGitRepo({ "base.js": "1" });
    repo.add("base.js");
    repo.commit("base commit");

    repo.checkout("feature/test", true);
    repo.writeFile("test.js", "test code");
    repo.add("test.js");
    repo.commit("add test.js");

    repo.checkout("main");
    const mergeRes = repo.merge("feature/test");
    expect(mergeRes.success).toBe(true);
    expect(repo.getWorkingTree()["test.js"]).toBe("test code");
  });

  test("14. Git simulation: repository status reporting", () => {
    const repo = createMockGitRepo({ "x.js": "1" });
    const initialStatus = repo.status();
    expect(initialStatus.currentBranch).toBe("main");
    expect(initialStatus.isClean).toBe(true);

    repo.add("x.js");
    expect(repo.status().isClean).toBe(false);
    expect(repo.status().stagedCount).toBe(1);
  });

  test("15. Mission 01: Requirements decomposition generates user story and task breakdown", () => {
    const lesson = getDeveloperRealmLessonById("realm-01");
    const fn = new Function(`${lesson.challenge.solution}; return decomposeFeatureRequest;`)();
    const plan = fn({
      title: "Favorite Heroes",
      description: "save my favorite heroes to quick access",
      userRole: "adventurer",
      priority: "high",
    });

    expect(plan.featureTitle).toBe("Favorite Heroes");
    expect(plan.userStory).toContain("As a adventurer");
    expect(plan.tasks.frontend).toBeInstanceOf(Array);
    expect(plan.tasks.backend).toBeInstanceOf(Array);
    expect(plan.tasks.database).toBeInstanceOf(Array);
    expect(plan.tasks.testing).toBeInstanceOf(Array);
    expect(plan.isHighPriority).toBe(true);
  });

  test("16. Mission 02: Staging & atomic commit workflow", () => {
    const lesson = getDeveloperRealmLessonById("realm-02");
    const fn = new Function(
      "createMockGitRepo",
      `${lesson.challenge.solution}; return stageAndCommitFiles;`
    )(createMockGitRepo);

    const repo = createMockGitRepo({
      "src/auth.js": "export function auth() {}",
      "src/server.js": "export function start() {}",
    });
    const result = fn(repo, ["src/auth.js"], "feat(auth): add auth layer");
    expect(result.success).toBe(true);
    expect(result.stagedCount).toBe(1);
    expect(result.message).toBe("feat(auth): add auth layer");
  });

  test("17. Mission 03: Feature branching and isolated commit creation", () => {
    const lesson = getDeveloperRealmLessonById("realm-03");
    const fn = new Function(
      "createMockGitRepo",
      `${lesson.challenge.solution}; return createFeatureWorkflow;`
    )(createMockGitRepo);

    const repo = createMockGitRepo({ "README.md": "# Realm" });
    const result = fn(repo, "feature/quests", { path: "src/quests.js", content: "export const q = [];" }, "feat: quests");
    expect(result.branch).toBe("feature/quests");
    expect(result.activeBranches).toContain("feature/quests");
  });

  test("18. Mission 04: Merge conflict resolution without marker artifacts", () => {
    const lesson = getDeveloperRealmLessonById("realm-04");
    const fn = new Function(`${lesson.challenge.solution}; return resolveMergeConflictCode;`)();
    const conflictText = `<<<<<<< HEAD\nconst SERVER_PORT = 3000;\nconst DEBUG_MODE = false;\n=======\nconst SERVER_PORT = 8080;\nconst ENABLE_TELEMETRY = true;\n>>>>>>> feature/ports`;
    const resolved = fn(conflictText);
    expect(resolved).not.toContain("<<<<<<<");
    expect(resolved).not.toContain("=======");
    expect(resolved).not.toContain(">>>>>>>");
    expect(resolved).toContain("const SERVER_PORT = 8080;");
  });

  test("19. Mission 05: Systematic cart debugging (type coercion, discount caps, tax rounding)", () => {
    const lesson = getDeveloperRealmLessonById("realm-05");
    const fn = new Function(`${lesson.challenge.solution}; return calculateShopCart;`)();
    const result = fn(
      [
        { name: "Health Potion", price: "25", quantity: 2 },
        { name: "Iron Shield", price: 150, quantity: 1 },
      ],
      "CITADEL20",
      0.1
    );
    expect(result.subtotal).toBe(200);
    expect(result.discount).toBe(40);
    expect(result.tax).toBe(16);
    expect(result.total).toBe(176);
    expect(result.itemCount).toBe(3);
  });

  test("20. Mission 06: Stack trace parsing, error type extraction, and incident severity", () => {
    const lesson = getDeveloperRealmLessonById("realm-06");
    const fn = new Function(`${lesson.challenge.solution}; return parseAndTriageError;`)();
    const log = `TypeError: Cannot read properties of undefined (reading 'stats')\n    at calculateCombatPower (src/engine/combatEngine.js:54:21)`;
    const parsed = fn(log);
    expect(parsed.errorType).toBe("TypeError");
    expect(parsed.sourceFile).toBe("src/engine/combatEngine.js");
    expect(parsed.lineNumber).toBe(54);
    expect(parsed.severity).toBe("CRITICAL");
  });

  test("21. Mission 07: Pull request inspection for hardcoded secrets, tests, and input validation", () => {
    const lesson = getDeveloperRealmLessonById("realm-07");
    const fn = new Function(`${lesson.challenge.solution}; return inspectPullRequest;`)();
    const result = fn({
      author: "adventurer42",
      title: "feat: add payment gateway",
      codeDiff: 'const secret_key = "live_secret_998811";\napp.post("/pay", (req, res) => { const amount = req.body.amount; });',
      hasTests: false,
      containsSecret: true,
    });
    expect(result.approved).toBe(false);
    expect(result.issues).toHaveLength(3);
  });

  test("22. Mission 08: Refactoring forge roster normalizer (pure functions, title casing, power scoring)", () => {
    const lesson = getDeveloperRealmLessonById("realm-08");
    const fn = new Function(`${lesson.challenge.solution}; return normalizeAdventurerRoster;`)();
    const result = fn([
      { name: "  aria ", role: "Mage", level: 5, status: "active" },
      { name: "thorin", role: "Warrior", level: 0, status: "active" },
      { name: "malakor", role: "Rogue", level: 9, status: "banned" },
    ]);
    expect(result.activeCount).toBe(2);
    expect(result.roster[0].name).toBe("Aria");
    expect(result.roster[0].powerScore).toBe(75);
    expect(result.totalPower).toBe(100);
  });

  test("23. Mission 09: Testing chamber quest reward evaluation (qualification, fainted status, multipliers)", () => {
    const lesson = getDeveloperRealmLessonById("realm-09");
    const fn = new Function(`${lesson.challenge.solution}; return calculateQuestReward;`)();
    const pass = fn(
      { title: "Dragon Slaying", baseXp: 500, minLevel: 10, difficulty: "legendary" },
      { name: "Lyra", level: 12, isFainted: false }
    );
    expect(pass.eligible).toBe(true);
    expect(pass.xp).toBe(1500);

    const fainted = fn(
      { title: "Cave Patrol", baseXp: 100, minLevel: 1, difficulty: "normal" },
      { name: "Lyra", level: 12, isFainted: true }
    );
    expect(fainted.eligible).toBe(false);
    expect(fainted.reason).toBe("Hero is fainted");
  });

  test("24. Mission 10: Security watchtower input sanitization (XSS and SQL injection neutralization)", () => {
    const lesson = getDeveloperRealmLessonById("realm-10");
    const fn = new Function(`${lesson.challenge.solution}; return secureInputProcessor;`)();
    const result = fn(
      { username: "galahad", role: "player" },
      { title: "Hero Bio", content: "Hello <script>alert(1)</script>World; DROP TABLE users;" }
    );
    expect(result.secure).toBe(true);
    expect(result.sanitized.content).toBe("Hello World;");
    expect(result.processedBy).toBe("galahad");
  });

  test("25. Mission 11: Environment configuration parser (production security rules, missing keys)", () => {
    const lesson = getDeveloperRealmLessonById("realm-11");
    const fn = new Function(`${lesson.challenge.solution}; return parseEnvironmentConfig;`)();
    const valid = fn(
      `PORT=8080\nDB_HOST=citadel-db\nAPI_SECRET=super_secure_vault_token_99`,
      ["PORT", "DB_HOST", "API_SECRET"],
      "production"
    );
    expect(valid.valid).toBe(true);
    expect(valid.config.PORT).toBe("8080");

    const insecure = fn(`PORT=3000\nAPI_SECRET=changeme`, ["PORT", "API_SECRET"], "production");
    expect(insecure.valid).toBe(false);
  });

  test("26. Mission 12: Decoupled N-Tier architecture (Controller, Service, DB Model)", () => {
    const lesson = getDeveloperRealmLessonById("realm-12");
    const fn = new Function("createMockDb", `${lesson.challenge.solution}; return createAdventurerService;`)(
      createMockDb
    );
    const service = fn();
    const created = service.createAdventurer({ name: "Elena", role: "Mage" });
    expect(created.success).toBe(true);
    expect(created.hero.role).toBe("Mage");
  });

  test("27. Mission 13: Project planner agile milestone generator (story points, sprint pacing)", () => {
    const lesson = getDeveloperRealmLessonById("realm-13");
    const fn = new Function(`${lesson.challenge.solution}; return planSprintMilestones;`)();
    const plan = fn({
      name: "Guild System",
      features: ["F1", "F2", "F3", "F4"],
    });
    expect(plan.totalPoints).toBe(12);
    expect(plan.estimatedSprints).toBe(2);
    expect(plan.milestones).toHaveLength(2);
  });

  test("28. Mission 14: Developer workshop full-stack REST routes (POST /bounties, GET /bounties/:id)", async () => {
    const lesson = getDeveloperRealmLessonById("realm-14");
    const db = createMockDb({ bounties: [] });
    const app = createMockApp(db);
    const fn = new Function(
      "createMockDb",
      "createMockApp",
      `${lesson.challenge.solution}; return setupGuildBountyFeature;`
    )(createMockDb, createMockApp);
    fn(app, db);

    const postRes = await app.handleRequest({
      method: "POST",
      url: "/bounties",
      body: { title: "Defeat Troll", reward: 300 },
    });
    expect(postRes.status).toBe(201);
    expect(postRes.body.bounty.title).toBe("Defeat Troll");

    const getRes = await app.handleRequest({
      method: "GET",
      url: `/bounties/${postRes.body.bounty.id}`,
    });
    expect(getRes.status).toBe(200);
    expect(getRes.body.bounty.reward).toBe(300);
  });

  test("29. Mission 15: CodeQuest Adventurer Hub capstone manager (search, metrics, CRUD, decommission)", () => {
    const lesson = getDeveloperRealmLessonById("realm-15");
    const fn = new Function("createMockDb", `${lesson.challenge.solution}; return createAdventurerHub;`)(
      createMockDb
    );
    const hub = fn();
    const metrics = hub.getHubMetrics();
    expect(metrics.totalHeroes).toBeGreaterThan(0);
    expect(metrics.averageLevel).toBeGreaterThan(0);

    const registered = hub.registerAdventurer({ name: "Kaelen", role: "Cleric" });
    expect(registered.success).toBe(true);

    const decommission = hub.decommissionHero(registered.hero.id);
    expect(decommission.success).toBe(true);
  });

  test("30. Mission 16: The Developer Guardian final boss (diagnostic probe, auth boundary, CRUD, error handler)", async () => {
    const boss = getDeveloperRealmLessonById("realm-16");
    expect(boss.type).toBe("boss");
    expect(boss.xp).toBe(1000);

    const db = createMockDb({ heroes: [] });
    const app = createMockApp(db);
    const fn = new Function(
      "createMockDb",
      "createMockApp",
      `${boss.challenge.solution}; return repairMasterProductionServer;`
    )(createMockDb, createMockApp);
    fn(app, db);

    const health = await app.handleRequest({ method: "GET", url: "/health" });
    expect(health.status).toBe(200);
    expect(health.body.status).toBe("healthy");

    const unauth = await app.handleRequest({ method: "GET", url: "/api/heroes" });
    expect(unauth.status).toBe(401);

    const authGet = await app.handleRequest({
      method: "GET",
      url: "/api/heroes",
      headers: { authorization: "Bearer grandmaster-token-99" },
    });
    expect(authGet.status).toBe(200);
  });

  test("31. World Progression: Developer Realm locked before Backend Citadel completion", () => {
    const progress = { completedLessons: ["village-01", "citadel-01"] };
    expect(isWorldUnlocked("developer-realm", progress)).toBe(false);
  });

  test("32. World Progression: Developer Realm unlocks after Backend Citadel completion", () => {
    const citadelCompleted = Array.from({ length: 16 }, (_, i) => `citadel-${String(i + 1).padStart(2, "0")}`);
    const progress = { completedLessons: citadelCompleted };
    expect(isWorldUnlocked("developer-realm", progress)).toBe(true);
  });

  test("33. World Progression: Progress percentage calculation (0% to 100%)", () => {
    expect(getDeveloperRealmProgress({ completedLessons: [] })).toBe(0);
    expect(getDeveloperRealmProgress({ completedLessons: ["realm-01", "realm-02", "realm-03", "realm-04"] })).toBe(25);
    const all = developerRealmLessons.map((l) => l.id);
    expect(getDeveloperRealmProgress({ completedLessons: all })).toBe(100);
  });

  test("34. World Progression: isDeveloperRealmComplete helper", () => {
    expect(isDeveloperRealmComplete({ completedLessons: [] })).toBe(false);
    const all = developerRealmLessons.map((l) => l.id);
    expect(isDeveloperRealmComplete({ completedLessons: all })).toBe(true);
  });

  test("35. Game Completion: isGameComplete verifies all 6 worlds (97 missions total)", () => {
    const all97Lessons = [
      ...Array.from({ length: 18 }, (_, i) => `lesson-${String(i + 1).padStart(2, "0")}`),
      ...Array.from({ length: 15 }, (_, i) => `forest-${String(i + 1).padStart(2, "0")}`),
      ...Array.from({ length: 16 }, (_, i) => `web-${String(i + 1).padStart(2, "0")}`),
      ...Array.from({ length: 16 }, (_, i) => `harbor-${String(i + 1).padStart(2, "0")}`),
      ...Array.from({ length: 16 }, (_, i) => `citadel-${String(i + 1).padStart(2, "0")}`),
      ...Array.from({ length: 16 }, (_, i) => `realm-${String(i + 1).padStart(2, "0")}`),
    ];
    expect(all97Lessons).toHaveLength(97);
    expect(isGameComplete({ completedLessons: all97Lessons })).toBe(true);
    expect(isGameComplete({ completedLessons: all97Lessons.slice(0, 96) })).toBe(false);
  });

  test("36. Achievement System: codequest-grandmaster unlocks on completing all 16 realm missions", () => {
    const realmIds = developerRealmLessons.map((l) => l.id);
    const { progress: reconciled, newlyUnlocked } = reconcileAchievements({
      xp: 20000,
      completedLessons: realmIds,
      achievements: [],
    });
    expect(reconciled.achievements).toContain("codequest-grandmaster");
    expect(newlyUnlocked.some((a) => a.id === "codequest-grandmaster")).toBe(true);
  });

  test("37. Code Arena: Developer Realm challenges registered in arenaChallenges and getArenaChallengesByWorld", () => {
    const grouped = getArenaChallengesByWorld();
    expect(grouped).toBeDefined();
    const realmArenaChallenges = arenaChallenges.filter((c) => c.world === "developer-realm");
    expect(realmArenaChallenges).toHaveLength(16);
  });

  test("38. Lesson Navigation: getDeveloperRealmLessonById and getNextDeveloperRealmLessonId", () => {
    expect(getDeveloperRealmLessonById("realm-01")?.title).toBe("The Developer's Path");
    expect(getNextDeveloperRealmLessonId("realm-01")).toBe("realm-02");
    expect(getNextDeveloperRealmLessonId("realm-16")).toBeNull();
  });

  test("39. Full Curriculum Solution Verification: all 16 mission solutions execute and pass all test assertions", () => {
    developerRealmLessons.forEach((lesson) => {
      const solutionCode = lesson.challenge.solution;
      expect(solutionCode).toBeTruthy();

      const fn = new Function(
        "createMockDb",
        "createMockApp",
        "createMockGitRepo",
        `${solutionCode}; return ${lesson.challenge.tests[0].functionName};`
      )(createMockDb, createMockApp, createMockGitRepo);

      expect(typeof fn).toBe("function");

      lesson.challenge.tests.forEach((t) => {
        const result = fn(...t.args);
        if (typeof t.expected === "object" && t.expected !== null) {
          for (const [key, expectedVal] of Object.entries(t.expected)) {
            expect(result[key]).toEqual(expectedVal);
          }
        } else if (t.expected !== undefined) {
          expect(result).toEqual(t.expected);
        }
      });
    });
  });
});
