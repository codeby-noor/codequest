import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Test results panel for the Code Arena.
 * Shows individual test status with animated transitions.
 */
export default function TestResults({ results, running, error }) {
  const passedCount = results ? results.filter((r) => r.success).length : 0;
  const total = results ? results.length : 0;

  return (
    <div className="arena-test-results" aria-live="polite">
      <div className="arena-panel-header">
        <span className="arena-panel-label">Test Results</span>
        {results && (
          <span className={`test-summary ${passedCount === total ? "all-passed" : ""}`}>
            {passedCount} / {total}
          </span>
        )}
      </div>

      <div className="test-list">
        {running && (
          <div className="test-running">
            <span className="test-spinner" aria-hidden="true" />
            Running tests...
          </div>
        )}

        {error && (
          <div className="test-error">
            <span className="test-error-icon" aria-hidden="true">✕</span>
            <div>
              <strong>{error.friendly}</strong>
              <p>{error.hint}</p>
              <details className="test-technical">
                <summary>Technical details</summary>
                <code>{error.technical}</code>
              </details>
            </div>
          </div>
        )}

        {results && !running && !error && (
          <AnimatePresence>
            {results.map((result, i) => (
              <motion.div
                key={i}
                className={`test-item ${result.success ? "passed" : "failed"}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: i * 0.08 }}
              >
                <span className="test-item-icon" aria-hidden="true">
                  {result.success ? "✓" : "✕"}
                </span>
                <div className="test-item-info">
                  <span className="test-item-message">
                    {result.message || (result.success ? "Test passed" : "Test failed")}
                  </span>
                  {!result.success && (
                    <div className="test-item-details">
                      <span>Expected: {result.expected}</span>
                      <span>Got: {result.actual}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {!results && !running && !error && (
          <div className="test-empty">Run your code to see test results.</div>
        )}
      </div>
    </div>
  );
}