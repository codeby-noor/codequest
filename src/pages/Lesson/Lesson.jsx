import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CodePlayground from "../../components/CodePlayground/CodePlayground";
import Button from "../../components/Button/Button";
import Badge from "../../components/Badge/Badge";
import { getLessonById, getNextLessonId, isWorldComplete } from "../../data/lessonsIndex";
import { useProgress } from "../../context/ProgressContext";
import { trackEvent, ANALYTICS_EVENTS } from "../../services/analytics";

const WORLD_META = {
  village: { name: "JavaScript Village", path: "/learn/village" },
  "logic-forest": { name: "The Logic Forest", path: "/learn/logic-forest" },
  forest: { name: "The Logic Forest", path: "/learn/logic-forest" },
  "web-kingdom": { name: "The Web Kingdom", path: "/learn/web-kingdom" },
  kingdom: { name: "The Web Kingdom", path: "/learn/web-kingdom" },
  "api-harbor": { name: "The API Harbor", path: "/learn/api-harbor" },
  harbor: { name: "The API Harbor", path: "/learn/api-harbor" },
  "backend-citadel": { name: "The Backend Citadel", path: "/learn/backend-citadel" },
  citadel: { name: "The Backend Citadel", path: "/learn/backend-citadel" },
  "developer-realm": { name: "The Developer Realm", path: "/learn/developer-realm" },
  realm: { name: "The Developer Realm", path: "/learn/developer-realm" },
  workshop: { name: "The Workshop", path: "/learn/workshop" },
  city: { name: "The City", path: "/learn/city" },
};

/**
 * Lesson page — the core learning interface.
 * Shows lesson content on the left, code playground on the right.
 * Fully data-driven — works for any world's lessons.
 */
