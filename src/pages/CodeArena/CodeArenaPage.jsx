import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CodeEditor from "../../components/CodeArena/CodeEditor";
import MissionPanel from "../../components/CodeArena/MissionPanel";
import Terminal from "../../components/CodeArena/Terminal";
import TestResults from "../../components/CodeArena/TestResults";
import ArenaToolbar from "../../components/CodeArena/ArenaToolbar";
import ArenaBreadcrumbs from "../../components/CodeArena/ArenaBreadcrumbs";
import MentorPanel from "../../components/CodeArena/MentorPanel";
import ResetDialog from "../../components/CodeArena/ResetDialog";
import HtmlCssPreview from "../../components/CodeArena/HtmlCssPreview";
import Button from "../../components/Button/Button";
import { getArenaChallengeById } from "../../data/arenaChallenges";
import { validateUserChallenge, isHtmlCssChallenge } from "../../engine/challengeValidator";
import { runUserCode, formatErrorForBeginner } from "../../engine/codeRunner";
import { getCheckpoint, saveCheckpoint, clearCheckpoint } from "../../engine/checkpointEngine";
import { useProgress } from "../../context/ProgressContext";
import { trackEvent, ANALYTICS_EVENTS } from "../../services/analytics";

/**
 * Code Arena — the full coding experience.
 * Write, run, debug, test, and submit code challenges.
 * Supports both JavaScript (Web Worker) and HTML/CSS (sandboxed iframe).
 */
