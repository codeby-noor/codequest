import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../Button/Button";
import Badge from "../Badge/Badge";
import { useProgress } from "../../context/ProgressContext";

const ONBOARDING_KEY = "codequest-onboarding-dismissed";

const steps = [
  { icon: "📖", title: "1. Learn", desc: "Interactive concept lessons" },
  { icon: "⚔️", title: "2. Solve", desc: "Hands-on coding challenges" },
  { icon: "⚡", title: "3. Earn XP", desc: "Level up your coder tier" },
  { icon: "🗺️", title: "4. Unlock Worlds", desc: "Conquer 6 epic realms" },
  { icon: "🚀", title: "5. Graduate", desc: "Become a Full-Stack Dev" },
];

export default function OnboardingModal() {
  const { progress } = useProgress();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(ONBOARDING_KEY);
    const isBrandNew = (progress.completedLessons || []).length === 0 && (progress.xp || 0) === 0;
    if (isBrandNew && !dismissed) {
      setIsOpen(true);
    }
  }, [progress.completedLessons, progress.xp]);

  // Handle Escape key to dismiss
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen) {
        handleDismiss();
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleDismiss() {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setIsOpen(false);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleDismiss}
          role="presentation"
        >
          <motion.div
            className="modal-card onboarding-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="onboarding-title"
            initial={{ scale: 0.9, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "580px", textAlign: "center", padding: "clamp(1.25rem, 4vw, 2rem)", width: "100%" }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }} aria-hidden="true">⚔️</div>
            <Badge tone="accent" style={{ marginBottom: "0.75rem" }}>WELCOME ADVENTURER</Badge>
            <h2 id="onboarding-title" style={{ fontSize: "clamp(1.25rem, 4vw, 1.75rem)", marginBottom: "0.5rem" }}>
              Welcome to CodeQuest
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Transform from novice coder into a full-stack software engineer in 5 simple steps:
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(95px, 1fr))",
                gap: "0.5rem",
                marginBottom: "1.75rem",
                textAlign: "center",
              }}
            >
              {steps.map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "var(--surface, rgba(255, 255, 255, 0.03))",
                    border: "1px solid var(--border, rgba(255, 255, 255, 0.1))",
                    borderRadius: "var(--radius-md, 8px)",
                    padding: "0.65rem 0.4rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  <span style={{ fontSize: "1.25rem" }} aria-hidden="true">{s.icon}</span>
                  <strong style={{ fontSize: "0.8rem", color: "var(--text-primary)" }}>{s.title}</strong>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", lineHeight: 1.2 }}>{s.desc}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Button
                to="/learn/village/lesson-01"
                variant="primary"
                size="lg"
                onClick={handleDismiss}
              >
                Start First Quest (Village) →
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDismiss}>
                Skip Onboarding & Explore
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
