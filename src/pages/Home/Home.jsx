import React, { useMemo, useEffect, useState } from "react";
import Hero from "../../components/Hero/Hero";
import WorldCard from "../../components/WorldCard/WorldCard";
import SkillTree from "../../components/SkillTree/SkillTree";
import ProgressCard from "../../components/ProgressCard/ProgressCard";
import MissionCard from "../../components/MissionCard/MissionCard";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import CodeArenaPreview from "../../components/CodeArenaPreview/CodeArenaPreview";
import Button from "../../components/Button/Button";
import Badge from "../../components/Badge/Badge";
import { worlds } from "../../data/worlds";
import { challenges, todayChallenge } from "../../data/challenges";
import { projects } from "../../data/projects";
import { achievements } from "../../data/achievements";
import { useProgress } from "../../context/ProgressContext";
import { getLeaderboard } from "../../services/apiClient";
import { demoLeaderboardUsers } from "../../data/leaderboard";

export default function Home() {
  const { progress, levelInfo, isChallengeCompleted, isLessonUnlocked } = useProgress();
  const [topLearners, setTopLearners] = useState(demoLeaderboardUsers.slice(0, 3));
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  // Compute recommended next challenge live
  const nextChallenge = useMemo(() => {
    return (
      challenges.find((c) => !isChallengeCompleted(c.id) && isLessonUnlocked(c.lessonId)) ||
      todayChallenge
    );
  }, [isChallengeCompleted, isLessonUnlocked]);

  // Load preview leaderboard from server when available
  useEffect(() => {
    let isMounted = true;
    setLoadingLeaderboard(true);
    getLeaderboard({ limit: 3 })
      .then((res) => {
        if (!isMounted) return;
        if (res.success && Array.isArray(res.users) && res.users.length > 0) {
          setTopLearners(res.users);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoadingLeaderboard(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const unlockedAchievementsCount = Array.isArray(progress.achievements)
    ? progress.achievements.length
    : 0;

  const currentStreak = progress.streak || 0;
  const longestStreak = progress.longestStreak || currentStreak;

  return (
    <>
      <Hero />

      {/* Player Progress Dashboard */}
      <section className="section" aria-label="Player progress">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Your Journey</span>
              <h2>Player Dashboard</h2>
            </div>
            <Button to="/profile" variant="ghost">
              View Full Profile →
            </Button>
          </div>
          <ProgressCard />
        </div>
      </section>

      {/* Recommended Challenge / Daily Briefing */}
      <section className="section" aria-label="Today's challenge">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Recommended Next Challenge</span>
              <h2>Continue Your Quest</h2>
              <p>Keep your momentum going. Solve verified challenges to earn XP and level up.</p>
            </div>
            <Button to="/challenges" variant="ghost">
              Explore All Challenges →
            </Button>
          </div>
          <div className="grid-2">
            <MissionCard challenge={nextChallenge} />
            <div
              className="card card-elevated"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "1.25rem",
                padding: "2rem",
                background: "var(--cq-surface-card)",
                borderRadius: "var(--cq-radius-xl)",
                border: "1px solid var(--cq-border)",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--cq-text-muted)",
                    fontFamily: "var(--font-mono)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Learning Momentum
                </span>
                <h3 style={{ fontSize: "1.5rem", marginTop: "0.25rem" }}>
                  {currentStreak > 0 ? `${currentStreak}-Day Streak Active!` : "Start Your Daily Streak!"}
                </h3>
              </div>
              <p style={{ color: "var(--cq-text-secondary)", lineHeight: 1.7, margin: 0 }}>
                {currentStreak > 0
                  ? `You are on a ${currentStreak}-day learning streak. Complete today's mission to protect your streak (Best: ${longestStreak} days) and advance toward Level ${levelInfo.level + 1}.`
                  : `Complete your next coding mission today to initiate your daily streak and earn verified XP toward Level ${levelInfo.level + 1}.`}
              </p>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                <Badge tone="warning">🔥 {currentStreak} day streak</Badge>
                <Badge tone="accent">⚡ +{nextChallenge.xp} XP Available</Badge>
                <Badge tone="muted">Level {String(levelInfo.level).padStart(2, "0")}</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Worlds */}
      <section className="section" aria-label="Learning worlds">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Structured Curriculum</span>
              <h2>Learning Worlds</h2>
              <p>Six epic worlds. One journey. From fundamental syntax to full-stack engineering.</p>
            </div>
            <Button to="/worlds" variant="ghost">
              Explore All Worlds →
            </Button>
          </div>
          <div className="grid-3">
            {worlds.slice(0, 3).map((world, index) => (
              <WorldCard key={world.id} world={world} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Achievement Showcase Preview */}
      <section className="section" aria-label="Achievement collection">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Milestones</span>
              <h2>Achievement Collection</h2>
              <p>
                {unlockedAchievementsCount} of {achievements.length} achievements unlocked across your adventure.
              </p>
            </div>
            <Button to="/achievements" variant="ghost">
              View All Achievements →
            </Button>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {achievements.slice(0, 4).map((ach) => {
              const unlocked = (progress.achievements || []).includes(ach.id);
              return (
                <div
                  key={ach.id}
                  className="card card-elevated"
                  style={{
                    padding: "1.25rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    opacity: unlocked ? 1 : 0.6,
                    border: unlocked ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid var(--cq-border)",
                    background: unlocked
                      ? "linear-gradient(135deg, rgba(16, 185, 129, 0.05), var(--cq-surface-card))"
                      : "var(--cq-surface-card)",
                    borderRadius: "var(--cq-radius-lg)",
                  }}
                >
                  <span style={{ fontSize: "2rem" }} aria-hidden="true">
                    {ach.icon}
                  </span>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <strong style={{ fontSize: "0.95rem", color: "var(--cq-text)" }}>{ach.title}</strong>
                      {unlocked ? <Badge tone="success">Unlocked</Badge> : <Badge tone="muted">Locked</Badge>}
                    </div>
                    <span style={{ fontSize: "0.8rem", color: "var(--cq-text-muted)", display: "block", marginTop: "2px" }}>
                      +{ach.xp} XP · {ach.rarity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="section" aria-label="Leaderboard preview">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Competition</span>
              <h2>Leaderboard Standings</h2>
              <p>See where you stand alongside fellow learners on the verified XP leaderboard.</p>
            </div>
            <Button to="/leaderboard" variant="ghost">
              Full Standings →
            </Button>
          </div>
          <div
            className="card card-elevated"
            style={{
              padding: "1.5rem",
              background: "var(--cq-surface-card)",
              borderRadius: "var(--cq-radius-xl)",
              border: "1px solid var(--cq-border)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <span style={{ fontWeight: 600, fontSize: "1.1rem" }}>Top Learners</span>
              <span style={{ fontSize: "0.85rem", color: "var(--cq-text-muted)" }}>Ranked by verified XP</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {topLearners.map((u, i) => (
                <div
                  key={u.id || i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem 1rem",
                    borderRadius: "var(--cq-radius-md)",
                    background: i === 0 ? "rgba(234, 179, 8, 0.08)" : "rgba(255, 255, 255, 0.03)",
                    border: i === 0 ? "1px solid rgba(234, 179, 8, 0.25)" : "1px solid transparent",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                        fontSize: "1rem",
                        color: i === 0 ? "#eab308" : "var(--cq-text-muted)",
                        minWidth: "24px",
                      }}
                    >
                      #{i + 1}
                    </span>
                    <span style={{ fontSize: "1.25rem" }} aria-hidden="true">{u.avatar || "⚔️"}</span>
                    <div>
                      <strong style={{ color: "var(--cq-text)", fontSize: "0.95rem" }}>{u.username || u.name}</strong>
                      <span style={{ fontSize: "0.8rem", color: "var(--cq-text-muted)", display: "block" }}>
                        Level {String(u.level || 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <strong style={{ color: "var(--cq-accent)", fontSize: "1rem", fontFamily: "var(--font-mono)" }}>
                      {(u.xp || 0).toLocaleString()} XP
                    </strong>
                    <span style={{ display: "block", fontSize: "0.8rem", color: "var(--cq-text-muted)" }}>
                      🔥 {u.streak || 0}d
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skill Tree */}
      <section className="section" aria-label="Skill tree">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Mastery</span>
              <h2>Skill Tree</h2>
              <p>Every mission sharpens a skill. Every skill unlocks the next level of your journey.</p>
            </div>
            <Button to="/skill-tree" variant="ghost">
              View Full Skill Tree →
            </Button>
          </div>
          <SkillTree limit={5} />
        </div>
      </section>

      {/* Code Arena Preview */}
      <section className="section" aria-label="Code arena preview">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">The Arena</span>
              <h2>Your Coding Environment</h2>
              <p>Write code, see it run, and watch your missions come to life.</p>
            </div>
          </div>
          <CodeArenaPreview />
        </div>
      </section>

      {/* Projects */}
      <section className="section" aria-label="Projects">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Build Real Things</span>
              <h2>Projects</h2>
              <p>Turn your skills into real products. Complete worlds to unlock projects.</p>
            </div>
            <Button to="/projects" variant="ghost">
              All Projects →
            </Button>
          </div>
          <div className="grid-3">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}