/**
 * cloudSync.js
 *
 * Cloud synchronization service for CodeQuest player progress.
 * Manages player identity persistence, non-blocking background synchronization,
 * offline fallback, and deterministic merge rules between localStorage and MongoDB.
 */

import { createPlayer, getPlayer, updatePlayerProgress } from "./apiClient";
import { getLevelInfo } from "../engine/levelEngine";

export const PLAYER_ID_KEY = "codequest_player_id";

/**
 * Get stored player ID from localStorage.
 */
export function getPlayerId() {
  if (typeof window === "undefined" || !window.localStorage) return null;
  return localStorage.getItem(PLAYER_ID_KEY);
}

/**
 * Save player ID to localStorage.
 */
export function setPlayerId(id) {
  if (typeof window === "undefined" || !window.localStorage || !id) return;
  localStorage.setItem(PLAYER_ID_KEY, String(id));
}

/**
 * Remove player ID from localStorage.
 */
export function clearPlayerId() {
  if (typeof window === "undefined" || !window.localStorage) return;
  localStorage.removeItem(PLAYER_ID_KEY);
}

/**
 * Deterministic Merge Strategy
 *
 * Combines local progress with cloud progress using safe rules:
 * - Arrays (completedLessons, unlockedLessons, completedWorlds, achievements):
 *   Mathematical Set UNION (unique distinct elements).
 * - Skills (programming, algorithms, etc.):
 *   Key-by-key MAXIMUM percent progress.
 * - XP & Streak:
 *   MAXIMUM value without duplication.
 * - Level:
 *   Calculated deterministically from the final merged XP.
 *
 * @param {object} local - Progress object from local engine.
 * @param {object} cloud - User profile object from cloud API.
 * @returns {object} Merged local progress object.
 */
export function mergeLocalAndCloudProgress(local = {}, cloud = {}) {
  // 1. Array Union for missions and achievements
  const completedLessons = Array.from(
    new Set([...(local.completedLessons || []), ...(cloud.completedLessons || [])])
  );

  const completedChallenges = Array.from(
    new Set([...(local.completedChallenges || []), ...(cloud.completedChallenges || [])])
  );

  const unlockedLessons = Array.from(
    new Set(["lesson-01", ...(local.unlockedLessons || []), ...(cloud.unlockedLessons || [])])
  );

  const completedWorlds = Array.from(
    new Set([...(local.completedWorlds || []), ...(cloud.completedWorlds || [])])
  );

  const achievements = Array.from(
    new Set([...(local.achievements || []), ...(cloud.achievements || [])])
  );

  // 2. Skills: Key-by-key maximum progress
  const mergedSkills = { ...(local.skillProgress || local.skills || {}) };
  const cloudSkills = cloud.skills || {};
  for (const [skillId, percent] of Object.entries(cloudSkills)) {
    mergedSkills[skillId] = Math.max(mergedSkills[skillId] || 0, percent || 0);
  }

  // 3. XP & Streak: Highest verified progress
  const xp = Math.max(Number(local.xp) || 0, Number(cloud.xp) || 0);
  const streak = Math.max(Number(local.streak) || 0, Number(cloud.streak) || 0);
  const longestStreak = Math.max(
    Number(local.longestStreak) || streak,
    Number(cloud.longestStreak) || 0
  );
  const lastActiveDay = local.lastActiveDay || cloud.lastActiveDay || null;

  return {
    ...local,
    xp,
    streak,
    longestStreak,
    lastActiveDay,
    completedLessons,
    completedChallenges,
    unlockedLessons,
    completedWorlds,
    achievements,
    skillProgress: mergedSkills,
  };
}

/**
 * Prepares a clean progress payload formatted for the cloud API.
 */
export function formatCloudPayload(progress = {}) {
  const levelInfo = getLevelInfo(progress.xp || 0);
  return {
    xp: Math.max(0, progress.xp || 0),
    level: Math.max(1, levelInfo.level || 1),
    streak: Math.max(0, progress.streak || 0),
    longestStreak: Math.max(0, progress.longestStreak || progress.streak || 0),
    lastActiveDay: progress.lastActiveDay || null,
    avatar: progress.avatar || "⚔️",
    completedLessons: Array.isArray(progress.completedLessons) ? progress.completedLessons : [],
    completedChallenges: Array.isArray(progress.completedChallenges) ? progress.completedChallenges : [],
    unlockedLessons: Array.isArray(progress.unlockedLessons) ? progress.unlockedLessons : ["lesson-01"],
    completedWorlds: Array.isArray(progress.completedWorlds) ? progress.completedWorlds : [],
    skills: progress.skillProgress || progress.skills || {},
    achievements: Array.isArray(progress.achievements) ? progress.achievements : [],
  };
}

/**
 * Initialize player on startup and synchronize with cloud state.
 *
 * @param {object} currentLocalProgress - Initial local progress.
 * @returns {Promise<{playerId: string|null, mergedProgress: object, syncStatus: string}>}
 */
export async function initializePlayerAndSync(currentLocalProgress) {
  let playerId = getPlayerId();

  // Scenario A: Existing player ID stored locally
  if (playerId) {
    const fetchResult = await getPlayer(playerId);

    if (fetchResult.success && fetchResult.user) {
      const merged = mergeLocalAndCloudProgress(currentLocalProgress, fetchResult.user);
      // Push any newer local items to cloud
      try {
        await updatePlayerProgress(playerId, formatCloudPayload(merged));
      } catch (e) {
        // Non-fatal: local remains safe
      }
      return {
        playerId,
        mergedProgress: merged,
        syncStatus: "synced",
      };
    }

    // If 404 (user was wiped or deleted from database), re-create anonymous player
    if (fetchResult.status === 404) {
      clearPlayerId();
      playerId = null;
    } else {
      // Backend is offline or unreachable
      return {
        playerId,
        mergedProgress: currentLocalProgress,
        syncStatus: "offline",
      };
    }
  }

  // Scenario B: No player ID or reset needed -> create anonymous player
  const createResult = await createPlayer();
  if (createResult.success && createResult.user?.id) {
    const newId = createResult.user.id;
    setPlayerId(newId);

    // Initial push of existing local progress to new cloud player
    const merged = mergeLocalAndCloudProgress(currentLocalProgress, createResult.user);
    if (merged.xp > 0 || (merged.completedLessons && merged.completedLessons.length > 0)) {
      try {
        await updatePlayerProgress(newId, formatCloudPayload(merged));
      } catch (e) {
        // Non-fatal: local remains safe
      }
    }

    return {
      playerId: newId,
      mergedProgress: merged,
      syncStatus: "synced",
    };
  }

  // Backend offline on first load
  return {
    playerId: null,
    mergedProgress: currentLocalProgress,
    syncStatus: "offline",
  };
}
