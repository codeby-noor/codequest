/**
 * Lightweight Web Audio API Sound Synthesizer
 *
 * Provides delightful, zero-dependency retro/modern game chimes for:
 * - Quest success
 * - Level up
 * - Achievement unlock
 * - Button click
 *
 * Fully skippable/mutable, silent in test/node environments,
 * and conforms to browser AudioContext auto-play policies.
 */

const STORAGE_KEY = "codequest-sound-enabled";

let audioCtx = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!audioCtx) {
    try {
      audioCtx = new AudioContextClass();
    } catch {
      return null;
    }
  }

  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }

  return audioCtx;
}

export function isSoundEnabled() {
  if (typeof window === "undefined" || !window.localStorage) return false;
  const val = localStorage.getItem(STORAGE_KEY);
  return val === null ? true : val === "true";
}

export function setSoundEnabled(enabled) {
  if (typeof window === "undefined" || !window.localStorage) return;
  localStorage.setItem(STORAGE_KEY, String(enabled));
}

export function toggleSound() {
  const next = !isSoundEnabled();
  setSoundEnabled(next);
  return next;
}

/** Play a pure synthesized tone */
function playTone(freq, type = "sine", duration = 0.15, startTime = 0, gainLevel = 0.1) {
  const ctx = getAudioContext();
  if (!ctx || !isSoundEnabled()) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

    gain.gain.setValueAtTime(gainLevel, ctx.currentTime + startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + startTime);
    osc.stop(ctx.currentTime + startTime + duration);
  } catch {
    // Audio playback blocked or unavailable
  }
}

/** Success chime: rising cheerful two-tone */
export function playSuccessSound() {
  if (!isSoundEnabled()) return;
  playTone(523.25, "sine", 0.12, 0, 0.08); // C5
  playTone(659.25, "sine", 0.18, 0.1, 0.08); // E5
  playTone(783.99, "triangle", 0.25, 0.2, 0.1); // G5
}

/** Level-up celebration: major chord arpeggio */
export function playLevelUpSound() {
  if (!isSoundEnabled()) return;
  playTone(523.25, "triangle", 0.1, 0, 0.1); // C5
  playTone(659.25, "triangle", 0.1, 0.08, 0.1); // E5
  playTone(783.99, "triangle", 0.12, 0.16, 0.1); // G5
  playTone(1046.5, "sine", 0.4, 0.24, 0.12); // C6
}

/** Achievement unlock: triumphant fanfare */
export function playAchievementSound() {
  if (!isSoundEnabled()) return;
  playTone(440.0, "triangle", 0.1, 0, 0.1); // A4
  playTone(554.37, "triangle", 0.1, 0.08, 0.1); // C#5
  playTone(659.25, "triangle", 0.15, 0.16, 0.1); // E5
  playTone(880.0, "sine", 0.35, 0.24, 0.12); // A5
}

/** Click sound */
export function playClickSound() {
  if (!isSoundEnabled()) return;
  playTone(800, "sine", 0.04, 0, 0.03);
}
