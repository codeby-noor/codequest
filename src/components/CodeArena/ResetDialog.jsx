import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../Button/Button";

/**
 * Reset confirmation dialog.
 * Prevents accidentally destroying the player's work.
 */
export default function ResetDialog({ open, onCancel, onConfirm }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-label="Reset code confirmation"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-icon" aria-hidden="true">⚠️</div>
            <h2>Reset Code?</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              Your current code will be replaced with the original starter code.
            </p>
            <div className="modal-actions">
              <Button variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
              <Button variant="secondary" onClick={onConfirm}>
                Reset Code
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}