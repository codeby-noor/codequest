import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "../../components/PageHeader/PageHeader";
import MissionCard from "../../components/MissionCard/MissionCard";
import Badge from "../../components/Badge/Badge";
import Button from "../../components/Button/Button";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import {
  challenges,
  TOPIC_LIST,
  DIFFICULTY_LIST,
} from "../../data/challenges";
import { useProgress } from "../../context/ProgressContext";

export default function Challenges() {
  const { isChallengeCompleted, isLessonUnlocked } = useProgress();

  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Total catalog statistics
  const stats = useMemo(() => {
    const total = challenges.length;
    const completed = challenges.filter((c) => isChallengeCompleted(c.id)).length;
    const totalXp = challenges.reduce((sum, c) => sum + (c.xp || 0), 0);
    const earnedXp = challenges
      .filter((c) => isChallengeCompleted(c.id))
      .reduce((sum, c) => sum + (c.xp || 0), 0);
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, remaining: total - completed, totalXp, earnedXp, percent };
  }, [isChallengeCompleted]);

  // Recommended next challenge (first unlocked, uncompleted challenge)
  const recommendedChallenge = useMemo(() => {
    return challenges.find((c) => {
      const isCompleted = isChallengeCompleted(c.id);
      const isUnlocked = isLessonUnlocked(c.lessonId);
      return !isCompleted && isUnlocked;
    }) || null;
  }, [isChallengeCompleted, isLessonUnlocked]);

  // Filtered challenges based on topic, difficulty, status, and search query
  const filteredChallenges = useMemo(() => {
    return challenges.filter((c) => {
      // Topic filter
      if (selectedTopic !== "all" && c.topic !== selectedTopic) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== "all") {
        if (selectedDifficulty === "Boss") {
          if (c.difficulty !== "Boss") return false;
        } else if (c.difficulty !== selectedDifficulty) {
          return false;
        }
      }

      // Status filter
      const completed = isChallengeCompleted(c.id);
      const unlocked = isLessonUnlocked(c.lessonId);
      if (selectedStatus === "completed" && !completed) return false;
      if (selectedStatus === "available" && (!unlocked || completed)) return false;
      if (selectedStatus === "locked" && (unlocked || completed)) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = c.title.toLowerCase().includes(q);
        const matchesObjective = (c.objective || "").toLowerCase().includes(q);
        const matchesWorld = (c.world || "").toLowerCase().includes(q);
        const matchesCode = (c.code || "").toLowerCase().includes(q);
        if (!matchesTitle && !matchesObjective && !matchesWorld && !matchesCode) {
          return false;
        }
      }

      return true;
    });
  }, [selectedTopic, selectedDifficulty, selectedStatus, searchQuery, isChallengeCompleted, isLessonUnlocked]);

  const clearAllFilters = () => {
    setSelectedTopic("all");
    setSelectedDifficulty("all");
    setSelectedStatus("all");
    setSearchQuery("");
  };

  return (
    <div className="container challenges-page" style={{ paddingBottom: "4rem" }}>
      <PageHeader
        eyebrow="Structured Learning Paths"
        title="Coding Challenges Hub"
        description="Master coding concepts through focused hands-on challenges. Filter by topic or difficulty, track your progression, and earn verified XP."
      />

      {/* Progress & Overview Dashboard Bar */}
      <section
        className="card card-elevated"
        style={{
          marginBottom: "2.5rem",
          padding: "1.75rem",
          background: "var(--cq-surface-card)",
          borderRadius: "var(--cq-radius-xl)",
          border: "1px solid var(--cq-border)",
        }}
        aria-label="Challenge progression overview"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1.5rem",
            alignItems: "center",
            marginBottom: "1.25rem",
          }}
        >
          <div>
            <span style={{ fontSize: "0.8rem", color: "var(--cq-text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Catalog Completion
            </span>
            <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--cq-text)", marginTop: "0.25rem" }}>
              {stats.completed} <span style={{ fontSize: "1.1rem", color: "var(--cq-text-muted)", fontWeight: 400 }}>/ {stats.total} Solved</span>
            </div>
          </div>

          <div>
            <span style={{ fontSize: "0.8rem", color: "var(--cq-text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Verified XP Earned
            </span>
            <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--cq-accent)", marginTop: "0.25rem" }}>
              {stats.earnedXp.toLocaleString()} <span style={{ fontSize: "1.1rem", color: "var(--cq-text-muted)", fontWeight: 400 }}>/ {stats.totalXp.toLocaleString()} XP</span>
            </div>
          </div>

          <div>
            <span style={{ fontSize: "0.8rem", color: "var(--cq-text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Path Completion
            </span>
            <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--cq-primary-light)", marginTop: "0.25rem" }}>
              {stats.percent}%
            </div>
          </div>
        </div>

        <ProgressBar value={stats.percent} size="md" label="Catalog completion percentage" />
      </section>

      {/* Recommended Next Challenge Card */}
      {recommendedChallenge && (
        <section
          className="card card-elevated"
          style={{
            marginBottom: "2.5rem",
            padding: "1.75rem",
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(16, 185, 129, 0.05))",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            borderRadius: "var(--cq-radius-xl)",
            position: "relative",
            overflow: "hidden",
          }}
          aria-label="Recommended next challenge"
        >
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <Badge tone="accent">⚡ RECOMMENDED NEXT CHALLENGE</Badge>
                <Badge tone={recommendedChallenge.difficultyTone}>{recommendedChallenge.difficulty}</Badge>
                <span style={{ fontSize: "0.85rem", color: "var(--cq-text-muted)", fontFamily: "var(--font-mono)" }}>
                  +{recommendedChallenge.xp} XP
                </span>
              </div>
              <h2 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0.5rem 0" }}>{recommendedChallenge.title}</h2>
              <p style={{ color: "var(--cq-text-secondary)", maxWidth: "700px", lineHeight: 1.6, margin: 0 }}>
                {recommendedChallenge.objective}
              </p>
              <div style={{ display: "flex", gap: "1rem", marginTop: "0.75rem", fontSize: "0.85rem", color: "var(--cq-text-muted)" }}>
                <span>World: <strong>{recommendedChallenge.world}</strong></span>
                <span>Code: <strong>{recommendedChallenge.code}</strong></span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              <Button to={`/code-arena/${recommendedChallenge.id}`} variant="primary">
                Start Challenge →
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Filter and Search Controls */}
      <section
        style={{
          marginBottom: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
        aria-label="Filter and search challenges"
      >
        {/* Search Bar & Status Quick Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ flex: "1 1 300px", maxWidth: "450px", position: "relative" }}>
            <input
              type="text"
              placeholder="Search challenges by keyword, topic, or objective..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{
                background: "var(--cq-surface-card)",
                border: "1px solid var(--cq-border)",
                color: "var(--cq-text)",
                padding: "0.6rem 1rem",
                borderRadius: "var(--cq-radius-lg)",
                fontSize: "0.95rem",
              }}
              aria-label="Search challenges"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  color: "var(--cq-text-muted)",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--cq-text-muted)", marginRight: "0.25rem" }}>
              Status:
            </span>
            {["all", "available", "completed", "locked"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                style={{
                  padding: "0.35rem 0.85rem",
                  fontSize: "0.85rem",
                  borderRadius: "20px",
                  border: "1px solid",
                  borderColor: selectedStatus === st ? "var(--cq-primary)" : "var(--cq-border)",
                  background: selectedStatus === st ? "var(--cq-primary)" : "var(--cq-surface-card)",
                  color: selectedStatus === st ? "#fff" : "var(--cq-text-secondary)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  textTransform: "capitalize",
                }}
                aria-pressed={selectedStatus === st}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Filters */}
        <div>
          <div style={{ fontSize: "0.85rem", color: "var(--cq-text-muted)", marginBottom: "0.5rem", fontWeight: 600 }}>
            Topic Tracks:
          </div>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
            role="group"
            aria-label="Topic filters"
          >
            {TOPIC_LIST.map((topic) => {
              const active = selectedTopic === topic.id;
              const count =
                topic.id === "all"
                  ? challenges.length
                  : challenges.filter((c) => c.topic === topic.id).length;

              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelectedTopic(topic.id)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.45rem 0.9rem",
                    fontSize: "0.875rem",
                    borderRadius: "8px",
                    border: "1px solid",
                    borderColor: active ? "var(--cq-primary-light)" : "var(--cq-border)",
                    background: active ? "rgba(99, 102, 241, 0.15)" : "var(--cq-surface-card)",
                    color: active ? "var(--cq-primary-light)" : "var(--cq-text)",
                    fontWeight: active ? 600 : 400,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  aria-pressed={active}
                >
                  <span aria-hidden="true">{topic.icon}</span>
                  <span>{topic.label}</span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      padding: "1px 6px",
                      borderRadius: "10px",
                      background: active ? "rgba(99, 102, 241, 0.3)" : "rgba(255, 255, 255, 0.08)",
                      color: active ? "#fff" : "var(--cq-text-muted)",
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty Filter Tabs */}
        <div>
          <div style={{ fontSize: "0.85rem", color: "var(--cq-text-muted)", marginBottom: "0.5rem", fontWeight: 600 }}>
            Difficulty Level:
          </div>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
            role="group"
            aria-label="Difficulty filters"
          >
            {DIFFICULTY_LIST.map((diff) => {
              const active = selectedDifficulty === diff.id;
              return (
                <button
                  key={diff.id}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff.id)}
                  style={{
                    padding: "0.4rem 1rem",
                    fontSize: "0.875rem",
                    borderRadius: "6px",
                    border: "1px solid",
                    borderColor: active ? "var(--cq-primary)" : "var(--cq-border)",
                    background: active ? "var(--cq-primary)" : "var(--cq-surface-card)",
                    color: active ? "#fff" : "var(--cq-text-secondary)",
                    cursor: "pointer",
                    fontWeight: active ? 600 : 400,
                    transition: "all 0.15s ease",
                  }}
                  aria-pressed={active}
                >
                  {diff.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Results Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.25rem",
          paddingBottom: "0.75rem",
          borderBottom: "1px solid var(--cq-border)",
        }}
      >
        <span style={{ fontSize: "0.95rem", color: "var(--cq-text-secondary)" }}>
          Showing <strong>{filteredChallenges.length}</strong> of {challenges.length} challenges
        </span>

        {(selectedTopic !== "all" || selectedDifficulty !== "all" || selectedStatus !== "all" || searchQuery) && (
          <button
            type="button"
            onClick={clearAllFilters}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--cq-primary-light)",
              cursor: "pointer",
              fontSize: "0.875rem",
              textDecoration: "underline",
            }}
          >
            Reset All Filters
          </button>
        )}
      </div>

      {/* Challenges Grid */}
      {filteredChallenges.length > 0 ? (
        <div className="grid-2">
          {filteredChallenges.map((challenge, index) => (
            <MissionCard key={challenge.id} challenge={challenge} index={index} />
          ))}
        </div>
      ) : (
        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            background: "var(--cq-surface-card)",
            borderRadius: "var(--cq-radius-xl)",
            border: "1px dashed var(--cq-border)",
          }}
        >
          <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "1rem" }} aria-hidden="true">
            🔍
          </span>
          <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>No matching challenges found</h3>
          <p style={{ color: "var(--cq-text-secondary)", maxWidth: "480px", margin: "0 auto 1.5rem auto" }}>
            No challenges matched your current combination of topic, difficulty, or search term.
          </p>
          <Button variant="secondary" onClick={clearAllFilters}>
            Clear Filters & View All
          </Button>
        </div>
      )}
    </div>
  );
}