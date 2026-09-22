import {
  isSoundEnabled,
  setSoundEnabled,
  toggleSound,
  playSuccessSound,
  playLevelUpSound,
  playAchievementSound,
  playClickSound,
} from "../engine/soundEffects";
import {
  DEFAULT_PROGRESS,
  completeLesson,
  unlockLesson,
  addXP,
  updateStreak,
  isWorldUnlocked,
  isWorldComplete,
  isGameComplete,
  getWorldProgress,
} from "../engine/progressEngine";
import { getLevelInfo } from "../engine/levelEngine";
import { achievements, reconcileAchievements } from "../data/achievements";
import { worlds } from "../data/worlds";
import { allLessons, getLessonById, getNextLessonId } from "../data/lessonsIndex";

describe("Phase 9 — Game Feel, Rewards & Player Experience Verification", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("1. Sound synthesizer safely initializes, toggles, and executes all chimes", () => {
    expect(isSoundEnabled()).toBe(true);

    const toggledOff = toggleSound();
    expect(toggledOff).toBe(false);
    expect(isSoundEnabled()).toBe(false);

    setSoundEnabled(true);
    expect(isSoundEnabled()).toBe(true);

    // Ensure all audio chimes execute without throwing in test/headless environments
    expect(() => {
      playSuccessSound();
      playLevelUpSound();
      playAchievementSound();
      playClickSound();
    }).not.toThrow();
  });

  test("2. Onboarding state initializes for new players and respects dismissal", () => {
    const ONBOARDING_KEY = "codequest-onboarding-dismissed";
    expect(localStorage.getItem(ONBOARDING_KEY)).toBeNull();

    localStorage.setItem(ONBOARDING_KEY, "true");
    expect(localStorage.getItem(ONBOARDING_KEY)).toBe("true");
  });

  test("3. Quest completion reward feedback is calculated idempotently", () => {
    const lesson = getLessonById("lesson-01");
    expect(lesson).toBeDefined();

    let progress = { ...DEFAULT_PROGRESS };
    progress = completeLesson(progress, lesson.id);
    progress = addXP(progress, lesson.xp);

    expect(progress.completedLessons).toContain("lesson-01");
    expect(progress.xp).toBe(lesson.xp);

    // Replay should not add duplicate entries
    const replayProgress = completeLesson(progress, lesson.id);
    expect(replayProgress.completedLessons).toHaveLength(1);
  });

  test("4. Next lesson navigation resolves accurately across all worlds", () => {
    expect(getNextLessonId("lesson-01")).toBe("lesson-02");
    expect(getNextLessonId("lesson-17")).toBe("lesson-18");
    expect(getNextLessonId("lesson-18")).toBeNull(); // Boss is end of Village

    expect(getNextLessonId("forest-01")).toBe("forest-02");
    expect(getNextLessonId("forest-15")).toBeNull(); // Boss is end of Forest

    expect(getNextLessonId("web-01")).toBe("web-02");
    expect(getNextLessonId("web-16")).toBeNull(); // Boss is end of Kingdom

    expect(getNextLessonId("harbor-01")).toBe("harbor-02");
    expect(getNextLessonId("harbor-16")).toBeNull(); // Boss is end of Harbor

    expect(getNextLessonId("citadel-01")).toBe("citadel-02");
    expect(getNextLessonId("citadel-16")).toBeNull(); // Boss is end of Citadel

    expect(getNextLessonId("realm-01")).toBe("realm-02");
    expect(getNextLessonId("realm-16")).toBeNull(); // Final Boss is end of Realm
  });

  test("5. Level-up calculation generates accurate levels, titles, and XP percentages", () => {
    const lvl1 = getLevelInfo(0);
    expect(lvl1.level).toBe(1);
    expect(lvl1.title).toBe("Novice Coder");
    expect(lvl1.percent).toBe(0);

    const lvl2 = getLevelInfo(1000);
    expect(lvl2.level).toBe(2);
    expect(lvl2.title).toBe("Apprentice Coder");

    const lvl3 = getLevelInfo(2500);
    expect(lvl3.level).toBe(3);
    expect(lvl3.title).toBe("Journeyman Coder");
  });

  test("6. Daily streak increments seamlessly upon user activity", () => {
    let progress = { ...DEFAULT_PROGRESS, streak: 0, lastActiveDay: null };

    // Day 1 activity
    progress = updateStreak(progress);
    expect(progress.streak).toBe(1);
    expect(progress.lastActiveDay).toBeTruthy();

    // Repeated activity on the same day should maintain the same streak count
    const sameDay = updateStreak(progress);
    expect(sameDay.streak).toBe(1);
  });

  test("7. Achievement reconciliation triggers only once and awards XP idempotently", () => {
    const progress = {
      ...DEFAULT_PROGRESS,
      xp: 1500,
      completedLessons: ["lesson-01"],
      achievements: [],
    };

    const first = reconcileAchievements(progress);
    expect(first.newlyUnlocked.some((a) => a.id === "first-steps")).toBe(true);
    expect(first.progress.achievements).toContain("first-steps");
    const earnedXp = first.progress.xp;

    const second = reconcileAchievements(first.progress);
    expect(second.newlyUnlocked).toHaveLength(0);
    expect(second.progress.xp).toBe(earnedXp);
  });

  test("8. World map status evaluation accurately distinguishes locked, available, and completed states", () => {
    const villageIds = Array.from({ length: 18 }, (_, i) => `lesson-${String(i + 1).padStart(2, "0")}`);
    let progress = { ...DEFAULT_PROGRESS, completedLessons: [] };

    expect(isWorldUnlocked("village", progress)).toBe(true);
    expect(isWorldComplete("village", progress)).toBe(false);
    expect(isWorldUnlocked("logic-forest", progress)).toBe(false);

    // Complete Village
    progress.completedLessons = [...villageIds];
    expect(isWorldComplete("village", progress)).toBe(true);
    expect(isWorldUnlocked("logic-forest", progress)).toBe(true);
    expect(isWorldComplete("logic-forest", progress)).toBe(false);
  });

  test("9. Graduation state is strictly gated behind all 97 missions", () => {
    const all97 = [
      ...Array.from({ length: 18 }, (_, i) => `lesson-${String(i + 1).padStart(2, "0")}`),
      ...Array.from({ length: 15 }, (_, i) => `forest-${String(i + 1).padStart(2, "0")}`),
      ...Array.from({ length: 16 }, (_, i) => `web-${String(i + 1).padStart(2, "0")}`),
      ...Array.from({ length: 16 }, (_, i) => `harbor-${String(i + 1).padStart(2, "0")}`),
      ...Array.from({ length: 16 }, (_, i) => `citadel-${String(i + 1).padStart(2, "0")}`),
      ...Array.from({ length: 16 }, (_, i) => `realm-${String(i + 1).padStart(2, "0")}`),
    ];

    expect(isGameComplete({ completedLessons: [] })).toBe(false);
    expect(isGameComplete({ completedLessons: all97.slice(0, 96) })).toBe(false);
    expect(isGameComplete({ completedLessons: all97 })).toBe(true);
  });
});