export default function CodeArenaPage() {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const { isChallengeCompleted, isLessonUnlocked, isWorldUnlocked, submitChallengeCompletion, completeLessonAndReward } = useProgress();

  const challenge = getArenaChallengeById(challengeId);
  const isHtmlCss = isHtmlCssChallenge(challenge);

  const [code, setCode] = useState("");
  const [logs, setLogs] = useState([]);
  const [testResults, setTestResults] = useState(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState("idle"); // "idle" | "submitting" | "correct" | "incorrect" | "network_error" | "server_error"
  const [submissionResult, setSubmissionResult] = useState(null);
  const [terminalStatus, setTerminalStatus] = useState(null);
  const [terminalError, setTerminalError] = useState(null);
  const [hintIndex, setHintIndex] = useState(0);
  const [mentorOpen, setMentorOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [showFailed, setShowFailed] = useState(false);
  const [saved, setSaved] = useState(false);
  const saveTimerRef = useRef(null);

  // Load challenge + checkpoint
  useEffect(() => {
    if (!challenge) return;

    trackEvent(ANALYTICS_EVENTS.CHALLENGE_STARTED, {
      challengeId: challenge.id,
      difficulty: challenge.difficulty,
    });

    const checkpoint = getCheckpoint(challenge.id);
    setCode(checkpoint ? checkpoint.code : challenge.starterCode);
    setLogs([]);
    setTestResults(null);
    setTerminalStatus(null);
    setTerminalError(null);
    setHintIndex(0);
    setMentorOpen(false);
    setResetOpen(false);
    setShowComplete(false);
    setShowFailed(false);
  }, [challenge]);

  // Auto-save checkpoint (debounced)
  useEffect(() => {
    if (!challenge || !code) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveCheckpoint(challenge.id, code);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [code, challenge]);

  if (!challenge) {
    return (
      <div className="container">
        <div className="placeholder-page">
          <div>
            <span className="placeholder-icon" aria-hidden="true">⚔️</span>
            <h1>Challenge not found</h1>
            <p>This challenge doesn't exist in the arena.</p>
            <Button to="/code-arena" variant="primary">Back to Code Arena →</Button>
          </div>
        </div>
      </div>
    );
  }

  const accessGranted = isWorldUnlocked(challenge.world) && isLessonUnlocked(challenge.lessonId);

  if (!accessGranted) {
    return (
      <div className="container">
        <div className="placeholder-page">
          <div>
            <span className="placeholder-icon" aria-hidden="true">🔒</span>
            <h1>Challenge Locked</h1>
            <p>
              {challenge.world === "workshop"
                ? "Complete The Village to unlock The Workshop challenges."
                : "Complete the previous lesson to unlock this challenge."}
            </p>
            <Button to={challenge.world === "workshop" ? "/worlds" : `/learn/${challenge.world}`} variant="primary">
              Back to Quest →
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const alreadyCompleted = isChallengeCompleted(challenge.id);
  const allPassed = testResults ? testResults.every((r) => r.success) : false;

  /** Run code: execute + validate tests. */
  async function handleRun() {
    setRunning(true);
    setTerminalStatus("running");
    setTerminalError(null);
    setTestResults(null);
    setShowFailed(false);

    try {
      // HTML/CSS challenges use the sandboxed iframe validator directly.
      if (isHtmlCss) {
        const validation = await validateUserChallenge(code, challenge);

        if (validation.error) {
          setTerminalStatus("error");
          setTerminalError({
            friendly: "Something went wrong while rendering your code.",
            hint: "Check your HTML/CSS for unclosed tags or invalid syntax.",
            technical: validation.error.message,
          });
          setTestResults(null);
          setLogs([]);
          return;
        }

        setTerminalStatus("success");
        setTerminalError(null);
        setTestResults(validation.results);
        setLogs([]);
        return;
      }

      // JavaScript challenges: execute in Web Worker, then validate.
      const exec = await runUserCode(code);

      if (exec.error) {
        const friendly = formatErrorForBeginner(exec.error);
        setTerminalStatus("error");
        setTerminalError(friendly);
        setTestResults(null);
        setLogs(exec.logs);
        return;
      }

      const validation = await validateUserChallenge(code, challenge);

      if (validation.error) {
        const friendly = formatErrorForBeginner(validation.error);
        setTerminalStatus("error");
        setTerminalError(friendly);
        setTestResults(null);
        setLogs(exec.logs);
      } else {
        setTerminalStatus("success");
        setTerminalError(null);
        setTestResults(validation.results);
        setLogs(exec.logs);
      }
    } catch (err) {
      setTerminalStatus("error");
      setTerminalError({
        friendly: "Something went wrong while running your code.",
        hint: "Try running your code again.",
        technical: err.message,
      });
      setTestResults(null);
      setLogs([]);
    } finally {
      setRunning(false);
    }
  }

  /** Submit mission — calls server-side verification and awards XP safely. */
  async function handleSubmit() {
    if (!allPassed) {
      setSubmissionStatus("incorrect");
      setShowFailed(true);
      return;
    }

    if (alreadyCompleted) {
      // Prevent duplicate submission attempts while acknowledging completed status
      setSubmissionStatus("correct");
      setSubmissionResult({ alreadyCompleted: true, awardedXp: 0 });
      setShowComplete(true);
      return;
    }

    setSubmitting(true);
    setSubmissionStatus("submitting");

    try {
      const res = await submitChallengeCompletion(challenge);
      setSubmissionResult(res);

      if (res && res.success) {
        trackEvent(ANALYTICS_EVENTS.CHALLENGE_COMPLETED, {
          challengeId: challenge.id,
          difficulty: challenge.difficulty,
        });
        setSubmissionStatus("correct");
        clearCheckpoint(challenge.id);
        setShowComplete(true);
      } else if (res && res.offline) {
        setSubmissionStatus("network_error");
        clearCheckpoint(challenge.id);
        setShowComplete(true);
      } else {
        setSubmissionStatus("server_error");
        setShowFailed(true);
      }
    } catch (err) {
      setSubmissionStatus("server_error");
      setSubmissionResult({ message: err.message || "Failed to submit challenge" });
      setShowFailed(true);
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setCode(challenge.starterCode);
    setLogs([]);
    setTestResults(null);
    setTerminalStatus(null);
    setTerminalError(null);
    setHintIndex(0);
    setResetOpen(false);
  }

  function handleSave() {
    saveCheckpoint(challenge.id, code);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="arena-page">
      {/* Top bar */}
      <div className="arena-topbar">
        <div className="container arena-topbar-inner">
          <ArenaBreadcrumbs challenge={challenge} />
          <div className="arena-topbar-right">
            <span className="arena-xp">⚡ +{challenge.xp} XP</span>
            {saved && <span className="arena-saved">✓ Saved</span>}
          </div>
        </div>
      </div>

      <div className="container arena-layout">
        {/* Left: Mission panel */}
        <aside className="arena-sidebar">
          <MissionPanel
            challenge={challenge}
            testResults={testResults}
            hintIndex={hintIndex}
            onRevealHint={() => setHintIndex((i) => Math.min(i + 1, challenge.hints.length - 1))}
          />
        </aside>

        {/* Right: Editor + Output */}
        <main className="arena-main">
          <div className="arena-editor-panel">
            <div className="arena-panel-header">
              <span className="arena-panel-label">Code Editor</span>
              <span className="arena-status">
                {alreadyCompleted ? "✓ Completed" : "● In Progress"}
              </span>
            </div>
            <CodeEditor
              code={code}
              onChange={setCode}
              onRun={handleRun}
              onSave={handleSave}
              ariaLabel={`Code editor for ${challenge.title}`}
            />
          </div>

          {/* HTML/CSS live preview */}
          {isHtmlCss && (
            <HtmlCssPreview code={code} challengeType={challenge.challengeType} />
          )}

          <div className="arena-bottom-grid">
            <Terminal logs={logs} status={terminalStatus} error={terminalError} />
            <TestResults results={testResults} running={running} error={terminalError} />
          </div>

          {mentorOpen && (
            <div className="arena-mentor">
              <MentorPanel challenge={challenge} />
            </div>
          )}
        </main>
      </div>

      {/* Bottom toolbar */}
      <div className="arena-toolbar-wrap">
        <div className="container">
          <ArenaToolbar
            onRun={handleRun}
            onReset={() => setResetOpen(true)}
            onMentor={() => setMentorOpen((o) => !o)}
            onSubmit={handleSubmit}
            running={running}
            allPassed={allPassed}
            alreadyCompleted={alreadyCompleted}
            mentorOpen={mentorOpen}
          />
        </div>
      </div>

      {/* Reset dialog */}
      <ResetDialog
        open={resetOpen}
        onCancel={() => setResetOpen(false)}
        onConfirm={handleReset}
      />

      {/* Mission complete modal */}
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
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-icon" aria-hidden="true">✓</div>
              <h2>
                {submissionResult?.alreadyCompleted
                  ? "MISSION ALREADY COMPLETED"
                  : "MISSION COMPLETE"}
              </h2>

              <div className="modal-xp">
                {submissionResult?.alreadyCompleted
                  ? "+0 XP (Previously Awarded)"
                  : `+${submissionResult?.awardedXp || challenge.xp} XP`}
              </div>

              <p className="modal-title">{challenge.title}</p>

              {submissionResult?.achievementXpBonus > 0 && (
                <div style={{ margin: "0.5rem 0", color: "var(--accent)", fontWeight: 600 }}>
                  🌟 Includes +{submissionResult.achievementXpBonus} XP Achievement Bonus!
                </div>
              )}

              {submissionResult?.newlyUnlockedAchievements?.length > 0 && (
                <div style={{ margin: "0.5rem 0", padding: "0.5rem", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
                    Unlocked Achievements:
                  </div>
                  {submissionResult.newlyUnlockedAchievements.map((ach) => (
                    <div key={ach.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", color: "var(--text-primary)" }}>
                      <span>{ach.icon || "🏆"}</span>
                      <strong>{ach.title}</strong>
                      <span style={{ color: "var(--accent)" }}>+{ach.xp} XP</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="modal-checks">
                <div className="modal-check">✓ Verified solution evaluated</div>
                <div className="modal-check">✓ All tests and requirements passed</div>
                <div className="modal-check">✓ Progress saved securely</div>
              </div>

              <div className="modal-actions">
                <Button
                  variant="primary"
                  onClick={() => navigate(`/learn/${challenge.world}/${challenge.lessonId}`)}
                >
                  Return to Quest →
                </Button>
                <Button variant="ghost" onClick={() => setShowComplete(false)}>
                  Stay Here
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submission feedback / failure modal */}
      <AnimatePresence>
        {showFailed && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFailed(false)}
          >
            <motion.div
              className="modal-card"
              role="dialog"
              aria-modal="true"
              aria-label="Submission feedback"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-icon" aria-hidden="true">
                {submissionStatus === "server_error" ? "⚠️" : "❌"}
              </div>
              <h2>
                {submissionStatus === "server_error"
                  ? "SUBMISSION SERVICE NOTICE"
                  : "MISSION NOT COMPLETE"}
              </h2>

              <p className="modal-title" style={{ marginTop: "0.5rem" }}>
                {submissionStatus === "server_error"
                  ? submissionResult?.message || "Cloud server was temporarily unreachable. Your code is preserved safely."
                  : testResults
                  ? `${testResults.filter((r) => r.success).length} / ${testResults.length} requirements met.`
                  : "Run your code first to verify requirements before submitting."}
              </p>

              {testResults && testResults.some((r) => !r.success) && (
                <div style={{ textAlign: "left", margin: "1rem 0", background: "rgba(255,255,255,0.04)", padding: "0.75rem", borderRadius: "8px", fontSize: "0.9rem" }}>
                  <div style={{ fontWeight: 600, color: "var(--danger)", marginBottom: "0.5rem" }}>
                    Unsatisfied Requirements:
                  </div>
                  {testResults
                    .filter((r) => !r.success)
                    .slice(0, 3)
                    .map((r, idx) => (
                      <div key={idx} style={{ color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
                        • {r.message || "Test requirement failed. Check your logic."}
                      </div>
                    ))}
                </div>
              )}

              <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                Your code has been saved. Review the hints or terminal messages and try again when ready.
              </p>

              <div className="modal-actions">
                <Button variant="primary" onClick={() => setShowFailed(false)}>
                  Keep Working
                </Button>
                {allPassed && (
                  <Button variant="secondary" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? "Retrying..." : "Retry Submission"}
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}