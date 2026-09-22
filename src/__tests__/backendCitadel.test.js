import {
  backendCitadelLessons,
  getBackendCitadelLessonById,
  getNextBackendCitadelLessonId,
  getBackendCitadelProgress,
  isBackendCitadelComplete,
} from "../data/backendCitadelLessons";
import { createMockDb, createMockApp } from "../engine/backendSimulator";
import { worlds, getWorldById } from "../data/worlds";
import {
  isWorldUnlocked,
  isWorldComplete,
  applyWorldUnlocks,
  DEFAULT_PROGRESS,
} from "../engine/progressEngine";
import { getLessonById, getNextLessonId, allLessons, worldLessonMap } from "../data/lessonsIndex";
import { getAchievementById } from "../data/achievements";
import { arenaChallenges, getArenaChallengesByWorld } from "../data/arenaChallenges";
import { executeInWorker } from "../engine/workerCodeRunner";

describe("World 5: The Backend Citadel — Curriculum & Structure", () => {
  test("contains exactly 16 missions", () => {
    expect(backendCitadelLessons).toHaveLength(16);
  });

  test("all missions have sequential IDs from citadel-01 to citadel-16", () => {
    backendCitadelLessons.forEach((lesson, index) => {
      const numStr = String(index + 1).padStart(2, "0");
      expect(lesson.id).toBe(`citadel-${numStr}`);
      expect(lesson.number).toBe(numStr);
      expect(lesson.world).toBe("backend-citadel");
      expect(lesson.worldId).toBe("backend-citadel");
      expect(lesson.xp).toBeGreaterThan(0);
      expect(lesson.title).toBeTruthy();
      expect(lesson.description).toBeTruthy();
      expect(lesson.concepts).toBeInstanceOf(Array);
      expect(lesson.concepts.length).toBeGreaterThan(0);
      expect(lesson.content).toBeInstanceOf(Array);
      expect(lesson.challenge).toBeDefined();
      expect(lesson.challenge.starterCode).toBeTruthy();
      expect(lesson.challenge.solution).toBeTruthy();
      expect(lesson.challenge.hints).toBeInstanceOf(Array);
      expect(lesson.challenge.hints.length).toBeGreaterThanOrEqual(2);
      expect(lesson.challenge.tests).toBeInstanceOf(Array);
      expect(lesson.challenge.tests.length).toBeGreaterThan(0);
    });
  });

  test("citadel-16 is designated as the Final Boss battle", () => {
    const boss = getBackendCitadelLessonById("citadel-16");
    expect(boss).toBeDefined();
    expect(boss.type).toBe("boss");
    expect(boss.difficulty).toBe("Boss");
    expect(boss.xp).toBeGreaterThanOrEqual(800);
    expect(boss.title).toContain("Guardian");
  });

  test("helper functions return correct sequential navigation and progress", () => {
    expect(getBackendCitadelLessonById("citadel-01")).toBeDefined();
    expect(getNextBackendCitadelLessonId("citadel-01")).toBe("citadel-02");
    expect(getNextBackendCitadelLessonId("citadel-16")).toBeNull();

    const progress0 = getBackendCitadelProgress({ completedLessons: [] });
    expect(progress0).toBe(0);

    const progress8 = getBackendCitadelProgress({
      completedLessons: backendCitadelLessons.slice(0, 8).map((l) => l.id),
    });
    expect(progress8).toBe(50);

    const completeProgress = {
      completedLessons: backendCitadelLessons.map((l) => l.id),
    };
    expect(getBackendCitadelProgress(completeProgress)).toBe(100);
    expect(isBackendCitadelComplete(completeProgress)).toBe(true);
  });
});

describe("Backend Simulator Engine (createMockDb & createMockApp)", () => {
  test("createMockDb provides CRUD operations", () => {
    const db = createMockDb({
      heroes: [
        { id: "h1", name: "Aria", role: "Ranger" },
        { id: "h2", name: "Rowan", role: "Knight" },
      ],
    });

    // Find all
    expect(db.find("heroes")).toHaveLength(2);

    // Find by ID
    expect(db.findById("heroes", "h1")).toEqual({ id: "h1", name: "Aria", role: "Ranger" });
    expect(db.findById("heroes", "missing")).toBeNull();

    // Insert
    const created = db.insert("heroes", { name: "Lyra", role: "Mage" });
    expect(created.name).toBe("Lyra");
    expect(db.find("heroes")).toHaveLength(3);

    // Update
    const updated = db.update("heroes", "h1", { role: "Grand Ranger" });
    expect(updated.role).toBe("Grand Ranger");
    expect(db.findById("heroes", "h1").role).toBe("Grand Ranger");

    // Delete
    const deleted = db.delete("heroes", "h2");
    expect(deleted).toBe(true);
    expect(db.findById("heroes", "h2")).toBeNull();
  });

  test("createMockDb executes simulated SQL SELECT queries with WHERE, ORDER BY, LIMIT", () => {
    const db = createMockDb({
      champions: [
        { id: "c1", name: "Aria", power: 850 },
        { id: "c2", name: "Rowan", power: 920 },
        { id: "c3", name: "Kaelen", power: 780 },
      ],
    });

    const results = db.query("SELECT * FROM champions WHERE power > 800 ORDER BY power DESC LIMIT 1");
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("Rowan");
  });

  test("createMockApp handles Express routes, parameters, query, and status codes", async () => {
    const db = createMockDb({
      heroes: [{ id: "h1", name: "Aria" }],
    });
    const app = createMockApp(db);

    app.get("/heroes", (req, res) => {
      res.status(200).json({ success: true, count: db.find("heroes").length });
    });

    app.get("/heroes/:id", (req, res) => {
      const hero = db.findById("heroes", req.params.id);
      if (!hero) return res.status(404).json({ success: false, error: "Not found" });
      res.status(200).json({ success: true, hero });
    });

    app.post("/heroes", (req, res) => {
      const created = db.insert("heroes", req.body);
      res.status(201).json({ success: true, hero: created });
    });

    const getRes = await app.handleRequest({ method: "GET", url: "/heroes" });
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body).toEqual({ success: true, count: 1 });

    const paramRes = await app.handleRequest({ method: "GET", url: "/heroes/h1" });
    expect(paramRes.statusCode).toBe(200);
    expect(paramRes.body.hero.name).toBe("Aria");

    const postRes = await app.handleRequest({
      method: "POST",
      url: "/heroes",
      body: { name: "Rowan" },
    });
    expect(postRes.statusCode).toBe(201);
    expect(postRes.body.hero.name).toBe("Rowan");
  });

  test("createMockApp supports middleware pipelines and centralized error handlers", async () => {
    const app = createMockApp();

    // Telemetry middleware
    app.use((req, res, next) => {
      req.customHeader = "citadel-token";
      next();
    });

    // Error throwing route
    app.get("/fault", (req, res, next) => {
      next(new Error("Citadel mainframe failure"));
    });

    // Centralized 4-argument error handler
    app.use((err, req, res, next) => {
      res.status(500).json({ success: false, caught: true, message: err.message });
    });

    const errorRes = await app.handleRequest({ method: "GET", url: "/fault" });
    expect(errorRes.statusCode).toBe(500);
    expect(errorRes.body).toEqual({
      success: false,
      caught: true,
      message: "Citadel mainframe failure",
    });
  });
});

