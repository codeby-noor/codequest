import React from "react";
import { motion } from "framer-motion";
import Badge from "../Badge/Badge";
import ProgressBar from "../ProgressBar/ProgressBar";
import Button from "../Button/Button";
import { getLessonsForWorld, getWorldProgress, isWorldComplete } from "../../data/lessonsIndex";
import { getWorldPrerequisite } from "../../data/worlds";
import { useProgress } from "../../context/ProgressContext";

/**
 * World card for the learning journey map.
 * Shows world number, icon, title, subtitle, description, difficulty, skills taught,
 * live completion percentage, XP reward, and dynamic prerequisite lock states.
 */
export default function WorldCard({ world, index }) {
  const { progress, isWorldUnlocked } = useProgress();

  const lessons = getLessonsForWorld(world.id);
  const liveProgress = getWorldProgress(world.id, progress);
  const worldComplete = isWorldComplete(world.id, progress);
  const unlocked = isWorldUnlocked(world.id);
  const prereq = getWorldPrerequisite(world.id);

  const lessonCount = lessons.length;
  const bossCount = lessons.filter((l) => l.type === "boss").length;
  const totalXp = lessons.reduce((sum, lesson) => sum + (lesson.xp || 0), 0);
  const { number, title, subtitle, description, icon, difficulty, difficultyTone, xpReward, missions, skills = [] } = world;

  return (
    <motion.article
      className={`world-card ${unlocked ? (worldComplete ? "completed" : "unlocked") : "locked"}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: [0.4, 0, 0.2, 1] }}
      aria-label={`${title} — ${subtitle}${unlocked ? (worldComplete ? ", completed" : ", in progress") : ", locked"}`}
    >
      <div className="world-card-top">
        <div className="world-card-icon" aria-hidden="true">
          {icon}
        </div>
        <div className="world-card-number-wrap">
          <span className="world-card-number">WORLD {number}</span>
        </div>
      </div>

      <div className="world-card-header">
        <h3>{title}</h3>
        {subtitle && <span className="world-card-subtitle">{subtitle}</span>}
      </div>

      <p className="world-card-desc">{description}</p>

      {/* Skills taught in this world */}
      {skills.length > 0 && (
        <div className="world-skills-preview">
          <span className="world-skills-label">Skills Taught:</span>
          <div className="world-skills-tags">
            {skills.slice(0, 4).map((skillName, i) => (
              <span key={i} className="world-skill-tag">
                {skillName}
              </span>
            ))}
            {skills.length > 4 && (
              <span className="world-skill-tag more">+{skills.length - 4} more</span>
            )}
          </div>
        </div>
      )}

      <div className="world-card-meta">
        <Badge tone={difficultyTone}>{difficulty}</Badge>
        {lessonCount > 0 ? (
          <Badge tone="muted">{lessonCount} lessons {bossCount > 0 ? `· ${bossCount} boss` : ""}</Badge>
        ) : (
          <Badge tone="muted">{missions || 12} missions planned</Badge>
        )}
        {worldComplete && <Badge tone="success">✓ Completed</Badge>}
        {!worldComplete && unlocked && lessonCount > 0 && <Badge tone="accent">● In Progress</Badge>}
        {!worldComplete && unlocked && lessonCount === 0 && (
          <Badge tone="purple">⚔️ Unlocked · Coming Soon</Badge>
        )}
        {!unlocked && prereq && (
          <Badge tone="warning">🔒 Complete {prereq.title}</Badge>
        )}
      </div>

      {unlocked ? (
        <>
          <div className="world-progress-section mt-4">
            <div className="world-progress-row">
              <span className="world-progress-text">
                {worldComplete
                  ? "100% Complete"
                  : lessonCount > 0
                  ? `${liveProgress}% Complete (${lessons.filter((l) => (progress.completedLessons || []).includes(l.id)).length}/${lessonCount})`
                  : "Missions in Preparation"}
              </span>
              <span className="world-card-xp">⚡ {totalXp || xpReward} XP</span>
            </div>
            <ProgressBar value={liveProgress} label={`${title} progress`} />
          </div>

          <div className="world-card-footer mt-4">
            <Button
              to={lessonCount > 0 ? `/learn/${world.id}` : undefined}
              variant={worldComplete ? "ghost" : "primary"}
              size="sm"
              disabled={lessonCount === 0}
            >
              {worldComplete
                ? `Revisit ${title} →`
                : lessonCount > 0
                ? `Enter World →`
                : "Missions Coming Soon"}
            </Button>
          </div>
        </>
      ) : (
        <div className="world-card-locked-footer mt-4">
          <p className="world-lock-instruction">
            🔒 Complete <strong>{prereq ? prereq.title : "previous world"}</strong> to unlock this world.
          </p>
          <div className="world-card-footer">
            <span className="world-card-xp">⚡ {totalXp || xpReward} XP</span>
            <span className="world-card-status locked">Locked</span>
          </div>
        </div>
      )}
    </motion.article>
  );
}