import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "../../components/PageHeader/PageHeader";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import Button from "../../components/Button/Button";
import Badge from "../../components/Badge/Badge";
import SyncStatusBadge from "../../components/SyncStatusBadge/SyncStatusBadge";
import { useProgress } from "../../context/ProgressContext";
import { useAuth } from "../../context/AuthContext";
import { worlds } from "../../data/worlds";
import { isWorldComplete, isWorldUnlocked } from "../../engine/progressEngine";
import { getAllSkillsWithProgress } from "../../data/skills";
import { achievements, getAchievementState } from "../../data/achievements";

/**
 * Player Profile Page — RPG-style coder profile.
 * Clearly separates:
 * 1. Player Progress (XP, Level, Streak, Skills, Worlds, Achievements)
 * 2. Account Experience & Security (Anonymous vs Authenticated, Cloud Sync Status, Auth actions)
 */
export default function Profile() {
  const { progress, levelInfo } = useProgress();
  const { user, isAuthenticated, openLoginModal, openRegisterModal, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const skillsWithProgress = getAllSkillsWithProgress(progress);
  const masteredSkills = skillsWithProgress.filter((s) => s.progress >= 100);

  const activeWorld =
    worlds.find((w) => isWorldUnlocked(w.id, progress) && !isWorldComplete(w.id, progress)) ||
    worlds[0];
  const completedWorldsCount = worlds.filter((w) => isWorldComplete(w.id, progress)).length;

  const playerAchievements = achievements.map((a) => getAchievementState(a, progress));
  const earnedAchievements = playerAchievements.filter((a) => a.unlocked);

  function handleLogoutConfirm() {
    logout();
    setShowLogoutConfirm(false);
  }

  return (
    <div className="container profile-page">
      <PageHeader
        eyebrow="Adventurer Ledger"
        title="Player Profile"
        description="Your stats, mastered disciplines, active frontiers, and account security across CodeQuest."
      />

      {/* Account Security & Synchronization Card */}
      <section
        aria-label="Account & Synchronization"
        className="card card-elevated mb-8 profile-account-card"
        style={{
          background: isAuthenticated
            ? "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(19, 27, 46, 0.95) 100%)"
            : "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(19, 27, 46, 0.95) 100%)",
          border: isAuthenticated
            ? "1px solid rgba(16, 185, 129, 0.3)"
            : "1px solid rgba(99, 102, 241, 0.3)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.25rem",
          padding: "clamp(1rem, 3vw, 1.5rem)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: "1 1 240px", minWidth: 0 }}>
          <div style={{ fontSize: "2.25rem", flexShrink: 0 }} aria-hidden="true">
            {isAuthenticated ? "🛡️" : "⚔️"}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              <h3 style={{ fontSize: "1.2rem", margin: 0, wordBreak: "break-word" }}>
                {isAuthenticated ? "Authenticated Adventurer" : "Anonymous Explorer"}
              </h3>
              <Badge tone={isAuthenticated ? "success" : "accent"}>
                {isAuthenticated ? "Cloud Linked" : "Local Play"}
              </Badge>
              <SyncStatusBadge />
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", margin: "0.35rem 0 0", lineHeight: 1.5, wordBreak: "break-word" }}>
              {isAuthenticated
                ? `Signed in as ${user.email || user.username}. Your progress is safely backed up to your cloud account.`
                : "Your progress is currently saved on this device. Create an account to keep your progress synced across devices."}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          {isAuthenticated ? (
            <>
              {showLogoutConfirm ? (
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Sign out?</span>
                  <Button variant="danger" size="sm" onClick={handleLogoutConfirm}>
                    Yes, Sign Out
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowLogoutConfirm(false)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setShowLogoutConfirm(true)}>
                  Sign Out
                </Button>
              )}
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={openLoginModal}>
                Sign In
              </Button>
              <Button variant="primary" size="sm" onClick={openRegisterModal}>
                Save Progress to Account →
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Hero Character Card */}
      <motion.section
        aria-label="Character Overview"
        className="card card-elevated mb-8 player-hero-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="player-hero-grid">
          <div className="player-avatar-wrap">
            <div className="player-avatar" aria-hidden="true">🧙‍♂️</div>
            <div className="player-level-badge">LVL {levelInfo.level}</div>
          </div>

          <div className="player-info-main">
            <div className="player-title-row">
              <h2>{isAuthenticated ? user.username : levelInfo.title}</h2>
              <span className="player-streak-badge">
                🔥 {progress.streak || 0} Day Streak
              </span>
            </div>

            <p className="player-world-status">
              Current Location: <strong>{activeWorld.icon} {activeWorld.title}</strong>
              {completedWorldsCount > 0 ? (
                ` (${completedWorldsCount} world${completedWorldsCount > 1 ? "s" : ""} conquered)`
              ) : (
                <span style={{ color: "var(--text-secondary)", marginLeft: "0.35rem" }}>— Your first world awaits!</span>
              )}
            </p>

            <div className="player-xp-progress mt-4">
              <div className="progress-xp-row">
                <span className="progress-xp-current">
                  ⚡ {levelInfo.currentXp} / {levelInfo.neededXp} XP to Level {levelInfo.level + 1}
                </span>
                <span className="progress-xp-target">
                  {progress.xp} Total XP
                </span>
              </div>
              <ProgressBar value={levelInfo.progress} size="lg" label="Level progression" />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Core Stats Overview */}
      <section aria-label="Player Statistics" className="player-stats-grid mb-8">
        <div className="card stat-box">
          <span className="stat-box-icon" aria-hidden="true">⚡</span>
          <div className="stat-box-content">
            <strong>{progress.xp}</strong>
            <span>Total XP Earned</span>
          </div>
        </div>

        <div className="card stat-box">
          <span className="stat-box-icon" aria-hidden="true">📜</span>
          <div className="stat-box-content">
            <strong>{(progress.completedLessons || []).length}</strong>
            <span>Lessons Completed</span>
          </div>
        </div>

        <div className="card stat-box">
          <span className="stat-box-icon" aria-hidden="true">⚔️</span>
          <div className="stat-box-content">
            <strong>{(progress.completedChallenges || []).length}</strong>
            <span>Challenges Solved</span>
          </div>
        </div>

        <div className="card stat-box">
          <span className="stat-box-icon" aria-hidden="true">🧠</span>
          <div className="stat-box-content">
            <strong>{masteredSkills.length}</strong>
            <span>Skills Mastered</span>
          </div>
        </div>

        <div className="card stat-box">
          <span className="stat-box-icon" aria-hidden="true">🏆</span>
          <div className="stat-box-content">
            <strong>{earnedAchievements.length} / {achievements.length}</strong>
            <span>Achievements Unlocked</span>
          </div>
        </div>

        <div className="card stat-box">
          <span className="stat-box-icon" aria-hidden="true">🗺️</span>
          <div className="stat-box-content">
            <strong>{completedWorldsCount} / {worlds.length}</strong>
            <span>Worlds Conquered</span>
          </div>
        </div>
      </section>

      <div className="grid-2" style={{ alignItems: "start", gap: "var(--space-8)" }}>
        {/* Skills Breakdown */}
        <section aria-label="Skills and Disciplines">
          <div className="section-header" style={{ marginBottom: "1.5rem" }}>
            <div>
              <span className="section-eyebrow">Mastery</span>
              <h2 style={{ fontSize: "1.5rem" }}>Skills & Disciplines</h2>
            </div>
            <Button to="/skill-tree" variant="ghost" size="sm">
              View Skill Tree →
            </Button>
          </div>

          <div className="card card-elevated" style={{ display: "grid", gap: "var(--space-4)" }}>
            {skillsWithProgress.slice(0, 8).map((skill) => (
              <div key={skill.id} className="profile-skill-item">
                <div className="profile-skill-header">
                  <div className="profile-skill-title">
                    <span className="profile-skill-icon" aria-hidden="true">{skill.icon}</span>
                    <div>
                      <strong>{skill.name}</strong>
                      <span className="profile-skill-category">{skill.category}</span>
                    </div>
                  </div>
                  <Badge tone={skill.progress >= 100 ? "success" : skill.progress > 0 ? "accent" : "muted"}>
                    {skill.progress >= 100 ? "✓ Mastered" : `${skill.progress}%`}
                  </Badge>
                </div>
                <ProgressBar value={skill.progress} size="sm" label={`${skill.name} progress`} />
              </div>
            ))}
          </div>
        </section>

        {/* Earned Trophies & Next Quest */}
        <section aria-label="Achievements and Quests">
          <div className="section-header" style={{ marginBottom: "1.5rem" }}>
            <div>
              <span className="section-eyebrow">Trophies</span>
              <h2 style={{ fontSize: "1.5rem" }}>Achievements</h2>
            </div>
            <Button to="/achievements" variant="ghost" size="sm">
              All Achievements →
            </Button>
          </div>

          {earnedAchievements.length === 0 ? (
            <div className="card card-elevated p-6 text-center" style={{ padding: "1.5rem", textAlign: "center" }}>
              <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.5rem" }} aria-hidden="true">🏆</span>
              <h4 style={{ margin: "0 0 0.25rem" }}>No achievements yet</h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: 0 }}>
                Complete quests and challenges to earn your first achievement.
              </p>
            </div>
          ) : (
            <div className="profile-achievements-grid">
              {playerAchievements.slice(0, 6).map((achievement) => (
                <div
                  key={achievement.id}
                  className={`card achievement-mini-card ${achievement.unlocked ? "unlocked" : "locked"}`}
                >
                  <div className="achievement-mini-top">
                    <span className="achievement-mini-icon" aria-hidden="true">{achievement.icon}</span>
                    <Badge tone={achievement.unlocked ? "success" : "muted"}>
                      {achievement.unlocked ? "✓ Unlocked" : "Locked"}
                    </Badge>
                  </div>
                  <h4>{achievement.title}</h4>
                  <p>{achievement.description}</p>
                  <div className="achievement-mini-footer">
                    <span className="achievement-mini-xp">⚡ +{achievement.xp} XP</span>
                    <span className="achievement-mini-rarity">{achievement.rarity}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Active Quest CTA Card */}
          <div className="card card-elevated mt-6 active-quest-banner">
            <span className="section-eyebrow">Active Mission</span>
            <h3>Resume in {activeWorld.title}</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6, margin: "0.5rem 0 1rem" }}>
              Continue your quest to earn XP, level up your coding skills, and conquer the realm.
            </p>
            <Button to={`/learn/${activeWorld.id}`} variant="primary">
              Continue Journey →
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}