/**
 * Level calculation engine.
 * Level thresholds define the XP required to reach each level.
 *
 * Level 01 → 0 XP
 * Level 02 → 1000 XP
 * Level 03 → 2500 XP
 * Level 04 → 5000 XP
 * ...
 */

export const LEVEL_THRESHOLDS = [
  0,      // Level 1
  1000,   // Level 2
  2500,   // Level 3
  5000,   // Level 4
  8000,   // Level 5
  12000,  // Level 6
  17000,  // Level 7
  23000,  // Level 8
  30000,  // Level 9
  40000,  // Level 10
  55000,  // Level 11+
];

export const LEVEL_TITLES = [
  "Novice Coder",
  "Apprentice Coder",
  "Journeyman Coder",
  "Skilled Developer",
  "Advanced Developer",
  "Expert Engineer",
  "Master Engineer",
  "Ultra Engineer",
  "Pro Engineer",
  "Ultra Pro",
  "Legendary Ultra",
];

/** Returns the player's level for a given XP value. */
export function calculateLevel(xp) {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i += 1) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    }
  }
  return level;
}

/** Returns the level title for a given level. */
export function getLevelTitle(level) {
  return LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];
}

/**
 * Returns progress info for the XP bar:
 * { level, title, current (xp within level), needed (xp to next level), percent }
 */
export function getLevelInfo(xp) {
  const level = calculateLevel(xp);
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] ?? currentThreshold + 1000;
  const current = xp - currentThreshold;
  const needed = nextThreshold - currentThreshold;
  const percent = needed > 0 ? Math.min(100, Math.round((current / needed) * 100)) : 100;

  return {
    level,
    title: getLevelTitle(level),
    current,
    needed,
    percent,
  };
}