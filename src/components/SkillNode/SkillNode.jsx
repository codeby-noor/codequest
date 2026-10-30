import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProgressBar from "../ProgressBar/ProgressBar";

/**
 * Individual skill node in the skill tree.
 * Shows icon, name, progress, and a hover tooltip with details.
 */
export default function SkillNode({ skill, index }) {
  const [hovered, setHovered] = useState(false);
  const { name, description, icon, progress, xpRequired, status } = skill;

  const statusClass =
    status === "completed" ? "completed" : status === "current" ? "current" : "locked";

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <motion.button
        type="button"
        className={`skill-node ${statusClass}`}
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        aria-label={`${name} — ${status === "locked" ? "locked" : `${progress}% complete`}`}
        aria-describedby={`skill-desc-${skill.id}`}
      >
        <span className="skill-node-icon" aria-hidden="true">
          {icon}
        </span>
        <span className="skill-node-info">
          <span className="skill-node-name">{name}</span>
          <span className="skill-node-progress">
            {status === "locked"
              ? `Requires ${xpRequired} XP`
              : `${progress}% mastered`}
          </span>
        </span>
        {status === "current" && (
          <span className="badge badge-accent" aria-hidden="true">
            Current
          </span>
        )}
        {status === "completed" && (
          <span className="badge badge-success" aria-hidden="true">
            ✓
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {hovered && (
          <motion.div
            id={`skill-desc-${skill.id}`}
            className="skill-tooltip"
            role="tooltip"
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
          >
            <div className="skill-tooltip-name">
              {name}
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.75rem" }}>
              {description}
            </p>
            <ProgressBar value={progress} size="sm" label={`${name} progress`} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)" }}>
              <span>{progress}%</span>
              <span>{xpRequired} XP</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}