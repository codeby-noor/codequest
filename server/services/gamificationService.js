/**
 * gamificationService.js
 *
 * Core gamification business logic for CodeQuest:
 * - Transparent level thresholds and level calculations
 * - Server-side daily streak tracking with UTC date boundaries
 * - Difficulty-based XP rules and verified challenge completion
 * - Configurable achievement eligibility evaluation
 * - Safe tie-breaking and rank calculation helpers
 */

const LEVEL_THRESHOLDS = [
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

const LEVEL_TITLES = [
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

const DIFFICULTY_XP_MAP = {
  beginner: 50,
  intermediate: 100,
  advanced: 150,
  boss: 250,
  expert: 250,
};

const ACHIEVEMENTS_CATALOG = [
  {
    id: "first-challenge",
    title: "First Challenge",
    description: "Complete your first verified challenge in the Code Arena.",
    icon: "🌱",
    category: "Learning",
    rarity: "Common",
    xp: 50,
    check: (u) => (u.completedChallenges || []).length >= 1,
  },
  {
    id: "five-challenges",
    title: "Five Challenges Completed",
    description: "Solve five coding challenges across any world.",
    icon: "⚡",
    category: "Milestones",
    rarity: "Common",
    xp: 100,
    check: (u) => (u.completedChallenges || []).length >= 5,
  },
  {
    id: "ten-challenges",
    title: "Ten Challenges Completed",
    description: "Solve ten coding challenges to demonstrate growing mastery.",
    icon: "🔥",
    category: "Milestones",
    rarity: "Rare",
    xp: 200,
    check: (u) => (u.completedChallenges || []).length >= 10,
  },
  {
    id: "streak-starter",
    title: "Streak Starter",
    description: "Maintain a 3-day coding streak.",
    icon: "🔥",
    category: "Consistency",
    rarity: "Common",
    xp: 40,
    check: (u) => (u.streak || 0) >= 3,
  },
  {
    id: "streak-master",
    title: "Seven-Day Streak",
    description: "Maintain a 7-day coding streak without missing a day.",
    icon: "🌟",
    category: "Consistency",
    rarity: "Epic",
    xp: 150,
    check: (u) => (u.streak || 0) >= 7,
  },
  {
    id: "first-boss",
    title: "First Difficult Challenge",
    description: "Conquer a Boss-level or Advanced challenge.",
    icon: "⚔️",
    category: "Milestones",
    rarity: "Rare",
    xp: 150,
    check: (u) =>
      Boolean(u.hasCompletedBoss) ||
      (u.completedChallenges || []).some(
        (id) =>
          id.toLowerCase().includes("boss") ||
          id === "lesson-18-challenge" ||
          id === "forest-15-challenge" ||
          id === "web-16-challenge" ||
          id === "harbor-16-challenge" ||
          id === "citadel-16-challenge" ||
          id === "realm-16-challenge"
      ),
  },
  {
    id: "learning-milestone",
    title: "Learning Milestone",
    description: "Reach Level 3 and earn at least 2,500 verified XP.",
    icon: "✨",
    category: "Milestones",
    rarity: "Rare",
    xp: 100,
    check: (u) => (u.xp || 0) >= 2500 || (u.level || 1) >= 3,
  },
];

/**
 * Calculates level from total verified XP using transparent level thresholds.
 *
 * @param {number} xp - Total verified XP.
 * @returns {number} Level (1-based integer).
 */
function calculateLevel(xp = 0) {
  const safeXp = Math.max(0, Number(xp) || 0);
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i += 1) {
    if (safeXp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    }
  }
  return level;
}

/**
 * Returns level progress details for a given XP.
 */
function getLevelInfo(xp = 0) {
  const safeXp = Math.max(0, Number(xp) || 0);
  const level = calculateLevel(safeXp);
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] ?? currentThreshold + 1000;
  const current = safeXp - currentThreshold;
  const needed = Math.max(1, nextThreshold - currentThreshold);
  const percent = Math.min(100, Math.round((current / needed) * 100));

  return {
    level,
    title: LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)],
    current,
    needed,
    percent,
    nextThreshold,
  };
}

/**
 * Formats a UTC date string (YYYY-MM-DD).
 */
function getUtcDateString(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().slice(0, 10);
}

/**
 * Computes calendar day difference between two UTC date strings (YYYY-MM-DD).
 */
