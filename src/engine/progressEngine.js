/**
 * Player progress persistence engine.
 * Centralizes all localStorage reads/writes so UI components
 * never touch localStorage directly.
 *
 * Progression is world-aware:
 *   world → lessons → challenges → skills → XP
 *
 * World unlock rules:
 *   - The Village is always unlocked (lesson-01 starts unlocked).
 *   - The Workshop unlocks when ALL Village lessons are complete.
 *   - Projects unlock when The Workshop is complete (prepared, not built).
 */

import { villageLessons } from "../data/lessons";
import { workshopLessons } from "../data/workshopLessons";
import { cityLessons } from "../data/cityLessons";
import { worlds, getWorldById } from "../data/worlds";
import { getLessonsForWorld } from "../data/lessonsIndex";

export const STORAGE_KEY = "codequest-progress-v1";

export const DEFAULT_PROGRESS = {
  xp: 0,
  completedLessons: [],
  completedChallenges: [],
  completedProjects: [],
  unlockedWorlds: ["village"],
  projectProgress: {},
  projectSteps: {},
  completedProjectMeta: {},
  achievements: [],
  achievementMeta: {},
  unlockedLessons: ["lesson-01"],
  skillProgress: {
    programming: 0,
  },
  streak: 0,
  lastActiveDay: null,
};

function normalizeProgress(progress) {
  return {
    ...DEFAULT_PROGRESS,
    ...progress,
    xp: Number.isFinite(progress.xp) ? progress.xp : DEFAULT_PROGRESS.xp,
    completedLessons: Array.isArray(progress.completedLessons) ? progress.completedLessons : [],
    completedChallenges: Array.isArray(progress.completedChallenges) ? progress.completedChallenges : [],
    completedProjects: Array.isArray(progress.completedProjects) ? progress.completedProjects : [],
    unlockedWorlds:
      Array.isArray(progress.unlockedWorlds) && progress.unlockedWorlds.length > 0
        ? progress.unlockedWorlds.includes("village")
          ? progress.unlockedWorlds
          : ["village", ...progress.unlockedWorlds]
        : ["village"],
    unlockedLessons:
      Array.isArray(progress.unlockedLessons) && progress.unlockedLessons.length > 0
        ? progress.unlockedLessons.includes("lesson-01")
          ? progress.unlockedLessons
          : ["lesson-01", ...progress.unlockedLessons]
        : ["lesson-01"],
    achievements: Array.isArray(progress.achievements) ? progress.achievements : [],
    projectProgress: progress.projectProgress && typeof progress.projectProgress === "object" ? progress.projectProgress : {},
    projectSteps: progress.projectSteps && typeof progress.projectSteps === "object" ? progress.projectSteps : {},
    achievementMeta: progress.achievementMeta && typeof progress.achievementMeta === "object" ? progress.achievementMeta : {},
    completedProjectMeta: progress.completedProjectMeta && typeof progress.completedProjectMeta === "object" ? progress.completedProjectMeta : {},
    skillProgress: { ...DEFAULT_PROGRESS.skillProgress, ...(progress.skillProgress || {}) },
  };
}

/** Load progress from localStorage (or return defaults). */
export function getProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw);
    const merged = normalizeProgress(parsed);
    // Ensure world unlocks are applied even on a fresh load
    // (e.g. Village was completed in a previous session).
    return applyWorldUnlocks(merged);
  } catch {
    return normalizeProgress(DEFAULT_PROGRESS);
  }
}

export const loadProgress = getProgress;

/** Save progress to localStorage. */
export function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage unavailable — silently continue (in-memory only).
  }
}

/** Add XP and return the new progress object. */
export function addXP(progress, amount) {
  return {
    ...progress,
    xp: progress.xp + amount,
  };
}

/** Mark a lesson complete and return the new progress object. */
export function completeLesson(progress, lessonId) {
  if (progress.completedLessons.includes(lessonId)) return progress;
  return {
    ...progress,
    completedLessons: [...progress.completedLessons, lessonId],
  };
}

/** Mark a challenge complete and return the new progress object. */
export function completeChallenge(progress, challengeId) {
  if (progress.completedChallenges.includes(challengeId)) return progress;
  return {
    ...progress,
    completedChallenges: [...progress.completedChallenges, challengeId],
  };
}

/** Unlock a lesson and return the new progress object. */
export function unlockLesson(progress, lessonId) {
  if (progress.unlockedLessons.includes(lessonId)) return progress;
  return {
    ...progress,
    unlockedLessons: [...progress.unlockedLessons, lessonId],
  };
}

/** Increase a skill's progress percentage and return the new progress object. */
export function addSkillProgress(progress, skillId, percent) {
  const current = progress.skillProgress[skillId] || 0;
  return {
    ...progress,
    skillProgress: {
      ...progress.skillProgress,
      [skillId]: Math.min(100, current + percent),
    },
  };
}

