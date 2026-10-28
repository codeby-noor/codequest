/**
 * Challenge display data and structured learning paths.
 *
 * Single source of truth: lessons (all worlds) → arenaChallenges.js → challenges.js
 *
 * This file derives display challenge cards and topic classifications from
 * the real executable arena challenges. It does NOT define fake records.
 */

import { arenaChallenges, getArenaChallengesByWorld } from "./arenaChallenges";

const WORLD_COUNTS = {};
const byWorld = getArenaChallengesByWorld();
Object.keys(byWorld).forEach((worldId) => {
  byWorld[worldId].forEach((c, index) => {
    WORLD_COUNTS[c.id] = index;
  });
});

/**
 * Categorizes a challenge into structured learning topics based on curriculum metadata.
 */
export function getChallengeTopic(challenge = {}) {
  const text = `${challenge.title || ""} ${challenge.objective || ""} ${challenge.skillId || ""}`.toLowerCase();
  const worldId = challenge.world || "";

  if (text.includes("variable") || text.includes("constant") || text.includes("data type") || text.includes("numbers") || text.includes("string interpolation")) {
    return "variables";
  }
  if (text.includes("condition") || text.includes("if/else") || text.includes("loop") || text.includes("while") || text.includes("switch") || text.includes("guard clause")) {
    return "conditionals";
  }
  if (text.includes("function") || text.includes("scope") || text.includes("arrow") || text.includes("parameters") || text.includes("return")) {
    return "functions";
  }
  if (text.includes("array") || text.includes("string") || text.includes("filter") || text.includes("map") || text.includes("slice") || text.includes("reduce")) {
    return "arrays";
  }
  if (text.includes("object") || text.includes("key") || text.includes("property") || text.includes("lookup") || text.includes("dictionary") || text.includes("set")) {
    return "objects";
  }
  if (worldId === "logic-forest" || text.includes("algorithm") || text.includes("search") || text.includes("sort") || text.includes("problem decomposition")) {
    return "algorithms";
  }
  if (worldId === "web-kingdom" || text.includes("html") || text.includes("css") || text.includes("dom") || text.includes("flexbox") || text.includes("grid")) {
    return "web";
  }
  if (worldId === "api-harbor" || worldId === "backend-citadel" || worldId === "developer-realm" || text.includes("async") || text.includes("fetch") || text.includes("http") || text.includes("express") || text.includes("git")) {
    return "backend";
  }

  return "fundamentals";
}

export const TOPIC_LIST = [
  { id: "all", label: "All Topics", icon: "🌐" },
  { id: "fundamentals", label: "Programming Fundamentals", icon: "🌱" },
  { id: "variables", label: "Variables & Data Types", icon: "📦" },
  { id: "conditionals", label: "Conditions & Loops", icon: "🔄" },
  { id: "functions", label: "Functions & Scope", icon: "⚙️" },
  { id: "arrays", label: "Arrays & Strings", icon: "📜" },
  { id: "objects", label: "Objects & Data Structures", icon: "🧱" },
  { id: "algorithms", label: "Algorithms & Logic", icon: "🌲" },
  { id: "web", label: "Modern Web & UI", icon: "🏰" },
  { id: "backend", label: "APIs & Systems", icon: "🛡️" },
];

export const DIFFICULTY_LIST = [
  { id: "all", label: "All Difficulties" },
  { id: "Beginner", label: "Beginner" },
  { id: "Intermediate", label: "Intermediate" },
  { id: "Advanced", label: "Advanced" },
  { id: "Boss", label: "Boss Battles" },
];

export const challenges = arenaChallenges.map((challenge) => {
  const rawDifficulty = challenge.difficulty || "Beginner";
  const difficulty = rawDifficulty === "Boss" ? "Boss" : rawDifficulty;
  const difficultyTone =
    difficulty === "Boss"
      ? "danger"
      : difficulty === "Advanced" || difficulty === "Expert"
      ? "danger"
      : difficulty === "Intermediate"
      ? "warning"
      : "success";

  const topic = getChallengeTopic(challenge);

  return {
    id: challenge.id,
    lessonId: challenge.lessonId,
    code: `MISSION ${String((WORLD_COUNTS[challenge.id] || 0) + 1).padStart(3, "0")}`,
    title: challenge.title,
    difficulty,
    difficultyTone,
    xp: challenge.xp,
    world: challenge.worldName,
    worldId: challenge.world,
    objective: challenge.objective,
    topic,
    status: "available",
  };
});

export const todayChallenge = challenges[0];