export default function Lesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { progress, isLessonUnlocked, isLessonCompleted, completeLessonAndReward } = useProgress();

  const lesson = getLessonById(lessonId);
  const [showComplete, setShowComplete] = useState(false);

  if (!lesson) {
    return (
      <div className="container">
        <div className="placeholder-page">
          <div>
            <span className="placeholder-icon" aria-hidden="true">❓</span>
            <h1>Lesson not found</h1>
            <p>This lesson doesn't exist. Let's get you back on track.</p>
            <Button to="/learn" variant="primary">Back to Learn →</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!isLessonUnlocked(lesson.id)) {
    return (
      <div className="container">
        <div className="placeholder-page">
          <div>
            <span className="placeholder-icon" aria-hidden="true">🔒</span>
            <h1>Lesson Locked</h1>
            <p>Complete the previous lesson to unlock this one.</p>
            <Button to={`/learn/${lesson.world}`} variant="primary">Back to Learn →</Button>
          </div>
        </div>
      </div>
    );
  }

  const alreadyCompleted = isLessonCompleted(lesson.id);
  const nextLessonId = getNextLessonId(lesson.id);
  const nextLesson = nextLessonId ? getLessonById(nextLessonId) : null;
  const worldMeta = WORLD_META[lesson.world] || WORLD_META.village;
  const isFinalBoss = lesson.type === "boss";

  function handleSolved() {
    if (!alreadyCompleted) {
      completeLessonAndReward(lesson);
      trackEvent(ANALYTICS_EVENTS.SESSION_COMPLETED, {
        lessonId: lesson.id,
        world: lesson.world,
        xp: lesson.xp,
      });
    }
    setShowComplete(true);
  }

  return (
    <div className="container lesson-page">
      {/* Header */}
      <div className="lesson-header">
        <Link to={`/learn/${lesson.world}`} className="lesson-back">
          ← {worldMeta.name.toUpperCase()}
        </Link>
        <div className="lesson-header-right">
          <span className="lesson-number">
            {lesson.type === "boss" ? "BOSS" : `LESSON ${lesson.number}`}
          </span>
          <span className="lesson-xp">⚡ {lesson.xp} XP</span>
        </div>
      </div>

      <div className="lesson-grid">
        {/* Content */}
        <div className="lesson-content">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1>{lesson.title}</h1>
            <p className="lesson-description">{lesson.description}</p>

            {lesson.content.map((block, i) => (
              <LessonBlock key={i} block={block} />
            ))}

            {/* Challenge */}
            <div className="lesson-challenge">
              <div className="lesson-challenge-header">
                <Badge tone={lesson.type === "boss" ? "danger" : "accent"}>
                  {lesson.type === "boss" ? "👑 BOSS CHALLENGE" : "⚔️ CHALLENGE"}
                </Badge>
                <span className="lesson-challenge-xp">⚡ {lesson.xp} XP</span>
              </div>
              <p className="lesson-challenge-prompt">{lesson.challenge.prompt}</p>
              <div className="lesson-challenge-actions">
                <Button
                  to={`/code-arena/${lesson.challenge.id}`}
                  variant="secondary"
                  size="sm"
                >
                  Enter Code Arena →
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Playground */}
        <div className="lesson-playground">
          <CodePlayground
            challenge={lesson.challenge}
            challengeType={lesson.challengeType}
            onSolved={handleSolved}
          />
        </div>
      </div>

      {/* Mission Complete Modal */}
      <AnimatePresence>
        {showComplete && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowComplete(false)}
          >
            <motion.div
              className="modal-card"
              role="dialog"
              aria-modal="true"
              aria-label="Mission complete"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-icon" aria-hidden="true">
                {lesson.type === "boss" ? "👑" : "✓"}
              </div>
              {isFinalBoss && lesson.world === "village" ? (
                <>
                  <h2>JAVASCRIPT VILLAGE COMPLETE</h2>
                  <p className="modal-title">You have mastered programming fundamentals.</p>
                  <div className="modal-xp">+{lesson.xp} XP</div>
                  <div className="modal-checks">
                    <div className="modal-check">✓ Variables & Types</div>
                    <div className="modal-check">✓ Operators & Math</div>
                    <div className="modal-check">✓ Conditions & Logic</div>
                    <div className="modal-check">✓ Arrays & Objects</div>
                    <div className="modal-check">✓ Loops & Functions</div>
                    <div className="modal-check">✓ DOM & Events</div>
                    <div className="modal-check">✓ Debugging</div>
                  </div>
                  <p
                    style={{
                      color: "var(--warning)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-xs)",
                      letterSpacing: "0.1em",
                      marginBottom: "1.5rem",
                    }}
                  >
                    WORLD COMPLETE — THE LOGIC FOREST UNLOCKED
                  </p>
                  <div className="modal-actions" style={{ flexDirection: "column" }}>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setShowComplete(false);
                        navigate("/learn/logic-forest");
                      }}
                    >
                      ENTER THE LOGIC FOREST →
                    </Button>
                    <Button variant="ghost" onClick={() => setShowComplete(false)}>
                      Stay Here
                    </Button>
                  </div>
                </>
              ) : isFinalBoss && (lesson.world === "logic-forest" || lesson.world === "forest") ? (
                <>
                  <h2>THE LOGIC FOREST COMPLETE</h2>
                  <p className="modal-title">You have defeated the Forest Guardian and mastered algorithmic thinking!</p>
                  <div className="modal-xp">+{lesson.xp} XP</div>
                  <div className="modal-checks">
                    <div className="modal-check">✓ Algorithmic Thinking & Decomposition</div>
                    <div className="modal-check">✓ Boolean Logic & Guard Clauses</div>
                    <div className="modal-check">✓ Linear Search & Fast Lookups</div>
                    <div className="modal-check">✓ Sets & Duplicate Detection</div>
                    <div className="modal-check">✓ Custom Comparators & Sorting</div>
                    <div className="modal-check">✓ Reduce & Data Aggregation</div>
                    <div className="modal-check">✓ Big-O Efficiency & Optimization</div>
                    <div className="modal-check">✓ Vanguard Squad Deployment Engine</div>
                  </div>
                  <p
                    style={{
                      color: "var(--warning)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-xs)",
                      letterSpacing: "0.1em",
                      marginBottom: "1.5rem",
                    }}
                  >
                    WORLD COMPLETE — THE WEB KINGDOM AWAITS
                  </p>
                  <div className="modal-actions" style={{ flexDirection: "column" }}>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setShowComplete(false);
                        navigate("/worlds");
                      }}
                    >
                      VIEW WORLD MAP →
                    </Button>
                    <Button variant="ghost" onClick={() => setShowComplete(false)}>
                      Stay Here
                    </Button>
                  </div>
                </>
              ) : isFinalBoss && (lesson.world === "web-kingdom" || lesson.world === "kingdom") ? (
                <>
                  <h2>THE WEB KINGDOM COMPLETE</h2>
                  <p className="modal-title">You have defeated the Web Kingdom Guardian and mastered modern web development!</p>
                  <div className="modal-xp">+{lesson.xp} XP</div>
                  <div className="modal-checks">
                    <div className="modal-check">✓ Semantic HTML5 & Structure</div>
                    <div className="modal-check">✓ CSS Box Model, Grid & Flexbox</div>
                    <div className="modal-check">✓ Responsive Web Design</div>
                    <div className="modal-check">✓ DOM Querying & Manipulation</div>
                    <div className="modal-check">✓ Interactive Browser Events</div>
                    <div className="modal-check">✓ Form Handling & Input Validation</div>
                    <div className="modal-check">✓ LocalStorage State Persistence</div>
                    <div className="modal-check">✓ Citadel Dashboard Reconstruction</div>
                  </div>
                  <p
                    style={{
                      color: "var(--warning)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-xs)",
                      letterSpacing: "0.1em",
                      marginBottom: "1.5rem",
                    }}
                  >
                    WORLD COMPLETE — THE API HARBOR UNLOCKED
                  </p>
                  <div className="modal-actions" style={{ flexDirection: "column" }}>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setShowComplete(false);
                        navigate("/worlds");
                      }}
                    >
                      VIEW WORLD MAP →
                    </Button>
                    <Button variant="ghost" onClick={() => setShowComplete(false)}>
                      Stay Here
                    </Button>
                  </div>
                </>
              ) : isFinalBoss && (lesson.world === "api-harbor" || lesson.world === "harbor") ? (
                <>
                  <h2>THE API HARBOR COMPLETE</h2>
                  <p className="modal-title">You have defeated the API Harbor Guardian and mastered HTTP, REST & Asynchronous JavaScript!</p>
                  <div className="modal-xp">+{lesson.xp} XP</div>
                  <div className="modal-checks">
                    <div className="modal-check">✓ Asynchronous JavaScript & async/await</div>
                    <div className="modal-check">✓ HTTP Request & Response Anatomy</div>
                    <div className="modal-check">✓ RESTful CRUD Resource Architecture</div>
                    <div className="modal-check">✓ JSON Serialization & Deserialization</div>
                    <div className="modal-check">✓ Transient Fault Retries & Error Handling</div>
                    <div className="modal-check">✓ Concurrent Requests with Promise.all</div>
                    <div className="modal-check">✓ Bearer Token Authentication</div>
                    <div className="modal-check">✓ Master Harbor Network Telemetry</div>
                  </div>
                  <p
                    style={{
                      color: "var(--warning)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-xs)",
                      letterSpacing: "0.1em",
                      marginBottom: "1.5rem",
                    }}
                  >
                    WORLD COMPLETE — THE BACKEND CITADEL UNLOCKED
                  </p>
                  <div className="modal-actions" style={{ flexDirection: "column" }}>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setShowComplete(false);
                        navigate("/worlds");
                      }}
                    >
                      VIEW WORLD MAP →
                    </Button>
                    <Button variant="ghost" onClick={() => setShowComplete(false)}>
                      Stay Here
                    </Button>
                  </div>
                </>
              ) : isFinalBoss && (lesson.world === "backend-citadel" || lesson.world === "citadel") ? (
                <>
                  <h2>THE BACKEND CITADEL COMPLETE</h2>
                  <p className="modal-title">You have defeated the Citadel Guardian and mastered Node.js, Express, Databases & REST APIs!</p>
                  <div className="modal-xp">+{lesson.xp} XP</div>
                  <div className="modal-checks">
                    <div className="modal-check">✓ Node.js Runtime & Port Configuration</div>
                    <div className="modal-check">✓ Express Routing & Dynamic Parameters</div>
                    <div className="modal-check">✓ Middleware Pipelines & next() Chaining</div>
                    <div className="modal-check">✓ In-Memory DB & Relational Data Joins</div>
                    <div className="modal-check">✓ SQL Querying, Filtering & Ordering</div>
                    <div className="modal-check">✓ Bearer Token Authentication & Guards</div>
                    <div className="modal-check">✓ Input Validation & Error Boundaries</div>
                    <div className="modal-check">✓ Master Citadel REST API Reconstructed</div>
                  </div>
                  <p
                    style={{
                      color: "var(--warning)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-xs)",
                      letterSpacing: "0.1em",
                      marginBottom: "1.5rem",
                    }}
                  >
                    WORLD COMPLETE — THE DEVELOPER REALM AWAITS
                  </p>
                  <div className="modal-actions" style={{ flexDirection: "column" }}>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setShowComplete(false);
                        navigate("/worlds");
                      }}
                    >
                      VIEW WORLD MAP →
                    </Button>
                    <Button variant="ghost" onClick={() => setShowComplete(false)}>
                      Stay Here
                    </Button>
                  </div>
                </>
              ) : isFinalBoss && (lesson.world === "developer-realm" || lesson.world === "realm") ? (
                <>
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>👑</div>
                  <h2>CODEQUEST COMPLETE — GRANDMASTER DEVELOPER</h2>
                  <p className="modal-title" style={{ maxWidth: "520px", margin: "0 auto 1.5rem" }}>
                    You have conquered the Developer Guardian and completed all 6 CodeQuest Worlds! You started as an adventurer, learned JavaScript, algorithms, UI engineering, APIs, backend architectures, and now engineer production-ready systems.
                  </p>
                  <div className="modal-xp" style={{ color: "var(--accent-primary)" }}>+1000 XP & CODEQUEST DEVELOPER TITLE</div>
                  <div className="modal-checks">
                    <div className="modal-check">✓ World 1: JavaScript Village (Programming Fundamentals)</div>
                    <div className="modal-check">✓ World 2: The Logic Forest (Algorithms & Problem Solving)</div>
                    <div className="modal-check">✓ World 3: The Web Kingdom (HTML, CSS & Interactive DOM)</div>
                    <div className="modal-check">✓ World 4: The API Harbor (HTTP, REST & Asynchronous JS)</div>
                    <div className="modal-check">✓ World 5: The Backend Citadel (Express & Relational DBs)</div>
                    <div className="modal-check">✓ World 6: The Developer Realm (Architecture & Production)</div>
                  </div>
                  <p
                    style={{
                      color: "var(--success)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-xs)",
                      letterSpacing: "0.15em",
                      margin: "1.5rem 0",
                      fontWeight: "bold",
                    }}
                  >
                    🏆 ALL 6 WORLDS MASTERED — YOU ARE A SOFTWARE DEVELOPER
                  </p>
                  <div className="modal-actions" style={{ flexDirection: "column", gap: "0.75rem" }}>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setShowComplete(false);
                        navigate("/profile");
                      }}
                    >
                      VIEW DEVELOPER PROFILE & AWARDS →
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setShowComplete(false);
                        navigate("/worlds");
                      }}
                    >
                      RETURN TO WORLD MAP 🗺️
                    </Button>
                    <Button variant="ghost" onClick={() => setShowComplete(false)}>
                      Review Boss Code
                    </Button>
                  </div>
                </>
              ) : isFinalBoss && lesson.world === "workshop" ? (
                <>
                  <h2>THE WORKSHOP COMPLETE</h2>
                  <p className="modal-title">You have mastered HTML + CSS fundamentals.</p>
                  <div className="modal-xp">+{lesson.xp} XP</div>
                  <div className="modal-checks">
                    <div className="modal-check">✓ HTML structure</div>
                    <div className="modal-check">✓ Semantic markup</div>
                    <div className="modal-check">✓ CSS styling</div>
                    <div className="modal-check">✓ Flexbox & Grid</div>
                    <div className="modal-check">✓ Responsive design</div>
                    <div className="modal-check">✓ Hover effects</div>
                  </div>
                  <p
                    style={{
                      color: "var(--warning)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-xs)",
                      letterSpacing: "0.1em",
                      marginBottom: "1.5rem",
                    }}
                  >
                    WORLD COMPLETE
                  </p>
                  <div className="modal-actions" style={{ flexDirection: "column" }}>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setShowComplete(false);
                        navigate("/worlds");
                      }}
                    >
                      CONTINUE YOUR JOURNEY →
                    </Button>
                    <Button variant="ghost" onClick={() => setShowComplete(false)}>
                      Stay Here
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <h2>MISSION COMPLETE</h2>
                  <div className="modal-xp">+{lesson.xp} XP</div>
                  <p className="modal-title">{lesson.title}</p>
                  <div className="modal-checks">
                    <div className="modal-check">✓ Concept understood</div>
                    <div className="modal-check">✓ Challenge completed</div>
                    <div className="modal-check">✓ Skill progress increased</div>
                    {nextLesson && (
                      <div className="modal-check" style={{ color: "var(--accent)" }}>
                        🔓 Next Mission Unlocked: {nextLesson.title}
                      </div>
                    )}
                  </div>
                  <div className="modal-actions">
                    {nextLessonId ? (
                      <Button
                        variant="primary"
                        onClick={() => {
                          setShowComplete(false);
                          navigate(`/learn/${lesson.world}/${nextLessonId}`);
                        }}
                      >
                        Continue Quest →
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={() => {
                          setShowComplete(false);
                          navigate(`/learn/${lesson.world}`);
                        }}
                      >
                        Return to {worldMeta.name} →
                      </Button>
                    )}
                    <Button variant="ghost" onClick={() => setShowComplete(false)}>
                      Stay Here
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Renders a single content block from lesson data. */
function LessonBlock({ block }) {
  switch (block.type) {
    case "heading":
      return <h2 className="lesson-heading">{block.text}</h2>;
    case "paragraph":
      return <p className="lesson-paragraph">{block.text}</p>;
    case "code":
      return (
        <pre className="lesson-code">
          <code>{block.code}</code>
        </pre>
      );
    case "example":
      return (
        <div className="lesson-example">
          <div className="lesson-example-title">{block.title}</div>
          {block.lines.map((line, i) => (
            <div className="lesson-example-line" key={i}>
              <span className="lesson-example-label">{line.label}</span>
              <span className="lesson-example-text">{line.text}</span>
            </div>
          ))}
        </div>
      );
    case "tip":
      return (
        <div className="lesson-tip">
          <span className="lesson-tip-icon" aria-hidden="true">💡</span>
          <span>{block.text}</span>
        </div>
      );
    default:
      return null;
  }
}