/** Update the streak based on today's activity. */
export function updateStreak(progress) {
  const today = new Date().toISOString().slice(0, 10);
  if (progress.lastActiveDay === today) return progress;

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const streak = progress.lastActiveDay === yesterday ? progress.streak + 1 : 1;

  return {
    ...progress,
    streak,
    lastActiveDay: today,
  };
}

/* ============================================
   WORLD-AWARE PROGRESSION (DATA-DRIVEN)
   ============================================ */

/** Check if a world is fully complete. */
export function isWorldComplete(worldId, progress) {
  if (worldId === "village") {
    return villageLessons.length > 0 && villageLessons.every((l) => (progress.completedLessons || []).includes(l.id));
  }
  const lessons = getLessonsForWorld(worldId);
  if (!lessons || lessons.length === 0) return false;
  return lessons.every((l) => (progress.completedLessons || []).includes(l.id));
}

/** Check if all 6 CodeQuest worlds are complete */
export function isGameComplete(progress = {}) {
  const mainWorlds = ["village", "logic-forest", "web-kingdom", "api-harbor", "backend-citadel", "developer-realm"];
  return mainWorlds.every((worldId) => isWorldComplete(worldId, progress));
}

/** Check if The Village is fully complete. */
export function isVillageComplete(progress) {
  return isWorldComplete("village", progress);
}

/** Check if The Workshop is fully complete (compatibility helper). */
export function isWorkshopComplete(progress) {
  return isWorldComplete("workshop", progress);
}

/** Check if The City is fully complete (compatibility helper). */
export function isCityComplete(progress) {
  return isWorldComplete("city", progress);
}

/** Check if a world is unlocked based on required previous world. */
export function isWorldUnlocked(worldId, progress) {
  const world = getWorldById(worldId);
  if (!world) {
    if (worldId === "village") return true;
    if (worldId === "workshop") return isVillageComplete(progress);
    return false;
  }
  // Root world with no prerequisite is always unlocked
  if (!world.requiredWorld) {
    return true;
  }
  // Prerequisite world must be complete
  return isWorldComplete(world.requiredWorld, progress);
}

/** Calculate progress percentage for a world (0 to 100). */
export function getWorldProgress(worldId, progress) {
  if (worldId === "village") {
    const completed = villageLessons.filter((l) => (progress.completedLessons || []).includes(l.id)).length;
    return Math.min(100, Math.round((completed / villageLessons.length) * 100));
  }
  const lessons = getLessonsForWorld(worldId);
  if (!lessons || lessons.length === 0) return 0;
  const completed = lessons.filter((l) => (progress.completedLessons || []).includes(l.id)).length;
  return Math.min(100, Math.round((completed / lessons.length) * 100));
}

/**
 * Apply world unlock logic to progress.
 * Unlocks any worlds whose prerequisites are satisfied and unlocks initial lessons if available.
 */
export function applyWorldUnlocks(progress) {
  let next = { ...progress };
  const currentUnlocked = new Set(next.unlockedWorlds || ["village"]);
  currentUnlocked.add("village");

  worlds.forEach((world) => {
    if (isWorldUnlocked(world.id, next)) {
      currentUnlocked.add(world.id);
      const firstLesson = getFirstLessonId(world.id);
      if (firstLesson) {
        next = unlockLesson(next, firstLesson);
      }
    }
  });

  next.unlockedWorlds = Array.from(currentUnlocked);

  if (isVillageComplete(next) && workshopLessons.length > 0) {
    next = unlockLesson(next, workshopLessons[0].id);
  }

  return next;
}

/** Get the first lesson ID for a world. */
export function getFirstLessonId(worldId) {
  if (worldId === "village") return villageLessons[0]?.id || null;
  const lessons = getLessonsForWorld(worldId);
  return lessons[0]?.id || null;
}

export function completeProject(progress, projectId) {
  if ((progress.completedProjects || []).includes(projectId)) return progress;
  return {
    ...progress,
    completedProjects: [...(progress.completedProjects || []), projectId],
    projectProgress: { ...(progress.projectProgress || {}), [projectId]: 100 },
    completedProjectMeta: {
      ...(progress.completedProjectMeta || {}),
      [projectId]: { completedAt: new Date().toISOString() },
    },
  };
}

export function updateProjectProgress(progress, projectId, percent) {
  if ((progress.completedProjects || []).includes(projectId)) return progress;
  return {
    ...progress,
    projectProgress: {
      ...(progress.projectProgress || {}),
      [projectId]: Math.max(0, Math.min(99, percent)),
    },
  };
}

export function updateProjectSteps(progress, projectId, steps) {
  if ((progress.completedProjects || []).includes(projectId)) return progress;
  return { ...progress, projectSteps: { ...(progress.projectSteps || {}), [projectId]: steps } };
}