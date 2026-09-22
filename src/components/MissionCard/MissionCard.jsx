import React from "react";
import { motion } from "framer-motion";
import Badge from "../Badge/Badge";
import Button from "../Button/Button";
import { useProgress } from "../../context/ProgressContext";

/**
 * Mission briefing card for challenges.
 * Renders like a mission briefing with code, difficulty, XP, and objective.
 * Links to the real Code Arena challenge via /code-arena/:challengeId.
 * Status (completed/available/locked) is computed live from ProgressContext.
 */
export default function MissionCard({ challenge, index = 0 }) {
  const { isChallengeCompleted, isLessonUnlocked } = useProgress();

  const { id, code, title, difficulty, difficultyTone, xp, world, objective } = challenge;

  const completed = isChallengeCompleted(id);
  const unlocked = isLessonUnlocked(challenge.lessonId);
  const locked = !unlocked && !completed;

  return (
    <motion.article
      className={`mission-card ${locked ? "locked" : ""} ${completed ? "completed" : ""}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
      aria-label={`${code}: ${title}`}
    >
      <div className="mission-card-header">
        <span className="mission-code">{code}</span>
        <Badge tone={completed ? "success" : locked ? "muted" : "success"}>
          {completed ? "✓ Completed" : locked ? "🔒 Locked" : "● Available"}
        </Badge>
      </div>

      <h3>{title}</h3>

      <div className="mission-meta">
        <div className="mission-meta-item">
          <span className="mission-meta-label">Difficulty</span>
          <span className="mission-meta-value">
            <Badge tone={difficultyTone}>{difficulty}</Badge>
          </span>
        </div>
        <div className="mission-meta-item">
          <span className="mission-meta-label">XP</span>
          <span className="mission-meta-value">+{xp}</span>
        </div>
        <div className="mission-meta-item">
          <span className="mission-meta-label">World</span>
          <span className="mission-meta-value">{world}</span>
        </div>
      </div>

      <div className="mission-objective">
        <span style={{ color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>
          OBJECTIVE
        </span>
        {objective}
      </div>

      <Button
        to={locked ? undefined : `/code-arena/${id}`}
        variant={locked ? "secondary" : "primary"}
        disabled={locked}
        block
      >
        {completed ? "Replay Challenge →" : locked ? "Locked" : "Enter Challenge →"}
      </Button>
    </motion.article>
  );
}