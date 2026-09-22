import React from "react";
import { motion } from "framer-motion";

/**
 * Animated progress bar.
 * Uses Framer Motion to animate the fill width when it enters the viewport.
 */
export default function ProgressBar({ value, size = "md", label, showValue = false }) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={`progress ${size === "sm" ? "progress-sm" : ""} ${size === "lg" ? "progress-lg" : ""}`}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || "Progress"}
    >
      <motion.div
        className="progress-fill"
        initial={{ width: 0 }}
        whileInView={{ width: `${clamped}%` }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
      />
      {showValue && (
        <span className="sr-only" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
          {clamped}%
        </span>
      )}
    </div>
  );
}