describe("World 5 Solutions Verification (All 16 Challenges Pass)", () => {
  backendCitadelLessons.forEach((lesson) => {
    test(`Mission ${lesson.number} (${lesson.title}) solution passes validation`, async () => {
      const { solution, tests } = lesson.challenge;
      expect(solution).toBeTruthy();

      for (const t of tests) {
        let assertionSnippet = "";
        if (t.type === "function") {
          const serializedArgs = JSON.stringify(t.args || []);
          assertionSnippet = `
            const args = ${serializedArgs};
            const res = ${t.functionName}.apply(null, args);
            return res;
          `;
        }

        const runResult = await executeInWorker(solution, {
          assertionBody: assertionSnippet,
        });

        expect(runResult.success).toBe(true);
        expect(runResult.error).toBeNull();
      }
    });
  });
});

describe("World 5 Progression, Unlocking & Achievements Integration", () => {
  const allHarborLessonIds = [
    "harbor-01", "harbor-02", "harbor-03", "harbor-04",
    "harbor-05", "harbor-06", "harbor-07", "harbor-08",
    "harbor-09", "harbor-10", "harbor-11", "harbor-12",
    "harbor-13", "harbor-14", "harbor-15", "harbor-16",
  ];

  test("World 5 (backend-citadel) is locked when API Harbor is incomplete", () => {
    const incompleteProgress = {
      ...DEFAULT_PROGRESS,
      completedLessons: allHarborLessonIds.slice(0, 15),
    };
    expect(isWorldUnlocked("backend-citadel", incompleteProgress)).toBe(false);
  });

  test("World 5 (backend-citadel) unlocks when all 16 API Harbor lessons are complete", () => {
    const completedHarborProgress = {
      ...DEFAULT_PROGRESS,
      completedLessons: allHarborLessonIds,
    };
    expect(isWorldUnlocked("backend-citadel", completedHarborProgress)).toBe(true);

    const unlockedState = applyWorldUnlocks(completedHarborProgress);
    expect(unlockedState.unlockedWorlds).toContain("backend-citadel");
    expect(unlockedState.unlockedLessons).toContain("citadel-01");
  });

  test("Completing all 16 Citadel missions unlocks World 6 (developer-realm)", () => {
    const allCitadelLessonIds = backendCitadelLessons.map((l) => l.id);
    const completeCitadelProgress = {
      ...DEFAULT_PROGRESS,
      completedLessons: [...allHarborLessonIds, ...allCitadelLessonIds],
    };

    expect(isWorldComplete("backend-citadel", completeCitadelProgress)).toBe(true);
    expect(isWorldUnlocked("developer-realm", completeCitadelProgress)).toBe(true);

    const unlockedState = applyWorldUnlocks(completeCitadelProgress);
    expect(unlockedState.unlockedWorlds).toContain("developer-realm");
  });

  test("Citadel Warden achievement is defined and complete when 16/16 citadel missions are finished", () => {
    const ach = getAchievementById("citadel-warden");
    expect(ach).toBeDefined();
    expect(ach.title).toBe("Citadel Warden");
    expect(ach.required).toBe(16);

    const partialProgress = {
      completedLessons: backendCitadelLessons.slice(0, 10).map((l) => l.id),
    };
    expect(ach.isComplete(partialProgress)).toBe(false);

    const fullProgress = {
      completedLessons: backendCitadelLessons.map((l) => l.id),
    };
    expect(ach.isComplete(fullProgress)).toBe(true);
  });

  test("Unified lesson registry and Code Arena include all 16 Citadel missions", () => {
    expect(worldLessonMap["backend-citadel"]).toHaveLength(16);
    expect(worldLessonMap["citadel"]).toHaveLength(16);

    const arenaCitadel = getArenaChallengesByWorld()["backend-citadel"];
    expect(arenaCitadel).toHaveLength(16);

    const lesson01 = getLessonById("citadel-01");
    expect(lesson01).toBeDefined();
    expect(getNextLessonId("citadel-01")).toBe("citadel-02");
    expect(getNextLessonId("citadel-16")).toBeNull();
  });
});
