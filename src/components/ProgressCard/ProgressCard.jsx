import React from "react";
import { motion } from "framer-motion";
import ProgressBar from "../ProgressBar/ProgressBar";
import { useProgress } from "../../context/ProgressContext";
import { getCurrentLessonForWorld } from "../../data/lessonsIndex";

const WORLD_NAMES = {
  village: "The Village",
  workshop: "The Workshop",
};

/**
 * Player progress dashboard with animated XP bar and stat tiles.
 * Reads live data from ProgressContext.
 */
export default function ProgressCard() {
  const { progress, levelInfo, isWorldUnlocked } = useProgress();

  // Determine the current world based on live progress.
  const currentWorldId = isWorldUnlocked("workshop") ? "workshop" : "village";
  const currentLesson = getCurrentLessonForWorld(currentWorldId, progress);
  const currentWorldName = WORLD_NAMES[currentWorldId] || "The Village";

  const achievementsCount = Array.isArray(progress.achievements) ? progress.achievements.length : 0;
  const challengesCount = Array.isArray(progress.completedChallenges) ? progress.completedChallenges.length : 0;

  const stats = [
    { icon: "🔥", value: `${progress.streak || 0}d`, label: `Streak (Best: ${progress.longestStreak || progress.streak || 0}d)` },
    { icon: "⚡", value: (progress.xp || 0).toLocaleString(), label: "Verified XP" },
    { icon: "🏆", value: achievementsCount, label: "Achievements" },
    { icon: "✅", value: challengesCount, label: "Challenges Solved" },
  ];

  return (
    <motion.div
      className="progress-dashboard"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="progress-dashboard-header">
        <div>
          <span className="progress-level">LEVEL {String(levelInfo.level).padStart(2, "0")}</span>
          <h3 className="progress-title">{levelInfo.title}</h3>
          <p className="progress-subtitle">Current world: The Village</p>
        </div>
        <span className="badge badge-accent">● Active</span>
      </div>

      <div className="progress-xp-row">
        <span className="progress-xp-current">{progress.xp} XP</span>
        <span className="progress-xp-target">/ {levelInfo.needed} XP to next level</span>
      </div>
      <ProgressBar value={levelInfo.percent} size="lg" label="XP progress to next level" />

      <div className="progress-stats">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="progress-stat"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
          >
            <div className="progress-stat-icon" aria-hidden="true">
              {stat.icon}
            </div>
            <div className="progress-stat-value">{stat.value}</div>
            <div className="progress-stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}