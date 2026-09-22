import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageHeader from "../../components/PageHeader/PageHeader";
import LessonPath from "../../components/LessonPath/LessonPath";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import Button from "../../components/Button/Button";
import Badge from "../../components/Badge/Badge";
import { getLessonsForWorld, getWorldProgress, getCurrentLessonForWorld } from "../../data/lessonsIndex";
import { getWorldById, getNextWorld, getWorldPrerequisite } from "../../data/worlds";
import { useProgress } from "../../context/ProgressContext";

export default function Learn() {
  const { worldId = "village" } = useParams();
  const { progress, isLessonCompleted, isWorldUnlocked } = useProgress();

  const world = getWorldById(worldId) || {
    id: worldId,
    number: "01",
    title: "JavaScript Village",
    description: "Programming Fundamentals — your journey begins here.",
    icon: "🏘️",
  };

  const lessons = getLessonsForWorld(world.id);
  const worldUnlocked = isWorldUnlocked(world.id);
  const prereq = getWorldPrerequisite(world.id);
  const nextWorld = getNextWorld(world.id);

  const completedCount = lessons.filter((l) => isLessonCompleted(l.id)).length;
  const totalLessons = lessons.length;
  const percent = getWorldProgress(world.id, progress);
  const currentLesson = getCurrentLessonForWorld(world.id, progress);

  if (!worldUnlocked) {
    return (
      <div className="container">
        <div className="placeholder-page">
          <div>
            <span className="placeholder-icon" aria-hidden="true">🔒</span>
            <h1>{world.title} is Locked</h1>
            <p>
              {prereq
                ? `Complete ${prereq.title} to unlock this world.`
                : "This world is not unlocked yet."}
            </p>
            <Button to="/worlds" variant="primary">Back to World Map →</Button>
          </div>
        </div>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="container">
        <div className="placeholder-page">
          <div>
            <span className="placeholder-icon" aria-hidden="true">⚔️</span>
            <h1>{world.title}</h1>
            <p>
              This world is unlocked! Missions for {world.title} are currently being forged.
            </p>
            <Button to="/worlds" variant="primary">Back to World Map →</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <PageHeader
        eyebrow={`World ${world.number}`}
        title={world.title}
        description={world.subtitle ? `${world.subtitle} — ${world.description}` : world.description}
      />

      {/* World progress card */}
      <motion.div
        className="card card-elevated mb-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="world-progress-header">
          <div>
            <span className="section-eyebrow" style={{ marginBottom: "0.25rem" }}>
              World {world.number} — {world.title}
            </span>
            <h2 style={{ fontSize: "1.5rem" }}>{world.icon} {world.description}</h2>
          </div>
          <div className="world-progress-stats">
            <Badge tone="accent">{completedCount} / {totalLessons} lessons</Badge>
            <Badge tone="warning">⚡ {progress.xp} XP</Badge>
          </div>
        </div>
        <div className="world-progress-bar">
          <div className="progress-xp-row">
            <span className="progress-xp-current">{percent}% complete</span>
            <span className="progress-xp-target">
              {completedCount === totalLessons ? "World complete!" : `${totalLessons - completedCount} remaining`}
            </span>
          </div>
          <ProgressBar value={percent} size="lg" label={`${world.title} progress`} />
        </div>
      </motion.div>

      {/* Current lesson CTA */}
      {currentLesson && (
        <motion.div
          className="card card-elevated mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}
        >
          <div>
            <span className="section-eyebrow" style={{ marginBottom: "0.25rem" }}>
              Next Up
            </span>
            <h3 style={{ fontSize: "1.25rem" }}>
              {currentLesson.type === "boss" ? "👑 " : ""}
              {currentLesson.title}
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
              {currentLesson.description}
            </p>
          </div>
          <Button to={`/learn/${world.id}/${currentLesson.id}`} variant="primary">
            {currentLesson.type === "boss" ? "Face the Boss →" : "Start Lesson →"}
          </Button>
        </motion.div>
      )}

      {/* Lesson path */}
      <div className="section" style={{ paddingTop: "1rem" }}>
        <div className="section-header">
          <div>
            <span className="section-eyebrow">The Path</span>
            <h2>Lessons</h2>
            <p>Complete each lesson to unlock the next. The boss awaits at the end.</p>
          </div>
          {nextWorld && (
            <Link to={`/learn/${nextWorld.id}`} style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>
              Next: {nextWorld.title} →
            </Link>
          )}
        </div>
        <LessonPath worldId={world.id} />
      </div>
    </div>
  );
}