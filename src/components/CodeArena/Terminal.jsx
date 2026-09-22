import React from "react";

/**
 * Terminal/output panel for the Code Arena.
 * Shows execution status, output, and errors.
 */
export default function Terminal({ logs, status, error }) {
  return (
    <div className="arena-terminal" role="log" aria-live="polite">
      <div className="arena-panel-header">
        <span className="arena-panel-label">Terminal</span>
        <span className={`terminal-status ${status || "idle"}`}>
          {status === "running" ? "● Running" : status === "success" ? "✓ Done" : status === "error" ? "✕ Error" : "Ready"}
        </span>
      </div>

      <div className="terminal-content">
        <div className="terminal-line">
          <span className="terminal-prompt">❯</span>
          <span className="terminal-command">Running CodeQuest tests...</span>
        </div>

        {status === "running" && (
          <div className="terminal-line">
            <span className="terminal-prompt">❯</span>
            <span className="terminal-command">Executing challenge...</span>
          </div>
        )}

        {status === "success" && (
          <>
            <div className="terminal-line">
              <span className="terminal-prompt">✓</span>
              <span className="terminal-output success">Challenge initialized</span>
            </div>
            <div className="terminal-line">
              <span className="terminal-prompt">✓</span>
              <span className="terminal-output success">Tests completed</span>
            </div>
          </>
        )}

        {status === "error" && error && (
          <div className="terminal-line">
            <span className="terminal-prompt">✕</span>
            <span className="terminal-output error">{error.message}</span>
          </div>
        )}

        {logs.length > 0 && (
          <>
            <div className="terminal-line">
              <span className="terminal-prompt">❯</span>
              <span className="terminal-command">Output:</span>
            </div>
            {logs.map((log, i) => (
              <div key={i} className="terminal-line">
                <span className="terminal-output">{log}</span>
              </div>
            ))}
          </>
        )}

        {logs.length === 0 && status === "success" && (
          <div className="terminal-line">
            <span className="terminal-output muted">(no console output)</span>
          </div>
        )}

        {!status && (
          <div className="terminal-line">
            <span className="terminal-output muted">Run your code to see output here.</span>
          </div>
        )}
      </div>
    </div>
  );
}