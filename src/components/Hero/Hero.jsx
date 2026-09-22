import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Button from "../Button/Button";
import { useProgress } from "../../context/ProgressContext";

const terminalLines = [
  { type: "command", text: "> initialize quest" },
  { type: "output", text: "Quest system online..." },
  { type: "output", text: "Loading world: THE VILLAGE", className: "accent" },
  { type: "output", text: "Mission assigned: Open the Door" },
  { type: "output", text: "Compiling first lesson...", className: "success" },
];

export default function Hero() {
  const sceneRef = useRef(null);
  const [hovering, setHovering] = useState(false);
  const { progress } = useProgress();

  // Mouse-reactive 3D tilt
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), {
    stiffness: 120,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), {
    stiffness: 120,
    damping: 20,
  });

  function handleMouseMove(e) {
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mx.set(0);
    my.set(0);
    setHovering(false);
  }

  return (
    <section className="hero" aria-label="CodeQuest introduction">
      <div className="container">
        <div className="hero-grid">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            <span className="hero-eyebrow">
              <span className="dot" aria-hidden="true" />
              Your coding journey begins
            </span>

            <h1>
              Learn Code.{" "}
              <span className="text-gradient">Play.</span>{" "}
              <span className="text-gradient">Build.</span>{" "}
              Master.
            </h1>

            <p className="hero-subtitle">
              From your first line of code to production-grade engineering —
              learn through missions, challenges, projects, and real coding.
            </p>

            <div className="hero-actions">
              <Button to="/learn" size="lg">
                Start Your Quest →
              </Button>
              <Button to="/worlds" variant="secondary" size="lg">
                Explore Worlds
              </Button>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-value">{progress.xp} XP</span>
                <span className="hero-stat-label">Earned</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-value">6</span>
                <span className="hero-stat-label">Worlds</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-value">97</span>
                <span className="hero-stat-label">Missions</span>
              </div>
            </div>
          </motion.div>

          {/* Right: floating terminal */}
          <motion.div
            className="terminal-scene"
            ref={sceneRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            aria-hidden="true"
          >
            <div className="orb orb-blue animate-glow" />
            <div className="orb orb-purple animate-glow" />

            <motion.div
              className="terminal animate-float-slow"
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              animate={hovering ? { scale: 1.02 } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="terminal-header">
                <span className="terminal-dot red" />
                <span className="terminal-dot yellow" />
                <span className="terminal-dot green" />
                <span className="terminal-title">codequest — mission terminal</span>
              </div>

              <div className="terminal-body">
                {terminalLines.map((line, i) => (
                  <div className="terminal-line" key={i}>
                    {line.type === "command" ? (
                      <>
                        <span className="terminal-prompt">❯</span>
                        <span className="terminal-command">{line.text}</span>
                      </>
                    ) : (
                      <span className={`terminal-output ${line.className || ""}`}>
                        {line.text}
                      </span>
                    )}
                  </div>
                ))}

                <div className="terminal-line">
                  <span className="terminal-cursor" />
                </div>

                <div className="terminal-mission">
                  <div className="terminal-mission-title">LEVEL 01</div>
                  <div className="terminal-mission-name">THE VILLAGE</div>
                  <div className="terminal-mission-xp">⚡ +250 XP</div>
                  <div className="terminal-mission-complete">
                    <span aria-hidden="true">✓</span> MISSION COMPLETE
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}