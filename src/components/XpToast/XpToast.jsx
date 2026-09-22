import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "../../context/ProgressContext";
import { playAchievementSound } from "../../engine/soundEffects";

/**
 * Small toast notification shown when XP is earned.
 */
export default function XpToast() {
  const { lastReward, dismissReward } = useProgress();

  useEffect(() => {
    if (lastReward && String(lastReward.reason || "").toLowerCase().includes("achievement")) {
      playAchievementSound();
    }
  }, [lastReward]);

  return (
    <AnimatePresence>
      {lastReward && (
        <motion.div
          className="xp-toast"
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          onClick={dismissReward}
        >
          <span className="xp-toast-icon" aria-hidden="true">⚡</span>
          <div className="xp-toast-body">
            <div className="xp-toast-amount">+{lastReward.amount} XP</div>
            <div className="xp-toast-reason">{lastReward.reason}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}