import React from "react";
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
import { todayChallenge } from "../../data/challenges";
import { projects } from "../../data/projects";

export default function Home() {
  return (
    <>
      <Hero />

      {/* Player Progress */}
      <section className="section" aria-label="Player progress">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Your Journey</span>
              <h2>Player Progress</h2>
            </div>
            <Button to="/profile" variant="ghost">
              View Full Profile →
            </Button>
          </div>
          <ProgressCard />
        </div>
      </section>

      {/* Learning Worlds */}
      <section className="section" aria-label="Learning worlds">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">The Path</span>
              <h2>Learning Worlds</h2>
              <p>Six epic worlds. One journey. 97 missions from your first variable to full-stack engineering.</p>
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

      {/* Today's Challenge */}
      <section className="section" aria-label="Today's challenge">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Daily Briefing</span>
              <h2>Today's Challenge</h2>
            </div>
            <Button to="/challenges" variant="ghost">
              All Challenges →
            </Button>
          </div>
          <div className="grid-2">
            <MissionCard challenge={todayChallenge} />
            <div className="card card-elevated" style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "1rem" }}>
              <h3 style={{ fontSize: "1.5rem" }}>Ready for more?</h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                Complete today's mission to keep your streak alive and unlock the next
                challenge in The Village. Every mission brings you closer to Level 02.
              </p>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <Badge tone="warning">🔥 3 day streak</Badge>
                <Badge tone="accent">⚡ +100 XP</Badge>
              </div>
            </div>
          </div>
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