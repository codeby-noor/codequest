import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Badge from "../../components/Badge/Badge";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import PageHeader from "../../components/PageHeader/PageHeader";
import { achievements, getAchievementState } from "../../data/achievements";
import { useProgress } from "../../context/ProgressContext";

export default function Achievements() {
  const { progress } = useProgress();
  const states = achievements.map((achievement) => getAchievementState(achievement, progress));
  const unlocked = states.filter((achievement) => achievement.unlocked);
  const inProgress = states.filter((achievement) => !achievement.unlocked && achievement.progress.current > 0);
  const recent = unlocked.slice().sort((a, b) => new Date(progress.achievementMeta?.[b.id]?.unlockedAt || 0) - new Date(progress.achievementMeta?.[a.id]?.unlockedAt || 0)).slice(0, 4);
  const achievementXp = unlocked.reduce((total, achievement) => total + achievement.xp, 0);

  return (
    <div className="container achievements-page">
      <PageHeader
        eyebrow="Milestones"
        title="Achievements"
        description="Track your milestones, trophy unlocks, and XP rewards across the CodeQuest journey."
      />

      <div className="achievement-stats">
        <div>
          <strong>{unlocked.length}</strong>
          <span>Achievements Unlocked</span>
        </div>
        <div>
          <strong>{inProgress.length}</strong>
          <span>Achievements In Progress</span>
        </div>
        <div>
          <strong>{achievementXp} XP</strong>
          <span>Achievement XP</span>
        </div>
      </div>

      {unlocked.length === 0 && (
        <div className="card card-elevated mb-8" style={{ padding: "2rem", textAlign: "center" }}>
          <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "0.5rem" }} aria-hidden="true">🏆</span>
          <h3 style={{ margin: "0 0 0.5rem" }}>Your Trophy Room Awaits</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", margin: "0 0 1.25rem", maxWidth: "480px", marginLeft: "auto", marginRight: "auto" }}>
            Complete quests and solve coding challenges in the Village to earn your first achievement and claim bonus XP!
          </p>
          <Link to="/learn" className="btn btn-primary btn-md">
            Start First Quest →
          </Link>
        </div>
      )}

      {recent.length > 0 && (
        <section className="achievement-section">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Recently Unlocked</span>
              <h2>Fresh milestones</h2>
            </div>
          </div>
          <div className="achievement-grid">
            {recent.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </section>
      )}

      <section className="achievement-section">
        <div className="section-header">
          <div>
            <span className="section-eyebrow">Your Collection</span>
            <h2>All Achievements</h2>
          </div>
        </div>
        <div className="achievement-grid">
          {states.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </section>
    </div>
  );
}

function AchievementCard({ achievement }) {
  const percent = Math.round((achievement.progress.current / achievement.progress.required) * 100);
  return (
    <motion.article
      className={`achievement-card ${achievement.unlocked ? "unlocked" : ""}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="achievement-card-top">
        <div className="achievement-icon" aria-hidden="true">
          {achievement.icon}
        </div>
        <Badge tone={achievement.unlocked ? "success" : achievement.progress.current ? "warning" : "muted"}>
          {achievement.unlocked ? "Unlocked" : achievement.progress.current ? "In Progress" : "Locked"}
        </Badge>
      </div>
      <div className="achievement-card-heading">
        <div>
          <h3>{achievement.title}</h3>
          <span className="achievement-rarity">{achievement.rarity} · {achievement.category}</span>
        </div>
        <span className="achievement-xp">+{achievement.xp} XP</span>
      </div>
      <p>{achievement.description}</p>
      {!achievement.unlocked && (
        <>
          <div className="achievement-progress-label">
            <span>{achievement.progress.current} / {achievement.progress.required}</span>
          </div>
          <ProgressBar value={Math.min(percent, 100)} label={`${achievement.title} progress`} size="sm" />
        </>
      )}
      {achievement.path && (
        <Link className="achievement-link" to={achievement.path}>
          View Progress →
        </Link>
      )}
    </motion.article>
  );
}