function getDaysBetweenUtc(dateStrA, dateStrB) {
  if (!dateStrA || !dateStrB) return null;
  const [y1, m1, d1] = dateStrA.split("-").map(Number);
  const [y2, m2, d2] = dateStrB.split("-").map(Number);
  const utc1 = Date.UTC(y1, m1 - 1, d1);
  const utc2 = Date.UTC(y2, m2 - 1, d2);
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  return Math.round((utc2 - utc1) / MS_PER_DAY);
}

/**
 * Server-side streak calculator with UTC date boundaries.
 * - Same day submission: does not increment streak (idempotent)
 * - Consecutive day submission: streak increments by 1
 * - Missed 1+ days: streak resets to 1
 * - User login/refresh alone NEVER resets streak
 *
 * @param {object} params
 * @param {number} params.currentStreak - Existing streak
 * @param {number} params.longestStreak - Existing longest streak
 * @param {string|null} params.lastActiveDay - Last active date (YYYY-MM-DD)
 * @param {Date} [params.nowDate] - Current date (for testing or real execution)
 * @returns {{ streak: number, longestStreak: number, lastActiveDay: string, isNewDay: boolean }}
 */
function calculateStreak({
  currentStreak = 0,
  longestStreak = 0,
  lastActiveDay = null,
  nowDate = new Date(),
} = {}) {
  const todayUtc = getUtcDateString(nowDate);

  // If already active today, preserve streak without double-counting
  if (lastActiveDay === todayUtc) {
    return {
      streak: Math.max(1, currentStreak),
      longestStreak: Math.max(longestStreak, currentStreak, 1),
      lastActiveDay: todayUtc,
      isNewDay: false,
    };
  }

  // If no prior activity
  if (!lastActiveDay) {
    return {
      streak: 1,
      longestStreak: Math.max(longestStreak, 1),
      lastActiveDay: todayUtc,
      isNewDay: true,
    };
  }

  const daysDiff = getDaysBetweenUtc(lastActiveDay, todayUtc);

  let newStreak = 1;
  if (daysDiff === 1) {
    // Consecutive day
    newStreak = (currentStreak || 0) + 1;
  } else if (daysDiff <= 0) {
    // Clock skew / same day edge case
    newStreak = Math.max(1, currentStreak);
  } else {
    // Missed at least one day
    newStreak = 1;
  }

  const newLongest = Math.max(longestStreak || 0, newStreak);

  return {
    streak: newStreak,
    longestStreak: newLongest,
    lastActiveDay: todayUtc,
    isNewDay: true,
  };
}

/**
 * Determines verified XP for a challenge based on difficulty and catalog metadata.
 *
 * @param {object} challengeInfo
 * @param {string} [challengeInfo.difficulty] - "Beginner", "Intermediate", "Advanced", "Boss"
 * @param {number} [challengeInfo.xp] - Challenge catalog XP
 * @returns {number} Standard XP reward
 */
function resolveChallengeXp(challengeInfo = {}) {
  if (typeof challengeInfo.xp === "number" && challengeInfo.xp > 0) {
    // Cap at reasonable maximum per single challenge (prevent tampering)
    return Math.min(500, Math.max(25, Math.round(challengeInfo.xp)));
  }

  const diffKey = String(challengeInfo.difficulty || "beginner").toLowerCase();
  return DIFFICULTY_XP_MAP[diffKey] || 50;
}

/**
 * Evaluates which achievements from the catalog are newly satisfied.
 *
 * @param {object} userState - Current user state after completion.
 * @param {string[]} currentAchievements - Already unlocked achievement IDs.
 * @returns {Array<object>} Newly unlocked achievement objects with XP bonus.
 */
function evaluateEligibleAchievements(userState = {}, currentAchievements = []) {
  const unlockedSet = new Set(Array.isArray(currentAchievements) ? currentAchievements : []);
  const newlyUnlocked = [];

  for (const achievement of ACHIEVEMENTS_CATALOG) {
    if (!unlockedSet.has(achievement.id)) {
      if (achievement.check(userState)) {
        newlyUnlocked.push(achievement);
      }
    }
  }

  return newlyUnlocked;
}

module.exports = {
  LEVEL_THRESHOLDS,
  LEVEL_TITLES,
  DIFFICULTY_XP_MAP,
  ACHIEVEMENTS_CATALOG,
  calculateLevel,
  getLevelInfo,
  getUtcDateString,
  getDaysBetweenUtc,
  calculateStreak,
  resolveChallengeXp,
  evaluateEligibleAchievements,
};
