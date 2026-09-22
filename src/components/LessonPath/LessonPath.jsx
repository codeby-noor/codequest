import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getLessonsForWorld } from "../../data/lessonsIndex";
import { useProgress } from "../../context/ProgressContext";

/**
 * Vertical lesson progression for a world.
 * Shows completed, current, locked, and boss lessons.
 * Fully data-driven — reads lessons from the unified registry.
 */
export default function LessonPath({ worldId = "village" }) {
  const { isLessonUnlocked, isLessonCompleted } = useProgress();
  const lessons = getLessonsForWorld(worldId);

  // Find the first unlocked but not completed lesson (the "current" one)
  const currentLessonId = lessons.find(
    (l) => isLessonUnlocked(l.id) && !isLessonCompleted(l.id)
  )?.id;

  return (
    <div className="lesson-path" role="list" aria-label="Lesson progression">
      {lessons.map((lesson, index) => {
        const unlocked = isLessonUnlocked(lesson.id);
        const completed = isLessonCompleted(lesson.id);
        const isCurrent = lesson.id === currentLessonId;
        const isBoss = lesson.type === "boss";

        const statusClass = completed
          ? "completed"
          : isCurrent
          ? "current"
          : unlocked
          ? "unlocked"
          : "locked";

        return (
          <React.Fragment key={lesson.id}>
            {index > 0 && (
              <div
                className={`lesson-connector ${completed ? "completed" : ""}`}
                aria-hidden="true"
              />
            )}
            <motion.div
              role="listitem"
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
            >
              {unlocked ? (
                <Link
                  to={`/learn/${worldId}/${lesson.id}`}
                  className={`lesson-item ${statusClass}`}
                  aria-label={`${completed ? "Completed" : isCurrent ? "Current" : "Unlocked"}: ${lesson.title}`}
                >
                  <span className="lesson-item-icon" aria-hidden="true">
                    {completed ? "✓" : isBoss ? "👑" : isCurrent ? "→" : String(lesson.number).padStart(2, "0")}
                  </span>
                  <span className="lesson-item-info">
                    <span className="lesson-item-title">{lesson.title}</span>
                    <span className="lesson-item-desc">{lesson.description}</span>
                  </span>
                  <span className="lesson-item-xp">⚡ {lesson.xp} XP</span>
                </Link>
              ) : (
                <div className={`lesson-item ${statusClass}`} aria-label={`Locked: ${lesson.title}`}>
                  <span className="lesson-item-icon" aria-hidden="true">
                    🔒
                  </span>
                  <span className="lesson-item-info">
                    <span className="lesson-item-title">{lesson.title}</span>
                    <span className="lesson-item-desc">{lesson.description}</span>
                  </span>
                  <span className="lesson-item-xp">⚡ {lesson.xp} XP</span>
                </div>
              )}
            </motion.div>
          </React.Fragment>
        );
      })}
    </div>
  );
}