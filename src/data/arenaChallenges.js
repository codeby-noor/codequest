/**
 * Code Arena challenge definitions.
 *
 * Fully data-driven: derives every arena challenge directly from
 * lesson data across all worlds. No lesson-specific switch logic exists here.
 *
 * Adding a new lesson to any world's lessons file automatically creates a
 * new arena challenge with its tests, hints, solution, and requirements.
 */

import { villageLessons } from "./lessons";
import { logicForestLessons } from "./logicForestLessons";
import { webKingdomLessons } from "./webKingdomLessons";
import { apiHarborLessons } from "./apiHarborLessons";
import { backendCitadelLessons } from "./backendCitadelLessons";
import { developerRealmLessons } from "./developerRealmLessons";
import { workshopLessons } from "./workshopLessons";
import { cityLessons } from "./cityLessons";

const WORLD_META = {
  village: { id: "village", name: "JavaScript Village", subtitle: "Fundamentals" },
  "logic-forest": { id: "logic-forest", name: "The Logic Forest", subtitle: "Algorithms & Logic" },
  forest: { id: "logic-forest", name: "The Logic Forest", subtitle: "Algorithms & Logic" },
  "web-kingdom": { id: "web-kingdom", name: "The Web Kingdom", subtitle: "HTML, CSS & Web UI" },
  kingdom: { id: "web-kingdom", name: "The Web Kingdom", subtitle: "HTML, CSS & Web UI" },
  "api-harbor": { id: "api-harbor", name: "The API Harbor", subtitle: "HTTP, REST & Async JS" },
  harbor: { id: "api-harbor", name: "The API Harbor", subtitle: "HTTP, REST & Async JS" },
  "backend-citadel": { id: "backend-citadel", name: "The Backend Citadel", subtitle: "Node.js, Express & Databases" },
  citadel: { id: "backend-citadel", name: "The Backend Citadel", subtitle: "Node.js, Express & Databases" },
  "developer-realm": { id: "developer-realm", name: "The Developer Realm", subtitle: "Architecture & Production" },
  realm: { id: "developer-realm", name: "The Developer Realm", subtitle: "Architecture & Production" },
  workshop: { id: "workshop", name: "The Workshop", subtitle: "HTML + CSS" },
  city: { id: "city", name: "The City", subtitle: "Advanced JavaScript" },
};

/**
 * Build arena challenge data from lesson challenges.
 * Requirements come from each challenge's own data — not hook code.
 */
function buildArenaChallenges() {
  const allLessons = [
    ...villageLessons,
    ...logicForestLessons,
    ...webKingdomLessons,
    ...apiHarborLessons,
    ...backendCitadelLessons,
    ...developerRealmLessons,
    ...workshopLessons,
    ...cityLessons,
  ];

  return allLessons.map((lesson) => {
    const challenge = lesson.challenge;
    const worldMeta = WORLD_META[lesson.world] || WORLD_META.village;
    return {
      id: challenge.id,
      title: lesson.title,
      world: worldMeta.id,
      worldName: worldMeta.name,
      worldSubtitle: worldMeta.subtitle,
      lessonId: lesson.id,
      difficulty: lesson.type === "boss" ? "Boss" : lesson.difficulty || "Beginner",
      xp: lesson.xp,
      starterCode: challenge.starterCode,
      tests: challenge.tests,
      hints: challenge.hints,
      solution: challenge.solution,
      solutionExplanation: challenge.solutionExplanation,
      objective: challenge.prompt,
      estimatedTime: lesson.estimatedTime || (lesson.type === "boss" ? 15 : 5),
      requirements: challenge.requirements || [],
      challengeType: lesson.challengeType || "javascript",
      skillId: lesson.skillId || lesson.skill || "programming",
      skillProgress: lesson.skillProgress || lesson.skillPercent || 5,
    };
  });
}

export const arenaChallenges = buildArenaChallenges();

export function getArenaChallengeById(challengeId) {
  return arenaChallenges.find((c) => c.id === challengeId);
}

export function getArenaChallengeByLessonId(lessonId) {
  return arenaChallenges.find((c) => c.lessonId === lessonId);
}

/** Get arena challenges grouped by world. */
export function getArenaChallengesByWorld() {
  return {
    village: arenaChallenges.filter((c) => c.world === "village"),
    "logic-forest": arenaChallenges.filter((c) => c.world === "logic-forest" || c.world === "forest"),
    "web-kingdom": arenaChallenges.filter((c) => c.world === "web-kingdom" || c.world === "kingdom"),
    "api-harbor": arenaChallenges.filter((c) => c.world === "api-harbor" || c.world === "harbor"),
    "backend-citadel": arenaChallenges.filter((c) => c.world === "backend-citadel" || c.world === "citadel"),
    "developer-realm": arenaChallenges.filter((c) => c.world === "developer-realm" || c.world === "realm"),
    realm: arenaChallenges.filter((c) => c.world === "developer-realm" || c.world === "realm"),
    workshop: arenaChallenges.filter((c) => c.world === "workshop"),
    city: arenaChallenges.filter((c) => c.world === "city"),
  };
}