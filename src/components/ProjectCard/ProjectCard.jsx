import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Badge from "../Badge/Badge";
import { useProgress } from "../../context/ProgressContext";
import { getProjectProgress, getProjectStatus } from "../../engine/projectEngine";

/**
 * Project card for the "Build Real Things" section.
 * Shows difficulty, technologies, XP reward, estimated time, and lock state.
 * Lock state is computed live from world completion — no fake progress.
 */
export default function ProjectCard({ project, index = 0 }) {
  const { progress } = useProgress();
  const { number, title, description, difficulty, difficultyTone, skills, xp, estimatedTime, requiredWorldName } = project;

  // The first project unlocks when The Workshop is complete.
  const status = getProjectStatus(project, progress);
  const isUnlocked = status !== "locked";
  const completed = status === "completed";
  const projectPercent = getProjectProgress(project, progress);

  return (
    <motion.article
      className={`project-card ${isUnlocked ? "" : "locked"}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
      aria-label={`${number}: ${title}${completed ? ", completed" : isUnlocked ? ", available" : ", locked"}`}
    >
      <div className="project-card-top">
        <span className="project-number">{number}</span>
        <Badge tone={completed ? "success" : isUnlocked ? "accent" : "muted"}>
          {completed ? "Completed ✓" : status === "in-progress" ? "Continue Project" : isUnlocked ? "Available" : "🔒 Locked"}
        </Badge>
      </div>

      <h3>{title}</h3>
      <p className="world-card-desc">{description}</p>

      <div className="project-tech">
        {skills.map((skill) => (
          <Badge key={skill} tone="accent">
            {skill}
          </Badge>
        ))}
      </div>

      <div className="project-meta">
        <div className="project-meta-item">
          <span className="project-meta-label">Difficulty</span>
          <span className="project-meta-value">
            <Badge tone={difficultyTone}>{difficulty}</Badge>
          </span>
        </div>
        <div className="project-meta-item">
          <span className="project-meta-label">XP Reward</span>
          <span className="project-meta-value">⚡ {xp} XP</span>
        </div>
        <div className="project-meta-item">
          <span className="project-meta-label">Estimated Time</span>
          <span className="project-meta-value">{estimatedTime}</span>
        </div>
        <div className="project-meta-item">
          <span className="project-meta-label">Requires</span>
          <span className="project-meta-value">{requiredWorldName}</span>
        </div>
      </div>
      {!isUnlocked && <p className="project-lock-copy">Complete {requiredWorldName} to unlock</p>}
      {isUnlocked && (
        <Link className="btn btn-secondary btn-sm btn-block" to={`/projects/${project.id}`}>
          {completed ? "Review Project →" : projectPercent ? "Continue Project →" : "Start Project →"}
        </Link>
      )}
    </motion.article>
  );
}