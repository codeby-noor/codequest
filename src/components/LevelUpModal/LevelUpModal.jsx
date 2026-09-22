import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../Button/Button";
import { useProgress } from "../../context/ProgressContext";
import { playLevelUpSound } from "../../engine/soundEffects";

/**
 * Full-screen level-up modal shown when the player levels up.
 */
export default function LevelUpModal() {
  const { levelUp, dismissLevelUp } = useProgress();

  useEffect(() => {
    if (levelUp) {
      playLevelUpSound();
    }
  }, [levelUp]);

  return (
    <AnimatePresence>
      {levelUp && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={dismissLevelUp}
        >
          <motion.div
            className="modal-card level-up-card"
            role="dialog"
            aria-modal="true"
            aria-label="Level up"
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="levelup-glow" aria-hidden="true" />
            <div className="levelup-icon" aria-hidden="true">
              🚀
            </div>
            <span className="levelup-label">LEVEL UP!</span>
            <h2>You reached Level {levelUp.to}.</h2>
            <p className="levelup-title">{levelUp.title}</p>
            <Button variant="primary" size="lg" onClick={dismissLevelUp}>
              Continue Quest →
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}