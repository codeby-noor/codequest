import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../Button/Button";
import Badge from "../Badge/Badge";
import { validateUserChallenge } from "../../engine/challengeValidator";
import { playSuccessSound } from "../../engine/soundEffects";

/**
 * Interactive code playground.
 * Lets the user edit starter code, run it, see output, request hints,
 * and reveal the solution.
 * Supports both JavaScript (Web Worker) and HTML/CSS (sandboxed iframe)
 * challenges through the unified validator.
 */
export default function CodePlayground({ challenge, challengeType, onSolved, onValidation, onReset }) {
  const [code, setCode] = useState(challenge.starterCode);
  const [result, setResult] = useState(null);
  const [hintIndex, setHintIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [solved, setSolved] = useState(false);
  const [running, setRunning] = useState(false);
  const textareaRef = useRef(null);

  // Reset when challenge changes
  useEffect(() => {
    setCode(challenge.starterCode);
    setResult(null);
    setHintIndex(0);
    setShowSolution(false);
    setSolved(false);
  }, [challenge]);

  async function handleRun() {
    setRunning(true);
    try {
      // Merge the lesson-level challengeType into the challenge for validation.
      const challengeWithType = challengeType
        ? { ...challenge, challengeType }
        : challenge;
      const validation = await validateUserChallenge(code, challengeWithType);
      onValidation?.(validation);

      if (validation.error) {
        setResult({
          type: "error",
          title:
            validation.error.kind === "syntax"
              ? "Syntax Error"
              : validation.error.kind === "timeout"
              ? "Timed Out"
              : "Something went wrong",
          message: validation.error.message,
        });
        return;
      }

      if (validation.passed) {
        playSuccessSound();
        setResult({
          type: "success",
          title: "Correct!",
          message: "Excellent work. Your code passed the mission.",
        });
        if (!solved) {
          setSolved(true);
          onSolved?.();
        }
      } else {
        const failed = validation.results.find((r) => !r.success);
        setResult({
          type: "incorrect",
          title: "Not quite.",
          message: failed?.message || "Your code ran, but the result isn't what the mission expects.",
          actual: failed?.actual,
          expected: failed?.expected,
        });
      }
    } catch (err) {
      setResult({
        type: "error",
        title: "Something went wrong",
        message: err.message,
      });
    } finally {
      setRunning(false);
    }
  }

  function handleReset() {
    if (onReset?.() === false) return;
    setCode(challenge.starterCode);
    setResult(null);
    setHintIndex(0);
    setShowSolution(false);
  }

  function handleRevealSolution() {
    setShowSolution(true);
    setCode(challenge.solution);
  }

  const currentHint = challenge.hints[Math.min(hintIndex, challenge.hints.length - 1)];

  return (
    <div className="code-playground">
      {/* Editor */}
      <div className="playground-editor">
        <div className="playground-header">
          <span className="playground-label">Code</span>
          <div className="playground-actions">
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="primary" size="sm" onClick={handleRun} disabled={running}>
              {running ? "Running..." : "▶ Run Code"}
            </Button>
          </div>
        </div>
        <textarea
          ref={textareaRef}
          className="playground-textarea"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          aria-label="Code editor"
          aria-describedby="playground-help"
        />
        <p id="playground-help" className="playground-help">
          Write your code here, then click Run Code.
        </p>
      </div>

      {/* Output */}
      <div className="playground-output">
        <span className="playground-label">Output</span>
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key={result.type + result.title}
              className={`playground-result ${result.type}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              role="status"
            >
              <div className="playground-result-title">
                {result.type === "success" ? "✓" : result.type === "error" ? "✕" : "!"}{" "}
                {result.title}
              </div>
              <p>{result.message}</p>
              {result.actual !== undefined && (
                <div className="playground-detail">
                  <span className="detail-label">Your result:</span>
                  <code>{result.actual}</code>
                </div>
              )}
              {result.expected !== undefined && (
                <div className="playground-detail">
                  <span className="detail-label">Expected:</span>
                  <code>{result.expected}</code>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="playground-result empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p>Run your code to see the result here.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hints & Solution */}
      <div className="playground-footer">
        {!solved && !showSolution && (
          <div className="hint-section">
            <div className="hint-header">
              <Badge tone="warning">💡 Hint {Math.min(hintIndex + 1, challenge.hints.length)}</Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setHintIndex((i) => Math.min(i + 1, challenge.hints.length - 1))}
                disabled={hintIndex >= challenge.hints.length - 1}
              >
                Need another hint?
              </Button>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={hintIndex}
                className="hint-text"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                {currentHint}
              </motion.p>
            </AnimatePresence>
            <Button variant="ghost" size="sm" onClick={handleRevealSolution} className="mt-4">
              Reveal Solution
            </Button>
          </div>
        )}

        {showSolution && (
          <div className="solution-section">
            <div className="solution-header">
              <Badge tone="accent">Solution</Badge>
            </div>
            <pre className="solution-code">{challenge.solution}</pre>
            <p className="solution-explanation">{challenge.solutionExplanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}