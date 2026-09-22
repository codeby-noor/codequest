import React from "react";
import { motion } from "framer-motion";
import Button from "../../components/Button/Button";
import Badge from "../../components/Badge/Badge";
import PageHeader from "../../components/PageHeader/PageHeader";
import { getArenaChallengesByWorld } from "../../data/arenaChallenges";
import { useProgress } from "../../context/ProgressContext";

import { worlds } from "../../data/worlds";

/**
 * Code Arena selection/landing page.
 * Shown at /code-arena when no specific challenge is selected.
 * Lists all challenges grouped by world with live progress status.
 */
export default function ArenaSelection() {
  const { isChallengeCompleted, isLessonUnlocked, isWorldUnlocked } = useProgress();
  const worldChallenges = getArenaChallengesByWorld();

  const sections = worlds
    .map((world) => ({
      id: world.id,
      title: world.title,
      subtitle: world.subtitle || world.description,
      icon: world.icon,
      prereq: world.requiredWorld ? worlds.find((w) => w.id === world.requiredWorld)?.title : null,
      challenges: worldChallenges[world.id] || [],
    }))
    .filter((sec) => sec.challenges.length > 0);

  return (
    <div className="container">
      <PageHeader
        eyebrow="The Arena"
        title="Code Arena"
        description="Practice coding missions, debug problems, and earn XP. Select a mission to enter the arena."
      />

      {sections.map((section) => {
        const worldUnlocked = isWorldUnlocked(section.id);
        const completedCount = section.challenges.filter((c) => isChallengeCompleted(c.id)).length;

        return (
          <div key={section.id} className="mb-12">
            <div className="section-header" style={{ marginBottom: "1.5rem" }}>
              <div>
                <span className="section-eyebrow" style={{ marginBottom: "0.25rem" }}>
                  {section.icon} {section.title}
                </span>
                <h2 style={{ fontSize: "1.5rem" }}>{section.subtitle}</h2>
                <p style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>
                  {completedCount} / {section.challenges.length} completed
                </p>
              </div>
              {!worldUnlocked && (
                <Badge tone="warning">🔒 {section.prereq ? `Complete ${section.prereq} to unlock` : "Locked"}</Badge>
              )}
            </div>

            <div className="grid-2">
              {section.challenges.map((challenge, index) => {
                const completed = isChallengeCompleted(challenge.id);
                const unlocked = isLessonUnlocked(challenge.lessonId);
                const locked = !unlocked && !completed;

                return (
                  <motion.article
                    key={challenge.id}
                    className={`mission-card ${locked ? "locked" : ""} ${completed ? "completed" : ""}`}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
                    aria-label={`${challenge.title}${completed ? ", completed" : locked ? ", locked" : ", available"}`}
                  >
                    <div className="mission-card-header">
                      <span className="mission-code">
                        {challenge.difficulty === "Boss" ? "BOSS" : `MISSION ${String(index + 1).padStart(3, "0")}`}
                      </span>
                      <Badge tone={completed ? "success" : locked ? "muted" : "success"}>
                        {completed ? "✓ Completed" : locked ? "🔒 Locked" : "● Available"}
                      </Badge>
                    </div>

                    <h3>{challenge.title}</h3>

                    <div className="mission-meta">
                      <div className="mission-meta-item">
                        <span className="mission-meta-label">Difficulty</span>
                        <span className="mission-meta-value">
                          <Badge tone={challenge.difficulty === "Boss" ? "danger" : "success"}>
                            {challenge.difficulty}
                          </Badge>
                        </span>
                      </div>
                      <div className="mission-meta-item">
                        <span className="mission-meta-label">XP</span>
                        <span className="mission-meta-value">+{challenge.xp}</span>
                      </div>
                      <div className="mission-meta-item">
                        <span className="mission-meta-label">World</span>
                        <span className="mission-meta-value">{challenge.worldName}</span>
                      </div>
                    </div>

                    <div className="mission-objective">
                      <span style={{ color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>
                        OBJECTIVE
                      </span>
                      {challenge.objective}
                    </div>

                    <Button
                      to={locked ? undefined : `/code-arena/${challenge.id}`}
                      variant={locked ? "secondary" : "primary"}
                      disabled={locked}
                      block
                    >
                      {completed ? "Replay Challenge →" : locked ? "Locked" : "Enter Arena →"}
                    </Button>
                  </motion.article>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}