/**
 * Code checkpoint persistence.
 * Saves the player's in-progress code to localStorage so
 * they don't lose work when leaving the Code Arena.
 */

const CHECKPOINT_KEY = "codequest-checkpoints-v1";

/** Load all checkpoints. */
export function getCheckpoints() {
  try {
    const raw = localStorage.getItem(CHECKPOINT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** Get a checkpoint for a specific challenge. */
export function getCheckpoint(challengeId) {
  const all = getCheckpoints();
  return all[challengeId] || null;
}

/** Save a checkpoint for a challenge. */
export function saveCheckpoint(challengeId, code) {
  const all = getCheckpoints();
  all[challengeId] = {
    challengeId,
    code,
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(CHECKPOINT_KEY, JSON.stringify(all));
  } catch {
    // Storage unavailable — silently continue.
  }
}

/** Clear a checkpoint for a challenge (e.g. after completion). */
export function clearCheckpoint(challengeId) {
  const all = getCheckpoints();
  delete all[challengeId];
  try {
    localStorage.setItem(CHECKPOINT_KEY, JSON.stringify(all));
  } catch {
    // Storage unavailable — silently continue.
  }
}