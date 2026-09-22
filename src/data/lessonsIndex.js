/**
 * Unified lesson registry.
 *
 * Combines all worlds' lessons into a single data-driven registry so
 * the UI can consume one generic lesson architecture. Adding a new
 * world only requires adding its lessons array here — no component
 * changes needed.
 */

import { villageLessons } from "./lessons";
import { logicForestLessons } from "./logicForestLessons";
import { webKingdomLessons } from "./webKingdomLessons";
import { apiHarborLessons } from "./apiHarborLessons";
import { backendCitadelLessons } from "./backendCitadelLessons";
import { developerRealmLessons } from "./developerRealmLessons";
import { workshopLessons } from "./workshopLessons";
import { cityLessons } from "./cityLessons";

/** Normalize lessons so every lesson has a world field. */
function normalizeWorld(lessons, worldId) {
  return lessons.map((lesson) => ({
    ...lesson,
    world: lesson.world || worldId,
  }));
}

const normalizedVillage = normalizeWorld(villageLessons, "village");
const normalizedLogicForest = normalizeWorld(logicForestLessons, "logic-forest");
const normalizedWebKingdom = normalizeWorld(webKingdomLessons, "web-kingdom");
const normalizedApiHarbor = normalizeWorld(apiHarborLessons, "api-harbor");
const normalizedBackendCitadel = normalizeWorld(backendCitadelLessons, "backend-citadel");
const normalizedDeveloperRealm = normalizeWorld(developerRealmLessons, "developer-realm");
const normalizedWorkshop = normalizeWorld(workshopLessons, "workshop");
const normalizedCity = normalizeWorld(cityLessons, "city");

export const allLessons = [
  ...normalizedVillage,
  ...normalizedLogicForest,
  ...normalizedWebKingdom,
  ...normalizedApiHarbor,
  ...normalizedBackendCitadel,
  ...normalizedDeveloperRealm,
  ...normalizedWorkshop,
  ...normalizedCity,
];

export const worldLessonMap = {
  village: normalizedVillage,
  "logic-forest": normalizedLogicForest,
  forest: normalizedLogicForest,
  "web-kingdom": normalizedWebKingdom,
  kingdom: normalizedWebKingdom,
  "api-harbor": normalizedApiHarbor,
  harbor: normalizedApiHarbor,
  "backend-citadel": normalizedBackendCitadel,
  citadel: normalizedBackendCitadel,
  "developer-realm": normalizedDeveloperRealm,
  realm: normalizedDeveloperRealm,
  workshop: normalizedWorkshop,
  city: normalizedCity,
};

/** Get a lesson by ID from any world. */
export function getLessonById(lessonId) {
  return allLessons.find((l) => l.id === lessonId);
}

/** Get the next lesson ID within the same world. */
export function getNextLessonId(lessonId) {
  const lesson = getLessonById(lessonId);
  if (!lesson) return null;

  const worldLessons = worldLessonMap[lesson.world] || normalizedVillage;
  const index = worldLessons.findIndex((l) => l.id === lessonId);
  if (index === -1 || index >= worldLessons.length - 1) return null;
  return worldLessons[index + 1].id;
}

/** Get the lesson index within its world. */
export function getLessonIndex(lessonId) {
  const lesson = getLessonById(lessonId);
  if (!lesson) return -1;
  const worldLessons = worldLessonMap[lesson.world] || normalizedVillage;
  return worldLessons.findIndex((l) => l.id === lessonId);
}

/** Get lessons for a specific world. */
export function getLessonsForWorld(worldId) {
  return worldLessonMap[worldId] || [];
}

/** Get progress percentage for a world. */
export function getWorldProgress(worldId, progress) {
  const lessons = getLessonsForWorld(worldId);
  if (lessons.length === 0) return 0;
  const completed = lessons.filter((l) => (progress.completedLessons || []).includes(l.id)).length;
  return Math.round((completed / lessons.length) * 100);
}

/** Check if a world is fully complete. */
export function isWorldComplete(worldId, progress) {
  const lessons = getLessonsForWorld(worldId);
  if (!lessons || lessons.length === 0) return false;
  return lessons.every((l) => (progress.completedLessons || []).includes(l.id));
}

/** Get the first unlocked but not completed lesson for a world. */
export function getCurrentLessonForWorld(worldId, progress) {
  const lessons = getLessonsForWorld(worldId);
  return lessons.find(
    (l) => (progress.unlockedLessons || []).includes(l.id) && !(progress.completedLessons || []).includes(l.id)
  );
}