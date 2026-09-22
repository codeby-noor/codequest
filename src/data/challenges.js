/**
 * Challenge display data.
 *
 * Single source of truth: lessons (all worlds) → arenaChallenges.js → challenges.js
 *
 * This file derives display-only challenge cards from the real executable
 * arena challenges. It does NOT define its own challenge logic — every
 * challenge ID here maps 1:1 to a real challenge in the Code Arena.
 */

import { arenaChallenges, getArenaChallengesByWorld } from "./arenaChallenges";

const WORLD_COUNTS = {};
const byWorld = getArenaChallengesByWorld();
Object.keys(byWorld).forEach((worldId) => {
  byWorld[worldId].forEach((c, index) => {
    WORLD_COUNTS[c.id] = index;
  });
});

export const challenges = arenaChallenges.map((challenge) => ({
  id: challenge.id,
  lessonId: challenge.lessonId,
  code: `MISSION ${String(WORLD_COUNTS[challenge.id] + 1).padStart(3, "0")}`,
  title: challenge.title,
  difficulty: challenge.difficulty === "Boss" ? "Boss" : "Beginner",
  difficultyTone: challenge.difficulty === "Boss" ? "danger" : "success",
  xp: challenge.xp,
  world: challenge.worldName,
  objective: challenge.objective,
  // Status is computed live from ProgressContext in MissionCard.
  status: "available",
}));

export const todayChallenge = challenges[0];