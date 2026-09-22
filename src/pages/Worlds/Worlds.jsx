import React from "react";
import { motion } from "framer-motion";
import PageHeader from "../../components/PageHeader/PageHeader";
import WorldCard from "../../components/WorldCard/WorldCard";
import Badge from "../../components/Badge/Badge";
import Button from "../../components/Button/Button";
import { worlds } from "../../data/worlds";
import { isWorldComplete, isWorldUnlocked } from "../../engine/progressEngine";
import { useProgress } from "../../context/ProgressContext";

/**
 * Worlds Map page — the overarching world map of CodeQuest.
 * Displays the 6 worlds in linear RPG adventure progression, showing
 * completed worlds, active quest, prerequisites, and upcoming frontiers.
 */
export default function Worlds() {
  const { progress, levelInfo } = useProgress();

  const completedWorldsCount = worlds.filter((w) => isWorldComplete(w.id, progress)).length;
  const unlockedWorldsCount = worlds.filter((w) => isWorldUnlocked(w.id, progress)).length;
  const currentWorld = worlds.find((w) => isWorldUnlocked(w.id, progress) && !isWorldComplete(w.id, progress)) || worlds[0];

  return (
    <div className="container">
      <PageHeader
        eyebrow="World Map"
        title="The Coding Realm"
        description="Six legendary worlds. One grand journey. Master each world's curriculum and boss battle to unlock the next frontier."
      />

      {/* World Map Hero Banner */}
      <motion.div
        className="card card-elevated mb-8 world-map-hero"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="world-map-hero-content">
          <div className="world-map-hero-left">
            <span className="section-eyebrow">Active Frontier</span>
            <h2>{currentWorld.icon} {currentWorld.title}</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", maxWidth: "600px", lineHeight: 1.6 }}>
              {currentWorld.description}
            </p>
            <div className="world-map-hero-tags mt-4">
              <Badge tone="accent">Level {levelInfo.level} {levelInfo.title}</Badge>
              <Badge tone="warning">⚡ {progress.xp} Total XP</Badge>
              <Badge tone="success">{completedWorldsCount} / {worlds.length} Worlds Conquered</Badge>
            </div>
          </div>
          <div className="world-map-hero-action">
            <Button to={`/learn/${currentWorld.id}`} variant="primary">
              Continue in {currentWorld.title} →
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Adventure Worlds Grid */}
      <div className="section-header" style={{ marginBottom: "1.5rem" }}>
        <div>
          <span className="section-eyebrow">Progression Path</span>
          <h2>World Progression</h2>
        </div>
        <div className="world-map-legend">
          <span className="legend-item"><span className="legend-dot completed"></span> Completed</span>
          <span className="legend-item"><span className="legend-dot in-progress"></span> In Progress</span>
          <span className="legend-item"><span className="legend-dot locked"></span> Locked</span>
        </div>
      </div>

      <div className="grid-3">
        {worlds.map((world, index) => (
          <WorldCard key={world.id} world={world} index={index} />
        ))}
      </div>
    </div>
  );
}